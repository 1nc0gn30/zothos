/**
 * Netrunner Memory — cinematic 3D stratum.
 * Dresses the graph scene (obsidian disk, starfield, Lucy hologram) and
 * the maze (grid floor, token lights). Theme-aware. Respects reduced motion.
 */
(function (root) {
  "use strict";
  if (root.ZothNetrunnerScene) return;

  function THREE() { return root.THREE; }

  function reduced() {
    return root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function skipWebGL() {
    if (!root.matchMedia) return false;
    return root.matchMedia("(max-width: 1100px), (pointer: coarse)").matches;
  }

  function tokenHex(name, fallback) {
    try {
      var raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      if (/^#[0-9a-fA-F]{6}$/.test(raw)) return parseInt(raw.slice(1), 16);
      if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
        return parseInt(raw[1] + raw[1] + raw[2] + raw[2] + raw[3] + raw[3], 16);
      }
    } catch (e) {}
    return fallback;
  }

  function palette(themeName) {
    var t = String(themeName || "").toLowerCase();
    var accent = tokenHex("--accent", 0x00f0ff);
    var cyan = tokenHex("--cyan", 0x00f0ff);
    var gold = tokenHex("--gold", 0xfbbf24);
    var bg = tokenHex("--bg", 0x05070e);
    if (t.indexOf("gold") !== -1) {
      return { bg: 0x070603, fog: 0x070603, a: 0xfbbf24, b: 0xf59e0b, c: 0xe8c872, floor: 0x0c0904 };
    }
    if (t.indexOf("matrix") !== -1) {
      return { bg: 0x020804, fog: 0x020804, a: 0x00ff66, b: 0x10b981, c: 0xa3e635, floor: 0x031208 };
    }
    if (t.indexOf("synthwave") !== -1) {
      return { bg: 0x09030c, fog: 0x09030c, a: 0xff007a, b: 0x00f0ff, c: 0xa78bfa, floor: 0x120418 };
    }
    if (t === "light" || t === "paper" || t === "snow" || t === "champagne" || t === "ivory" || t === "pearl") {
      return { bg: 0xe8eef6, fog: 0xd5dee8, a: 0x0a2540, b: 0x635bff, c: 0x334155, floor: 0xf4f7fb, light: true };
    }
    return { bg: bg || 0x05070e, fog: bg || 0x060912, a: cyan || accent, b: 0xf472b6, c: gold, floor: 0x070910 };
  }

  function makeGridCanvas(major, minor, fade) {
    var cv = document.createElement("canvas");
    cv.width = 1024;
    cv.height = 1024;
    var ctx = cv.getContext("2d");
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.strokeStyle = minor;
    ctx.lineWidth = 1;
    var step = 1024 / 32;
    for (var i = 0; i <= 32; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, 1024);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(1024, i * step);
      ctx.stroke();
    }
    ctx.strokeStyle = major;
    ctx.lineWidth = 2;
    for (var j = 0; j <= 8; j++) {
      var p = j * (1024 / 8);
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, 1024);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(1024, p);
      ctx.stroke();
    }
    var g = ctx.createRadialGradient(512, 512, 80, 512, 512, 520);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, fade);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 1024);
    return cv;
  }

  function makeScanTex() {
    var cv = document.createElement("canvas");
    cv.width = 64;
    cv.height = 256;
    var ctx = cv.getContext("2d");
    var g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "rgba(0,240,255,0)");
    g.addColorStop(0.45, "rgba(0,240,255,0.55)");
    g.addColorStop(0.5, "rgba(255,255,255,0.85)");
    g.addColorStop(0.55, "rgba(0,240,255,0.55)");
    g.addColorStop(1, "rgba(0,240,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 256);
    for (var y = 0; y < 256; y += 4) {
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(0, y, 64, 1);
    }
    return cv;
  }

  function starField(T, count, radius) {
    var pos = new Float32Array(count * 3);
    var col = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      var u = Math.random();
      var v = Math.random();
      var theta = 2 * Math.PI * u;
      var phi = Math.acos(2 * v - 1);
      var r = radius * (0.55 + Math.random() * 0.45);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62;
      pos[i * 3 + 2] = r * Math.cos(phi);
      var w = 0.55 + Math.random() * 0.45;
      col[i * 3] = w;
      col[i * 3 + 1] = w;
      col[i * 3 + 2] = w;
    }
    var geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.BufferAttribute(pos, 3));
    geo.setAttribute("color", new T.BufferAttribute(col, 3));
    var mat = new T.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: T.AdditiveBlending,
      sizeAttenuation: true
    });
    return new T.Points(geo, mat);
  }

  function dressGraph(scene, renderer, camera, store) {
    var T = THREE();
    if (!scene || !T) return null;
    store = store || {};
    var pal = palette(document.documentElement.getAttribute("data-theme") || "dark");
    var env = new T.Group();
    env.name = "nr-env";
    scene.add(env);

    scene.fog = new T.FogExp2(pal.fog, pal.light ? 0.00055 : 0.0009);
    renderer.setClearColor(pal.bg, 1);

    if (window.ZothStudio3D && ZothStudio3D.dressRenderer) {
      ZothStudio3D.dressRenderer(renderer);
      renderer.toneMappingExposure = pal.light ? 1.05 : 1.12;
    }

    try {
      if (T.PMREMGenerator) {
        var pmrem = new T.PMREMGenerator(renderer);
        var envScene = new T.Scene();
        envScene.add(new T.HemisphereLight(pal.a, 0x08060a, 1.05));
        var shell = new T.Mesh(
          new T.SphereGeometry(14, 24, 16),
          new T.MeshBasicMaterial({ color: pal.floor, side: T.BackSide })
        );
        envScene.add(shell);
        var blob = new T.Mesh(new T.SphereGeometry(2.4, 12, 10), new T.MeshBasicMaterial({ color: pal.c }));
        blob.position.set(-7, 6, -9);
        envScene.add(blob);
        var blob2 = new T.Mesh(new T.SphereGeometry(1.6, 10, 8), new T.MeshBasicMaterial({ color: pal.a }));
        blob2.position.set(8, -3, 6);
        envScene.add(blob2);
        scene.environment = pmrem.fromScene(envScene, 0.08).texture;
        pmrem.dispose();
      }
    } catch (e) {}

    var Phys = T.MeshPhysicalMaterial || T.MeshStandardMaterial;
    var floor = new T.Mesh(
      new T.CircleGeometry(520, 96),
      new Phys({
        color: pal.floor,
        metalness: pal.light ? 0.12 : 0.96,
        roughness: pal.light ? 0.42 : 0.08,
        clearcoat: pal.light ? 0.2 : 0.85,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.4,
        emissive: pal.light ? 0x000000 : 0x03060c,
        emissiveIntensity: pal.light ? 0 : 0.35
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -42;
    floor.receiveShadow = true;
    env.add(floor);

    var gridCv = makeGridCanvas(
      pal.light ? "rgba(10,37,64,0.22)" : "rgba(0,240,255,0.28)",
      pal.light ? "rgba(10,37,64,0.08)" : "rgba(0,240,255,0.08)",
      pal.light ? "rgba(244,247,251,0.92)" : "rgba(5,7,14,0.92)"
    );
    var gridTex = new T.CanvasTexture(gridCv);
    gridTex.anisotropy = 8;
    var gridMat = new T.MeshBasicMaterial({
      map: gridTex,
      transparent: true,
      opacity: pal.light ? 0.55 : 0.42,
      depthWrite: false
    });
    var grid = new T.Mesh(new T.CircleGeometry(500, 64), gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -41.6;
    env.add(grid);

    function inlay(r, tube, color, opacity) {
      var mesh = new T.Mesh(
        new T.TorusGeometry(r, tube, 10, 160),
        new T.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: opacity,
          blending: pal.light ? T.NormalBlending : T.AdditiveBlending,
          depthWrite: false
        })
      );
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y = -41.4;
      env.add(mesh);
      return mesh;
    }
    var inlayA = inlay(168, 0.45, pal.c, 0.32);
    var inlayB = inlay(248, 0.28, pal.a, 0.28);
    var inlayC = inlay(338, 0.18, pal.b, 0.16);

    var stars = starField(T, 2800, 1600);
    env.add(stars);

    var dustCount = 900;
    var dPos = new Float32Array(dustCount * 3);
    for (var d = 0; d < dustCount; d++) {
      var rad = 80 + Math.random() * 420;
      var th = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      dPos[d * 3] = rad * Math.sin(ph) * Math.cos(th);
      dPos[d * 3 + 1] = rad * Math.sin(ph) * Math.sin(th) * 0.55;
      dPos[d * 3 + 2] = rad * Math.cos(ph);
    }
    var dGeo = new T.BufferGeometry();
    dGeo.setAttribute("position", new T.BufferAttribute(dPos, 3));
    var dust = new T.Points(
      dGeo,
      new T.PointsMaterial({
        color: pal.a,
        size: 1.35,
        transparent: true,
        opacity: 0.42,
        blending: T.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      })
    );
    env.add(dust);

    var column = new T.Mesh(
      new T.CylinderGeometry(12, 20, 88, 32, 1, true),
      new T.MeshBasicMaterial({
        color: pal.a,
        transparent: true,
        opacity: pal.light ? 0.04 : 0.05,
        side: T.DoubleSide,
        blending: T.AdditiveBlending,
        depthWrite: false
      })
    );
    column.position.y = 6;
    env.add(column);

    var scanTex = new T.CanvasTexture(makeScanTex());
    scanTex.wrapS = T.RepeatWrapping;
    scanTex.wrapT = T.RepeatWrapping;
    scanTex.repeat.set(1, 2);
    var scan = new T.Mesh(
      new T.CylinderGeometry(22, 22, 70, 32, 1, true),
      new T.MeshBasicMaterial({
        map: scanTex,
        transparent: true,
        opacity: 0.28,
        side: T.DoubleSide,
        blending: T.AdditiveBlending,
        depthWrite: false
      })
    );
    scan.position.y = 8;
    env.add(scan);

    var core = new T.Mesh(
      new T.OctahedronGeometry(7.5, 0),
      new Phys({
        color: pal.a,
        metalness: 0.2,
        roughness: 0.12,
        emissive: pal.a,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.7,
        clearcoat: 1
      })
    );
    core.position.y = 8;
    env.add(core);

    var loader = new T.TextureLoader();
    var lucyMat = new T.SpriteMaterial({
      map: loader.load("/assets/lucy.png"),
      transparent: true,
      opacity: 0.94,
      blending: T.NormalBlending,
      depthWrite: false
    });
    var lucy = new T.Sprite(lucyMat);
    lucy.scale.set(28, 46, 1);
    lucy.position.set(0, 16, 0);
    env.add(lucy);

    var pedestal = new T.Mesh(
      new T.CylinderGeometry(26, 34, 6, 48),
      new Phys({
        color: pal.floor,
        metalness: 0.9,
        roughness: 0.18,
        emissive: pal.a,
        emissiveIntensity: 0.08
      })
    );
    pedestal.position.y = -38;
    env.add(pedestal);

    var rings = [];
    [32, 44, 58].forEach(function (r, i) {
      var ring = new T.Mesh(
        new T.TorusGeometry(r, 0.28, 8, 96),
        new T.MeshBasicMaterial({
          color: i === 1 ? pal.b : pal.a,
          transparent: true,
          opacity: 0.55 - i * 0.1,
          blending: T.AdditiveBlending,
          depthWrite: false
        })
      );
      ring.position.y = 8;
      ring.rotation.x = Math.PI / 2 + (i - 1) * 0.42;
      env.add(ring);
      rings.push(ring);
    });

    var nexusLight = new T.PointLight(pal.a, pal.light ? 0.45 : 0.95, 280, 1.8);
    nexusLight.position.set(0, 18, 0);
    env.add(nexusLight);

    store.env = env;
    store.floor = floor;
    store.grid = grid;
    store.stars = stars;
    store.dustMesh = dust;
    store.column = column;
    store.scan = scan;
    store.scanTex = scanTex;
    store.core = core;
    store.lucySprite = lucy;
    store.pedestal = pedestal;
    store.rings = rings;
    store.inlays = [inlayA, inlayB, inlayC];
    store.nexusLight = nexusLight;
    store.pal = pal;
    return store;
  }

  function applyTheme(store, themeName) {
    if (!store || !store.env) return;
    var T = THREE();
    var pal = palette(themeName);
    store.pal = pal;
    if (store.renderer) store.renderer.setClearColor(pal.bg, 1);
    if (store.scene && store.scene.fog) store.scene.fog.color.setHex(pal.fog);
    if (store.dustMesh && store.dustMesh.material) store.dustMesh.material.color.setHex(pal.a);
    if (store.column && store.column.material) store.column.material.color.setHex(pal.a);
    if (store.core && store.core.material) {
      if (store.core.material.color) store.core.material.color.setHex(pal.a);
      if (store.core.material.emissive) store.core.material.emissive.setHex(pal.a);
    }
    if (store.nexusLight) store.nexusLight.color.setHex(pal.a);
    if (store.inlays) {
      if (store.inlays[0]) store.inlays[0].material.color.setHex(pal.c);
      if (store.inlays[1]) store.inlays[1].material.color.setHex(pal.a);
      if (store.inlays[2]) store.inlays[2].material.color.setHex(pal.b);
    }
    if (store.rings) {
      store.rings.forEach(function (r, i) {
        if (r.material) r.material.color.setHex(i === 1 ? pal.b : pal.a);
      });
    }
    if (store.floor && store.floor.material && store.floor.material.color) {
      store.floor.material.color.setHex(pal.floor);
    }
    if (store.lucySprite && store.lucySprite.material) {
      store.lucySprite.material.blending = T.NormalBlending;
    }
  }

  function tick(store, time) {
    if (!store || reduced()) return;
    if (store.stars) store.stars.rotation.y = time * 0.012;
    if (store.dustMesh) {
      store.dustMesh.rotation.y = time * 0.04;
      store.dustMesh.rotation.x = time * 0.015;
    }
    if (store.scanTex) store.scanTex.offset.y = (time * 0.18) % 1;
    if (store.scan) store.scan.rotation.y = time * 0.25;
    if (store.core) {
      store.core.rotation.y = time * 0.55;
      store.core.rotation.x = Math.sin(time * 0.4) * 0.25;
    }
    if (store.lucySprite) {
      store.lucySprite.position.y = 16 + Math.sin(time * 1.4) * 1.4;
      if (store.lucySprite.material) {
        store.lucySprite.material.opacity = 0.9 + 0.06 * Math.sin(time * 2.1);
      }
    }
    if (store.rings) {
      store.rings.forEach(function (r, i) {
        r.rotation.z = time * (0.22 + i * 0.08) * (i % 2 ? -1 : 1);
      });
    }
    if (store.column) store.column.rotation.y = time * 0.08;
  }

  function mazeGridTexture() {
    var T = THREE();
    var cv = makeGridCanvas("rgba(0,240,255,0.45)", "rgba(0,240,255,0.12)", "rgba(5,7,14,0.55)");
    var tex = new T.CanvasTexture(cv);
    tex.wrapS = T.RepeatWrapping;
    tex.wrapT = T.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.anisotropy = 8;
    return tex;
  }

  root.ZothNetrunnerScene = {
    skipWebGL: skipWebGL,
    reduced: reduced,
    palette: palette,
    dressGraph: dressGraph,
    applyTheme: applyTheme,
    tick: tick,
    mazeGridTexture: mazeGridTexture
  };
})(typeof window !== "undefined" ? window : this);
