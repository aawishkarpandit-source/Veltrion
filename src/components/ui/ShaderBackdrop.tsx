import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../lib/motion';

/**
 * Full-viewport WebGL backdrop: a domain-warped green nebula plus a
 * perspective grid floor that travels with the page scroll — the site's
 * "3D scroll background". Pure GPU work (one fragment shader, uniforms only),
 * rendered at a reduced backing resolution and paused when the tab is hidden.
 *
 * Fallbacks, in order:
 *  - reduced motion  -> a single static frame (no animation loop)
 *  - no WebGL        -> nothing renders; the CSS canvas color shows through
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform float u_scroll;  // smoothed 0..1 page progress
uniform float u_dark;    // 0 = light theme, 1 = dark theme

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(11.3, 7.1); a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.05;
  float s = u_scroll;

  // --- nebula: domain-warped fbm, parallaxing with scroll ---
  vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t)),
                fbm(p * 1.1 + vec2(5.2, 1.3) - t * 0.7));
  vec2 r = vec2(fbm(p * 1.7 + 2.4 * q + vec2(1.7, 9.2) + s * 0.9),
                fbm(p * 1.7 + 2.4 * q + vec2(8.3, 2.8) + s * 0.55));
  float n = fbm(p * 1.5 + 2.8 * r - vec2(0.0, s * 1.6));

  // green palette: light = pale mist over paper, dark = emerald glow over void
  vec3 base = mix(vec3(0.968, 0.978, 0.972), vec3(0.020, 0.036, 0.028), u_dark);
  vec3 glowA = mix(vec3(0.0, 0.60, 0.33), vec3(0.0, 0.86, 0.46), u_dark);
  vec3 glowB = mix(vec3(0.27, 0.80, 0.52), vec3(0.49, 0.95, 0.70), u_dark);

  vec3 col = base;
  col = mix(col, glowA, smoothstep(0.30, 0.95, n) * (0.10 + 0.34 * u_dark));
  col = mix(col, glowB, smoothstep(0.58, 1.00, n) * (0.06 + 0.24 * u_dark));

  // top-weighted aurora curtain
  float curtain = fbm(vec2(p.x * 1.3 + t * 0.55, p.y * 0.55 - t * 0.25))
                * smoothstep(-0.25, 0.60, p.y);
  col = mix(col, glowB, curtain * (0.04 + 0.13 * u_dark));

  // --- perspective grid floor (bottom of viewport), travels with scroll ---
  float horizon = 0.16;
  if (p.y < horizon) {
    float depth = 0.05 / (horizon - p.y + 0.004);
    vec2 g = vec2(p.x * depth * 6.0, depth * 2.2 + s * 14.0);
    vec2 f = abs(fract(g) - 0.5);
#ifdef USE_FW
    vec2 fw = fwidth(g) * 1.3;
    float line = max(smoothstep(fw.x, 0.0, f.x), smoothstep(fw.y, 0.0, f.y));
#else
    float line = max(smoothstep(0.06, 0.0, f.x), smoothstep(0.06, 0.0, f.y));
#endif
    float fade = smoothstep(0.0, 0.30, horizon - p.y) * smoothstep(2.6, 0.35, depth);
    vec3 gridCol = mix(vec3(0.0, 0.50, 0.27), vec3(0.20, 0.88, 0.54), u_dark);
    col = mix(col, gridCol, line * fade * (0.16 + 0.22 * u_dark));
  }

  // gentle vignette
  float vig = smoothstep(1.30, 0.30, length(p));
  col *= mix(0.97, 1.03, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function ShaderBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cv: HTMLCanvasElement = canvas; // definite alias for closures

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl) return; // no WebGL: the CSS canvas color is the fallback

    const derivatives = gl.getExtension('OES_standard_derivatives');
    const fragSrc = derivatives
      ? '#extension GL_OES_standard_derivatives : enable\n' +
        FRAG.replace('precision highp float;', 'precision highp float;\n#define USE_FW 1')
      : FRAG;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uScroll = gl.getUniformLocation(prog, 'u_scroll');
    const uDark = gl.getUniformLocation(prog, 'u_dark');

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    let raf = 0;
    let start = performance.now();
    let scrollSmooth = 0;
    let running = true;

    function isDark(): boolean {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'dark') return true;
      if (attr === 'light') return false;
      return prefersDark.matches;
    }

    function scrollTarget(): number {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }

    function resize() {
      // Reduced backing store: the shader is soft by nature, so ~0.75x is
      // visually identical and much cheaper on big screens.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
      cv.width = Math.max(1, Math.round(cv.clientWidth * scale));
      cv.height = Math.max(1, Math.round(cv.clientHeight * scale));
      gl!.viewport(0, 0, cv.width, cv.height);
      gl!.uniform2f(uRes, cv.width, cv.height);
    }

    function frame(now: number) {
      if (!running) return;
      // Pause while the tab is hidden.
      if (document.hidden) {
        raf = requestAnimationFrame(frame);
        return;
      }
      scrollSmooth += (scrollTarget() - scrollSmooth) * 0.07;
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.uniform1f(uScroll, scrollSmooth);
      gl!.uniform1f(uDark, isDark() ? 1 : 0);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }

    function renderStatic() {
      resize();
      gl!.uniform1f(uTime, 0);
      gl!.uniform1f(uScroll, scrollTarget());
      gl!.uniform1f(uDark, isDark() ? 1 : 0);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      // One still frame; re-render on resize and theme change only.
      renderStatic();
      const mo = new MutationObserver(renderStatic);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return () => {
        mo.disconnect();
        window.removeEventListener('resize', resize);
        gl!.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    raf = requestAnimationFrame(frame);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl!.deleteProgram(prog);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
      gl!.deleteBuffer(buf);
      gl!.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="shader-backdrop" aria-hidden="true" />;
}
