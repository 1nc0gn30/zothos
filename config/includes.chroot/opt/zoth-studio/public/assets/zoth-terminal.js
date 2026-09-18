/**
 * Zoth Universal Web PTY Terminal Component (v2.0 Ultra)
 * Renders an authentic, full-featured interactive terminal inside the browser
 * using xterm.js, matching Zoth 4-Theme Engine with real bidirectional PTY streaming.
 */

(function (window) {
  'use strict';

  var ZothTerminal = function (containerId, options) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.options = options || {};
    this.sessionId = this.options.sessionId || 'zoth_pty_sovereign-app';
    var proto = (window.location.protocol === 'https:') ? 'https:' : 'http:';
    var host = window.location.hostname;
    var defaultBase = (!host || host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') ? 'http://127.0.0.1:8484' : (proto + '//' + host + ':8484');
    this.apiBase = this.options.apiBase || defaultBase;
    
    this.term = null;
    this.fitAddon = null;
    this.pollInterval = null;
    this.currentChunkIndex = 0;
    this.isPolling = false;
    this.onFilesChange = this.options.onFilesChange || null;
    this.onIndexFound = this.options.onIndexFound || null;
    this.onOutputChunk = this.options.onOutputChunk || null;

    this.init();
  };

  ZothTerminal.prototype.getThemePalette = function () {
    var theme = document.documentElement.getAttribute('data-theme') || 'dark';
    if (theme === 'matrix') {
      return {
        background: '#020d04',
        foreground: '#00ff66',
        cursor: '#00ff66',
        selectionBackground: 'rgba(0, 255, 102, 0.3)',
        black: '#000000',
        green: '#00ff66',
        brightGreen: '#33ff88',
        cyan: '#00ffcc',
        brightCyan: '#66ffea'
      };
    } else if (theme === 'gold') {
      return {
        background: '#0d0905',
        foreground: '#f3ebd4',
        cursor: '#fbbf24',
        selectionBackground: 'rgba(251, 191, 36, 0.3)',
        yellow: '#fbbf24',
        brightYellow: '#fde68a',
        red: '#f87171',
        cyan: '#38bdf8'
      };
    } else if (theme === 'light') {
      return {
        background: '#f8fafc',
        foreground: '#0f172a',
        cursor: '#0284c7',
        selectionBackground: 'rgba(2, 132, 199, 0.25)',
        black: '#0f172a',
        white: '#ffffff',
        cyan: '#0284c7',
        blue: '#2563eb'
      };
    }
    // Default Dark Void
    return {
      background: '#03050a',
      foreground: '#f1f5f9',
      cursor: '#00f0ff',
      selectionBackground: 'rgba(0, 240, 255, 0.3)',
      black: '#0a0f1d',
      red: '#f43f5e',
      green: '#34d399',
      yellow: '#fbbf24',
      blue: '#38bdf8',
      magenta: '#c084fc',
      cyan: '#00f0ff',
      white: '#ffffff',
      brightCyan: '#38bdf8'
    };
  };

  ZothTerminal.prototype.init = function () {
    if (!this.container || !window.Terminal) return;

    this.term = new window.Terminal({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 13,
      lineHeight: 1.25,
      fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
      theme: this.getThemePalette(),
      allowTransparency: true,
      convertEol: true,
      cols: 90,
      rows: 24
    });

    if (window.FitAddon && window.FitAddon.FitAddon) {
      this.fitAddon = new window.FitAddon.FitAddon();
      this.term.loadAddon(this.fitAddon);
    }

    this.term.open(this.container);
    
    var self = this;
    setTimeout(function() {
      if (self.fitAddon) {
        try {
          self.fitAddon.fit();
          self.sendResize(self.term.cols, self.term.rows);
        } catch(e) {}
      }
    }, 150);

    // ResizeObserver: re-fit whenever the container's actual box size changes,
    // not just on a native window 'resize' event. Mobile layouts (flex/grid
    // settling, orientation, device-frame scaling, CDP viewport overrides)
    // can change the container's true width without ever firing 'resize',
    // leaving xterm's internal canvas wider than the real viewport.
    if (window.ResizeObserver) {
      var lastW = 0, lastH = 0;
      this.resizeObserver = new ResizeObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var cr = entries[i].contentRect;
          if (Math.abs(cr.width - lastW) > 2 || Math.abs(cr.height - lastH) > 2) {
            lastW = cr.width;
            lastH = cr.height;
            if (self.fitAddon && self.term) {
              try {
                self.fitAddon.fit();
                self.sendResize(self.term.cols, self.term.rows);
              } catch (e) {}
            }
          }
        }
      });
      this.resizeObserver.observe(this.container);
    }

    // Handle user keystrokes into PTY
    this.term.onData(function (data) {
      self.sendInput(data);
    });

    // Handle Window Resize
    window.addEventListener('resize', function () {
      if (self.fitAddon && self.term) {
        try {
          self.fitAddon.fit();
          self.sendResize(self.term.cols, self.term.rows);
        } catch(e) {}
      }
    });

    // Theme changes observer
    window.addEventListener('zoth-theme-change', function () {
      if (self.term) {
        self.term.options.theme = self.getThemePalette();
      }
    });

    // Start stream sync
    this.startStreaming();
  };

  ZothTerminal.prototype.sendInput = function (data) {
    if (!this.sessionId) return;
    fetch(this.apiBase + '/api/zoth/pty/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        data: data
      })
    }).catch(function (e) {
      console.warn('PTY Write notice:', e);
    });
  };

  ZothTerminal.prototype.sendResize = function (cols, rows) {
    if (!this.sessionId) return;
    fetch(this.apiBase + '/api/zoth/pty/resize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        cols: cols,
        rows: rows
      })
    }).catch(function () {});
  };

  ZothTerminal.prototype.startStreaming = function () {
    if (this.pollInterval) clearInterval(this.pollInterval);
    var self = this;

    this.pollInterval = setInterval(function () {
      if (!self.sessionId || self.isPolling) return;
      self.isPolling = true;

      fetch(self.apiBase + '/api/zoth/pty/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: self.sessionId,
          chunkIndex: self.currentChunkIndex
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        self.isPolling = false;
        if (data && data.status === 'ok') {
          if (data.output && data.output.length > 0) {
            self.term.write(data.output);
            if (self.onOutputChunk) {
              self.onOutputChunk(data.output);
            }
          }
          if (typeof data.nextIndex === 'number') {
            self.currentChunkIndex = data.nextIndex;
          }

          if (self.onFilesChange && data.files) {
            self.onFilesChange(data.files);
          }

          if (self.onIndexFound && data.hasIndex) {
            self.onIndexFound(data.previewUrl);
          }
        }
      })
      .catch(function () {
        self.isPolling = false;
      });
    }, 150);
  };

  ZothTerminal.prototype.switchSession = function (sessionId, slug) {
    this.sessionId = sessionId;
    this.slug = slug;
    this.currentChunkIndex = 0;
    if (this.term) {
      this.term.clear();
      this.term.reset();
    }
  };

  window.ZothTerminal = ZothTerminal;

})(window);
