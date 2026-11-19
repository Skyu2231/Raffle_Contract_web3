import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * A self-contained WebGL showpiece for the hero.
 *
 * Pass 1 raymarches a procedural liquid-chrome torus (SDF, domain twist,
 * curl-noise surface displacement) into an offscreen buffer.
 * Pass 2 adds advected fluid particles, then runs the offscreen buffer
 * through a post pass (chromatic aberration, bloom, grain, vignette).
 *
 * No dependencies beyond the browser's WebGL 1 context.
 */

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const SCENE_FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_light;
uniform vec4 u_ripple; // xy = screen centre, z = age, w = strength

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(p);
  float n100 = hash13(p + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(p + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(p + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(p + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(p + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(p + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(p + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 2; i++) {
    sum += amp * noise(p);
    p = p * 2.03 + 11.3;
    amp *= 0.5;
  }
  return sum / 0.75;
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

float map(vec3 p) {
  float t = u_time * 0.26;

  p.xz *= rot(t);
  p.yz *= rot(sin(t * 0.8) * 0.5);
  p.xz *= rot(p.y * 1.35 + t * 1.7);

  float d = sdTorus(p, vec2(0.9, 0.34));

  // divergence-free-ish advection of a noise field -> fluid surface.
  vec3 q = p * 1.55;
  q.yz *= rot(u_time * 0.45);
  q += vec3(0.0, u_time * 0.55, 0.0);
  float fluid = fbm(q) - 0.5;
  d -= fluid * 0.34;
  d += 0.012 * sin(12.0 * p.x + u_time * 1.4)
             * sin(11.0 * p.y - u_time * 1.1)
             * sin(10.0 * p.z + u_time * 0.7);

  // pointer impulse: an expanding ring pressed into the surface.
  vec2 suv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float rdist = length(suv - u_ripple.xy);
  float wave = sin(rdist * 26.0 - u_ripple.z * 12.0)
             * exp(-rdist * 3.5) * exp(-u_ripple.z * 1.5) * u_ripple.w;
  d -= wave * 0.085;

  // a droplet orbiting the main mass.
  vec3 o = vec3(cos(u_time * 0.9) * 1.35, sin(u_time * 0.7) * 0.6, sin(u_time * 0.9) * 1.35);
  float drop = length(p - o) - 0.15;

  return min(d, drop);
}

vec3 calcNormal(vec3 p) {
  vec2 k = vec2(1.0, -1.0);
  float h = 0.0016;
  return normalize(
    k.xyy * map(p + k.xyy * h) +
    k.yyx * map(p + k.yyx * h) +
    k.yxy * map(p + k.yxy * h) +
    k.xxx * map(p + k.xxx * h)
  );
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);

  float t = u_time;
  vec3 ro = vec3(0.0, 0.18 + u_mouse.y * 0.42, 5.6);
  ro.xz *= rot(u_mouse.x * 0.45 + sin(t * 0.14) * 0.14);

  vec3 ta = vec3(0.0);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
  vec3 vv = cross(ww, uu);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.6 * ww);

  float d = 0.0;
  float hit = 0.0;
  vec3 pos = ro;

  for (int i = 0; i < 80; i++) {
    pos = ro + rd * d;
    float s = map(pos);
    if (abs(s) < 0.0016) {
      hit = 1.0;
      break;
    }
    d += s * 0.9;
    if (d > 9.8) break;
  }

  float glow = exp(-length(uv * vec2(1.0, 1.45) - vec2(0.04, -0.06)) * 2.6);
  float lt = u_light;
  vec3 bg = mix(vec3(0.008, 0.007, 0.007), vec3(0.89, 0.855, 0.78), lt);
  vec3 col;

  if (hit > 0.5) {
    vec3 n = calcNormal(pos);
    vec3 l1 = normalize(vec3(0.6, 0.85, 0.5));
    vec3 l2 = normalize(vec3(-0.8, -0.2, 0.4));

    float dif = max(dot(n, l1), 0.0);
    float dif2 = max(dot(n, l2), 0.0);
    vec3 r = reflect(rd, n);
    float spec = pow(max(dot(r, l1), 0.0), 40.0);
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    float irid = 0.5 + 0.5 * sin(rim * 6.0 + n.y * 3.0 + t * 0.5);

    vec3 chrome = mix(vec3(0.035, 0.033, 0.03), vec3(0.11, 0.105, 0.10), lt);
    chrome += vec3(1.0) * spec * mix(1.2, 0.9, lt);
    chrome += vec3(1.0, 0.35, 0.06) * rim * (0.85 + 0.2 * irid);
    chrome += vec3(0.9, 0.75, 0.6) * dif * mix(0.12, 0.4, lt);
    chrome += vec3(0.15, 0.22, 0.4) * dif2 * 0.35;
    chrome += vec3(0.25, 0.4, 0.6) * pow(1.0 - abs(dot(n, rd)), 4.0) * 0.4;

    // the impulse leaves a hot ring on the chrome.
    float rp = exp(-length(uv - u_ripple.xy) * 4.0) * exp(-u_ripple.z * 2.0) * u_ripple.w;
    chrome += vec3(1.0, 0.42, 0.1) * rp * 0.35;

    col = chrome;
  } else {
    col = bg + vec3(1.0, 0.26, 0.03) * glow * mix(0.12, 0.07, lt);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

const POST_FRAG = `
precision highp float;

uniform sampler2D u_scene;
uniform vec2 u_res;
uniform float u_time;
uniform float u_light;
uniform float u_grid;
uniform vec4 u_ripple;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 c = uv - 0.5;
  float r2 = dot(c, c);
  vec2 dir = normalize(c + vec2(0.00001));

  // chromatic aberration grows toward the frame edges.
  float ca = 0.0012 + r2 * 0.006;
  vec3 col;
  col.r = texture2D(u_scene, uv + dir * ca).r;
  col.g = texture2D(u_scene, uv).g;
  col.b = texture2D(u_scene, uv - dir * ca).b;

  // cheap separable-free bloom: ring taps around the pixel.
  vec3 bloom = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398;
    bloom += texture2D(u_scene, uv + vec2(cos(a), sin(a)) * 0.004).rgb;
  }
  bloom /= 8.0;
  col += max(bloom - mix(0.16, 0.72, u_light), 0.0) * mix(0.7, 0.45, u_light);
  col += max(bloom - mix(0.5, 0.9, u_light), 0.0) * 0.9;

  col = pow(col, vec3(0.95));

  // technical grid, warped outward by the tap impulse.
  vec2 suv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  vec2 off = suv - u_ripple.xy;
  float rdist = length(off);
  float wave = sin(rdist * 26.0 - u_ripple.z * 12.0)
             * exp(-rdist * 3.5) * exp(-u_ripple.z * 1.5) * u_ripple.w;
  vec2 g = gl_FragCoord.xy / u_res + normalize(off + vec2(0.0001)) * wave * 0.06;

  vec2 gp = g * u_res;
  vec2 cell = abs(fract(gp / u_grid - 0.5) - 0.5) * u_grid;
  float line = 1.0 - smoothstep(0.4, 1.3, min(cell.x, cell.y));
  float mask = 1.0 - smoothstep(0.34, 0.92, length(c));
  float gridA = line * mask * mix(0.06, 0.075, u_light) * (1.0 + 2.2 * abs(wave));
  vec3 gridCol = mix(vec3(0.96), vec3(0.06), u_light);
  col = mix(col, gridCol, clamp(gridA, 0.0, 0.35));

  col *= 1.0 - mix(0.5, 0.16, u_light) * r2;
  col += (hash(gl_FragCoord.xy + fract(u_time) * 100.0) - 0.5) * 0.045;

  gl_FragColor = vec4(col, 1.0);
}
`;

const POINT_VERT = `
attribute vec2 a_position;
attribute float a_alpha;
uniform vec2 u_res;
varying float v_alpha;

void main() {
  vec2 p = a_position / u_res;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 1.6;
  v_alpha = a_alpha;
}
`;

const POINT_FRAG = `
precision mediump float;
varying float v_alpha;
uniform float u_light;

void main() {
  vec3 tint = mix(vec3(1.0, 0.5, 0.2), vec3(0.2, 0.13, 0.08), u_light);
  gl_FragColor = vec4(tint, v_alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[hero-scene] shader error", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function program(gl: WebGLRenderingContext, vert: string, frag: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[hero-scene] link error", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

type Props = { className?: string; theme?: "light" | "dark" };

export function HeroScene({ className = "", theme = "dark" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const light = theme === "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const sceneProg = program(gl, VERT, SCENE_FRAG);
    const postProg = program(gl, VERT, POST_FRAG);
    const pointProg = program(gl, POINT_VERT, POINT_FRAG);
    if (!sceneProg || !postProg || !pointProg) return;

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const scenePos = gl.getAttribLocation(sceneProg, "a_position");
    const postPos = gl.getAttribLocation(postProg, "a_position");
    const pointPos = gl.getAttribLocation(pointProg, "a_position");
    const pointAlpha = gl.getAttribLocation(pointProg, "a_alpha");

    const sceneRes = gl.getUniformLocation(sceneProg, "u_res");
    const sceneTime = gl.getUniformLocation(sceneProg, "u_time");
    const sceneMouse = gl.getUniformLocation(sceneProg, "u_mouse");
    const sceneLight = gl.getUniformLocation(sceneProg, "u_light");
    const sceneRipple = gl.getUniformLocation(sceneProg, "u_ripple");
    const postScene = gl.getUniformLocation(postProg, "u_scene");
    const postRes = gl.getUniformLocation(postProg, "u_res");
    const postTime = gl.getUniformLocation(postProg, "u_time");
    const postLight = gl.getUniformLocation(postProg, "u_light");
    const postGrid = gl.getUniformLocation(postProg, "u_grid");
    const postRipple = gl.getUniformLocation(postProg, "u_ripple");
    const pointRes = gl.getUniformLocation(pointProg, "u_res");
    const pointLight = gl.getUniformLocation(pointProg, "u_light");

    // offscreen scene target (recreated on resize)
    let texture: WebGLTexture | null = null;
    let framebuffer: WebGLFramebuffer | null = null;
    let width = 0;
    let height = 0;
    let gridPx = 56;

    const target = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    const ripple = { x: 0, y: 0, age: 0, strength: 0 };
    let visible = true;
    let last = 0;
    let started = 0;
    let raf = 0;

    // fluid particles, advected by a divergence-free sine field.
    const particles: { x: number; y: number; alpha: number; vx: number; vy: number }[] = [];
    const positions = new Float32Array(1200);
    const alphas = new Float32Array(600);
    const pointBuffer = gl.createBuffer();
    const alphaBuffer = gl.createBuffer();

    const seedParticles = () => {
      if (!width || !height) return;
      const count = Math.min(particles.length || 480, 480);
      for (let i = 0; i < count; i++) {
        particles[i] = {
          x: Math.random() * width,
          y: Math.random() * height,
          alpha: 0.1 + Math.random() * 0.28,
          vx: 0,
          vy: 0,
        };
        alphas[i] = particles[i].alpha;
      }
      particles.length = count;
    };

    const resize = () => {
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (!cssW || !cssH) return;

      // keep the raymarch cheap: cap the backing width and scale with DPR.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.7;
      const w = Math.max(280, Math.min(1100, Math.round(cssW * scale)));
      const h = Math.max(160, Math.round((cssH / cssW) * w));
      gridPx = Math.max(24, 56 * (w / cssW));
      if (w === width && h === height) return;

      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;

      if (texture) gl.deleteTexture(texture);
      if (framebuffer) gl.deleteFramebuffer(framebuffer);

      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      seedParticles();
    };

    const stepParticles = (dt: number, time: number) => {
      const count = particles.length;
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const nx = (p.x / width) * 6.0;
        const ny = (p.y / height) * 4.0;
        const vx = -2.3 * Math.sin(nx * 1.6 + time * 0.5) * Math.sin(ny * 2.3 - time * 0.4);
        const vy = -1.6 * Math.cos(nx * 1.6 + time * 0.5) * Math.cos(ny * 2.3 - time * 0.4);

        p.x += (vx * 22 + p.vx) * dt + 3 * dt;
        p.y += (vy * 22 + p.vy) * dt - 5 * dt;

        // impulse kick decays over roughly a second.
        const damp = Math.exp(-dt * 3.5);
        p.vx *= damp;
        p.vy *= damp;

        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;

        positions[i * 2] = p.x;
        positions[i * 2 + 1] = p.y;
        alphas[i] = p.alpha;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions.subarray(0, count * 2), gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, alphas.subarray(0, count), gl.DYNAMIC_DRAW);
    };

    const renderScene = (seconds: number, dt: number) => {
      resize();
      if (!texture || !framebuffer) return;

      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, width, height);
      gl.disable(gl.BLEND);
      if (light) gl.clearColor(0.89, 0.855, 0.78, 1);
      else gl.clearColor(0.008, 0.007, 0.007, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(sceneProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(scenePos);
      gl.vertexAttribPointer(scenePos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(sceneRes, width, height);
      gl.uniform1f(sceneTime, seconds);
      gl.uniform2f(sceneMouse, mouse.x, mouse.y);
      gl.uniform1f(sceneLight, light ? 1 : 0);
      gl.uniform4f(sceneRipple, ripple.x, ripple.y, ripple.age, ripple.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disableVertexAttribArray(scenePos);

      stepParticles(dt, seconds);

      gl.enable(gl.BLEND);
      if (light) gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      else gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.useProgram(pointProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.enableVertexAttribArray(pointPos);
      gl.vertexAttribPointer(pointPos, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
      gl.enableVertexAttribArray(pointAlpha);
      gl.vertexAttribPointer(pointAlpha, 1, gl.FLOAT, false, 0, 0);
      gl.uniform2f(pointRes, width, height);
      gl.uniform1f(pointLight, light ? 1 : 0);
      gl.drawArrays(gl.POINTS, 0, particles.length);
      gl.disableVertexAttribArray(pointPos);
      gl.disableVertexAttribArray(pointAlpha);
      gl.disable(gl.BLEND);

      // post pass to the visible canvas
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(postProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(postPos);
      gl.vertexAttribPointer(postPos, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(postScene, 0);
      gl.uniform2f(postRes, width, height);
      gl.uniform1f(postTime, seconds);
      gl.uniform1f(postLight, light ? 1 : 0);
      gl.uniform1f(postGrid, gridPx);
      gl.uniform4f(postRipple, ripple.x, ripple.y, ripple.age, ripple.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disableVertexAttribArray(postPos);
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!started) started = now;
      if (!visible) return;
      if (now - last < 32) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;

      if (ripple.strength > 0) {
        ripple.age += dt;
        if (ripple.age > 4) ripple.strength = 0;
      }

      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;

      renderScene((now - started) / 1000, dt);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const onTap = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height || !width || !height) return;
      onPointer(event);

      const px = ((event.clientX - rect.left) / rect.width) * width;
      const py = (1 - (event.clientY - rect.top) / rect.height) * height;
      const min = Math.min(width, height);
      ripple.x = (px - width * 0.5) / min;
      ripple.y = (py - height * 0.5) / min;
      ripple.age = 0;
      ripple.strength = 1;

      // shove nearby fluid particles away from the impact point.
      const reach = Math.min(width, height) * 0.55;
      particles.forEach((p) => {
        const dx = p.x - px;
        const dy = p.y - py;
        const dist = Math.hypot(dx, dy);
        if (dist >= reach) return;
        const force = (1 - dist / reach) ** 2 * 220;
        if (dist < 0.001) {
          const angle = Math.random() * Math.PI * 2;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        } else {
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });

      if (reduced) renderScene(2.4, 0.016);
    };

    const onResize = () => {
      resize();
      if (reduced) renderScene(2.4, 0.016);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
      },
      { rootMargin: "80px" },
    );
    observer.observe(canvas);

    const sizeObserver = new ResizeObserver(onResize);
    sizeObserver.observe(canvas);
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onTap);

    resize();
    if (reduced) {
      renderScene(2.4, 0.016);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onTap);
      gl.deleteBuffer(quad);
      gl.deleteBuffer(pointBuffer);
      gl.deleteBuffer(alphaBuffer);
      if (texture) gl.deleteTexture(texture);
      if (framebuffer) gl.deleteFramebuffer(framebuffer);
      gl.deleteProgram(sceneProg);
      gl.deleteProgram(postProg);
      gl.deleteProgram(pointProg);
    };
  }, [reduced, light]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
