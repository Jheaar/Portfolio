/* ============================================================
   particles.js — Campo de partículas WebGL (ReactBits port)
   Corre desde el primer frame: durante el intro Y el portfolio.
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('particles-bg');
  var gl = canvas.getContext('webgl', { alpha: true, depth: false, antialias: false });
  if (!gl) return;

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.DEPTH_TEST);

  // ── Vertex shader (fuente: ReactBits Particles) ──
  var VS = `
    attribute vec3 position;
    attribute vec4 random;
    attribute vec3 color;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;
    uniform float uSpread;
    uniform float uBaseSize;
    uniform float uSizeRandomness;

    varying vec4 vRandom;
    varying vec3 vColor;

    void main() {
      vRandom = random;
      vColor  = color;

      vec3 pos = position * uSpread;
      pos.z *= 10.0;

      vec4 mPos = modelMatrix * vec4(pos, 1.0);
      float t = uTime;
      mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
      mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
      mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

      vec4 mvPos = viewMatrix * mPos;
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
      gl_Position  = projectionMatrix * mvPos;
    }
  `;

  // ── Fragment shader ──
  var FS = `
    precision highp float;

    uniform float uTime;
    varying vec4 vRandom;
    varying vec3 vColor;

    void main() {
      vec2 uv = gl_PointCoord.xy;
      float d = length(uv - vec2(0.5));
      if (d > 0.5) discard;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    }
  `;

  // ── Compilar shaders ──
  function mkShader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s));
    }
    return s;
  }

  var prog = gl.createProgram();
  gl.attachShader(prog, mkShader(gl.VERTEX_SHADER,   VS));
  gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // ── Uniformes ──
  var uTime   = gl.getUniformLocation(prog, 'uTime');
  var uSpread = gl.getUniformLocation(prog, 'uSpread');
  var uBSize  = gl.getUniformLocation(prog, 'uBaseSize');
  var uSRnd   = gl.getUniformLocation(prog, 'uSizeRandomness');
  var uModel  = gl.getUniformLocation(prog, 'modelMatrix');
  var uView   = gl.getUniformLocation(prog, 'viewMatrix');
  var uProj   = gl.getUniformLocation(prog, 'projectionMatrix');

  var COUNT = 200, SPREAD = 10, CAM_Z = 20;
  gl.uniform1f(uSpread, SPREAD);
  gl.uniform1f(uBSize,  100);
  gl.uniform1f(uSRnd,   1.0);

  // ── Generar geometría (posiciones esféricas uniformes) ──
  var positions = new Float32Array(COUNT * 3);
  var randoms   = new Float32Array(COUNT * 4);
  var colors    = new Float32Array(COUNT * 3);

  for (var i = 0; i < COUNT; i++) {
    var x, y, z, len;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      len = x * x + y * y + z * z;
    } while (len > 1 || len === 0);

    var r = Math.cbrt(Math.random());
    positions.set([x * r, y * r, z * r], i * 3);
    randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    colors.set([1, 1, 1], i * 3);
  }

  // ── Subir buffers a GPU ──
  function mkBuf(data, attr, size) {
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, attr);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }
  mkBuf(positions, 'position', 3);
  mkBuf(randoms,   'random',   4);
  mkBuf(colors,    'color',    3);

  // ── Matrices de cámara ──
  function perspective(fov, aspect, near, far) {
    var f  = 1 / Math.tan(fov * Math.PI / 360);
    var nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ]);
  }

  function lookAt(eye) {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      -eye[0], -eye[1], -eye[2], 1
    ]);
  }

  function rotXY(rx, ry, rz) {
    var cx = Math.cos(rx), sx = Math.sin(rx);
    var cy = Math.cos(ry), sy = Math.sin(ry);
    var cz = Math.cos(rz), sz = Math.sin(rz);
    return new Float32Array([
       cy*cz + sy*sx*sz,  cx*sz, -sy*cz + cy*sx*sz, 0,
      -cy*sz + sy*sx*cz,  cx*cz,  sy*sz + cy*sx*cz, 0,
       sy*cx,            -sx,     cy*cx,             0,
       0, 0, 0, 1
    ]);
  }

  // ── Mouse para inclinar las partículas ──
  var mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', function (e) {
    mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ──
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniformMatrix4fv(uProj, false, perspective(15, canvas.width / canvas.height, 0.1, 1000));
    gl.uniformMatrix4fv(uView, false, lookAt([0, 0, CAM_Z]));
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Loop de animación — nunca se interrumpe ──
  var lastMs = performance.now(), elapsed = 0, rotZ = 0;

  function particleLoop(ts) {
    requestAnimationFrame(particleLoop);
    var delta = ts - lastMs;
    lastMs = ts;
    elapsed += delta * 0.1;
    rotZ    += 0.01 * 0.1;

    gl.uniform1f(uTime, elapsed * 0.001);

    var rx = Math.sin(elapsed * 0.0002) * 0.1 + mouse.y * 0.15;
    var ry = Math.cos(elapsed * 0.0005) * 0.15 + mouse.x * 0.15;
    gl.uniformMatrix4fv(uModel, false, rotXY(rx, ry, rotZ));

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, COUNT);
  }

  requestAnimationFrame(particleLoop);
})();
