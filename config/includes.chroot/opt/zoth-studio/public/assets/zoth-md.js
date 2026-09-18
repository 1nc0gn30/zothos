/**
 * Small GitHub-flavored-ish markdown → HTML for the README library.
 */
(function (root) {
  'use strict';

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function inline(s) {
    s = esc(s);
    // Un-escape safe HTML img/div/span/a tags for rich badges and banner images
    s = s.replace(/&lt;img\s+([^&gt;]+)&gt;/gi, '<img $1 />');
    s = s.replace(/&lt;(\/?(div|span|strong|em|p|br|code|pre|kbd))\s*([^&gt;]*)&gt;/gi, '<$1 $3>');

    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, src) {
      return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" class="md-img" loading="lazy" />';
    });

    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, t, h) {
      var abs = /^https?:\/\//i.test(h) || h.charAt(0) === '/';
      var href = abs ? h : h.replace(/^\.\//, '');
      if (!abs && /\.md($|#)/i.test(href)) {
        href = '/docs/readmes.html?doc=' + encodeURIComponent(href.replace(/\.md$/i, '').replace(/.*\//, ''));
      }
      var ext = /^https?:\/\//i.test(h) ? ' rel="noopener noreferrer" target="_blank"' : '';
      return '<a href="' + esc(href) + '"' + ext + '>' + t + '</a>';
    });
    return s;
  }

  function render(md) {
    var lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
    var html = [];
    var i = 0;
    var inCode = false;
    var code = [];
    var listType = null;

    function closeList() {
      if (listType) {
        html.push('</' + listType + '>');
        listType = null;
      }
    }

    while (i < lines.length) {
      var line = lines[i];

      if (inCode) {
        if (/^```/.test(line)) {
          html.push('<pre class="md-pre"><code>' + esc(code.join('\n')) + '</code></pre>');
          inCode = false;
          code = [];
        } else {
          code.push(line);
        }
        i++;
        continue;
      }

      if (/^```/.test(line)) {
        closeList();
        inCode = true;
        code = [];
        i++;
        continue;
      }

      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*[-:| ]+\|/.test(lines[i + 1])) {
        closeList();
        var rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) {
          rows.push(lines[i]);
          i++;
        }
        var head = rows[0].replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); });
        var body = rows.slice(2);
        var th = head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('');
        var trs = body.map(function (r) {
          var cells = r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); });
          return '<tr>' + cells.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
        }).join('');
        html.push('<div class="md-table-wrap"><table class="md-table"><thead><tr>' + th + '</tr></thead><tbody>' + trs + '</tbody></table></div>');
        continue;
      }

      var hm = /^(#{1,6})\s+(.+)$/.exec(line);
      if (hm) {
        closeList();
        var lvl = hm[1].length;
        var id = hm[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        html.push('<h' + lvl + ' id="' + id + '">' + inline(hm[2]) + '</h' + lvl + '>');
        i++;
        continue;
      }

      if (/^---+$/.test(line.trim())) {
        closeList();
        html.push('<hr/>');
        i++;
        continue;
      }

      if (/^>\s?/.test(line)) {
        closeList();
        var bq = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          bq.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        html.push('<blockquote>' + inline(bq.join(' ')) + '</blockquote>');
        continue;
      }

      var ul = /^[-*]\s+(.+)$/.exec(line);
      var ol = /^\d+\.\s+(.+)$/.exec(line);
      if (ul || ol) {
        var want = ul ? 'ul' : 'ol';
        if (listType !== want) {
          closeList();
          listType = want;
          html.push('<' + want + '>');
        }
        html.push('<li>' + inline((ul || ol)[1]) + '</li>');
        i++;
        continue;
      }

      if (!line.trim()) {
        closeList();
        i++;
        continue;
      }

      closeList();
      html.push('<p>' + inline(line) + '</p>');
      i++;
    }
    closeList();
    if (inCode) html.push('<pre class="md-pre"><code>' + esc(code.join('\n')) + '</code></pre>');
    return html.join('\n');
  }

  root.ZothMd = { render: render, esc: esc };
})(typeof window !== 'undefined' ? window : this);
