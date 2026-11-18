import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Domain-warped fbm field. Four octaves of value noise are folded twice, which
 * gives the slow, liquid "smoke" movement used on the reference sites.
 */
const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + 13.7;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 res = max(u_res, vec2(1.0));
  vec2 p = (gl_FragCoord.xy * 2.0 - res) / min(res.x, res.y);
  float t = u_time * 0.085;
  vec2 m = u_mouse;

  vec2 q = vec2(
    fbm(p * 1.05 + vec2(t * 0.9, -t * 0.55)),
    fbm(p * 1.05 + vec2(5.2, 1.3) - vec2(t * 0.7, t * 0.45))
  );

  vec2 r = vec2(
    fbm(p * 1.55 + 3.0 * q + vec2(t * 0.35, 0.0) + m * 0.22),
    fbm(p * 1.55 + 3.0 * q + vec2(2.1, 7.4) - m * 0.18)
  );

  float f = fbm(p * 1.35 + 2.6 * r + vec2(0.0, -t * 0.3));
  float bands = smoothstep(0.30, 0.92, f);

  vec3 base = vec3(0.030, 0.024, 0.022);
  vec3 ember = vec3(0.36, 0.055, 0.010);
  vec3 hot = vec3(1.000, 0.220, 0.000);
  vec3 cream = vec3(1.000, 0.760, 0.520);

  vec3 col = mix(base, ember, smoothstep(0.22, 0.82, f));
  col = mix(col, hot, bands * 0.82);
  col = mix(col, cream, pow(smoothstep(0.58, 1.0, f), 3.0) * 0.45);

  // pointer bloom
  float d = length(p - m * vec2(0.95, 0.62));
  col += hot * 0.11 * smoothstep(1.25, 0.0, d);

  // vignette + grain
  col *= 1.0 - smoothstep(0.55, 1.65, length(p)) * 0.42;
  float grain = hash(gl_FragCoord.xy + fract(u_time) * 41.0);
  col += (grain - 0.5) * 0.022;

  gl_FragColor = vec4(col, 1.0);
}
`;

type LiquidBackdropProps = {
  className?: string;
};

/**
 * Raw-WebGL animated gradient. No dependency, DPR-capped, paused off-screen,
 * and pinned to a single frame when the visitor prefers reduced motion.
 */
export function LiquidBackdrop({ className = "" }: LiquidBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, "u_res");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.7;
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resLoc, width, height);
    };

    resize();
    gl.uniform1f(timeLoc, 3.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const target = { x: 0.15, y: 0.05 };
    const mouse = { x: 0.15, y: 0.05 };
    let visible = true;
    let raf = 0;
    let started = 0;
    let last = 0;

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!started) started = now;
      if (!visible) return;
      if (now - last < 24) return;
      last = now;
      resize();
      mouse.x += (target.x - mouse.x) * 0.045;
      mouse.y += (target.y - mouse.y) * 0.045;
      gl.uniform1f(timeLoc, (now - started) / 1000);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    observer.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });

    if (!reduced) raf = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      if (reduced) {
        gl.uniform1f(timeLoc, 3.5);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };
    window.addEventListener("resize", onResize);
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
