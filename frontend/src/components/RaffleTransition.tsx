import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Full-screen post-processing transition that plays when the raffle section
 * enters the viewport, and again when it is left.
 *
 * Pass 1 renders a scanline curtain + hot seam into an offscreen buffer.
 * Pass 2 samples that buffer with glitch bands, chromatic aberration, ring
 * bloom, scanlines and grain, then fades the whole overlay out.
 *
 * Purely decorative: pointer-events-none, aria-hidden, and skipped entirely
 * under prefers-reduced-motion.
 */

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FIELD_FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_t;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;

  float cover = smoothstep(0.0, 0.28, u_t) * (1.0 - smoothstep(0.66, 1.0, u_t));

  // the bright seam sweeps top -> bottom across the whole transition.
  float seam = mix(-0.3, 1.3, smoothstep(0.0, 0.92, u_t));
  float edge = exp(-abs(uv.y - seam) * 60.0);

  float n = noise(vec2(uv.x * 4.0, uv.y * 14.0 - u_t * 6.0));
  float bands = 0.55 + 0.45 * sin(uv.y * 70.0 + n * 8.0);

  vec3 ink = vec3(0.035, 0.032, 0.028);
  vec3 hot = vec3(1.0, 0.30, 0.02);
  vec3 col = ink * cover * bands;
  col += hot * edge * (0.25 + 0.75 * cover);
  col += vec3(0.45, 0.32, 0.22) * cover * bands * 0.05;

  float a = clamp(cover * bands * 1.1 + edge * 0.8, 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;

const POST_FRAG = `
precision highp float;

uniform sampler2D u_scene;
uniform vec2 u_res;
uniform float u_t;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float pulse = sin(u_t * 3.14159);

  // block glitch: whole scanlines slide sideways for a frame or two.
  float band = floor(uv.y * 34.0);
  float g = step(0.82, hash(vec2(band, floor(u_t * 24.0))));
  uv.x += g * pulse * 0.018;

  vec2 c = uv - 0.5;
  float ca = (0.0015 + 0.01 * dot(c, c)) * (0.3 + 0.7 * pulse);

  vec4 base = texture2D(u_scene, uv);
  vec3 col;
  col.r = texture2D(u_scene, uv + vec2(ca, 0.0)).r;
  col.g = base.g;
  col.b = texture2D(u_scene, uv - vec2(ca, 0.0)).b;

  // ring-tap bloom around the seam.
  vec3 bloom = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398;
    bloom += texture2D(u_scene, uv + vec2(cos(a), sin(a)) * 0.012).rgb;
  }
  bloom /= 8.0;
  col += bloom * 0.4;

  col *= 1.0 - 0.12 * sin(gl_FragCoord.y * 1.6);
  col += (hash(gl_FragCoord.xy + fract(u_t) * 91.0) - 0.5) * 0.045;

  float vign = smoothstep(0.9, 0.25, length(c));
  col *= mix(0.85, 1.0, vign);

  float alpha = base.a * (1.0 - smoothstep(0.82, 1.0, u_t));
  gl_FragColor = vec4(col, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[raffle-transition] shader error", gl.getShaderInfoLog(shader));
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
    console.warn("[raffle-transition] link error", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

function TransitionCanvas({ mode, onDone }: { mode: "in" | "out"; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      doneRef.current();
    };

    if (!gl) {
      finish();
      return;
    }

    const fieldProg = program(gl, VERT, FIELD_FRAG);
    const postProg = program(gl, VERT, POST_FRAG);
    if (!fieldProg || !postProg) {
      finish();
      return;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const fieldPos = gl.getAttribLocation(fieldProg, "a_position");
    const postPos = gl.getAttribLocation(postProg, "a_position");
    const fieldRes = gl.getUniformLocation(fieldProg, "u_res");
    const fieldTime = gl.getUniformLocation(fieldProg, "u_t");
    const postRes = gl.getUniformLocation(postProg, "u_res");
    const postTime = gl.getUniformLocation(postProg, "u_t");
    const postScene = gl.getUniformLocation(postProg, "u_scene");

    const texture = gl.createTexture();
    const framebuffer = gl.createFramebuffer();
    let width = 0;
    let height = 0;

    const resize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      if (!cssW || !cssH) return;

      const scale = Math.min(window.devicePixelRatio || 1, 1.35);
      const w = Math.max(320, Math.min(1440, Math.round(cssW * scale)));
      const h = Math.max(240, Math.round(cssH * (w / cssW)));
      if (w === width && h === height) return;

      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    const render = (t: number) => {
      resize();
      if (!width || !height) return;

      gl.disable(gl.BLEND);

      // pass 1: procedural curtain into the offscreen buffer
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(fieldProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(fieldPos);
      gl.vertexAttribPointer(fieldPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(fieldRes, width, height);
      gl.uniform1f(fieldTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disableVertexAttribArray(fieldPos);

      // pass 2: post-processing to the visible canvas
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(postProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(postPos);
      gl.vertexAttribPointer(postPos, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(postScene, 0);
      gl.uniform2f(postRes, width, height);
      gl.uniform1f(postTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disableVertexAttribArray(postPos);
    };

    // the exit is the same post pass played backwards, slightly quicker.
    const reverse = mode === "out";
    const duration = reverse ? 1100 : 1350;
    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      render(reverse ? 1 - t : t);
      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        finish();
      }
    };

    const onResize = () => render(0.5);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      gl.deleteBuffer(quad);
      gl.deleteTexture(texture);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteProgram(fieldProg);
      gl.deleteProgram(postProg);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[105] h-full w-full"
    />
  );
}

export function RaffleTransition() {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<"in" | "out" | null>(null);
  const playedIn = useRef(false);
  const playedOut = useRef(false);

  useEffect(() => {
    if (reduced !== false) return;
    const section = document.getElementById("raffle");
    if (!section) return;

    const options = { rootMargin: "-12% 0px -68% 0px", threshold: 0 };

    const enter = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || playedIn.current) return;
        playedIn.current = true;
        setMode("in");
        enter.disconnect();
      },
      options,
    );

    const exit = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || entry.isIntersecting || playedOut.current) return;
        // only an exit if the section had actually been entered first.
        if (!playedIn.current) return;
        playedOut.current = true;
        setMode("out");
        exit.disconnect();
      },
      options,
    );

    enter.observe(section);
    exit.observe(section);
    return () => {
      enter.disconnect();
      exit.disconnect();
    };
  }, [reduced]);

  if (!mode) return null;
  return <TransitionCanvas mode={mode} onDone={() => setMode(null)} />;
}
