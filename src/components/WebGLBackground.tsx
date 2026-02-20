"use client";

import { useEffect, useRef } from "react";

// WebGL2 Background with 'Shadow Void' cursor trail
const VERT_SRC = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG_SRC = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouseHistory[32]; // Increased for longer trail
uniform float u_mouseAges[32];   

out vec4 fragColor;

// --- Noise helpers ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.853373771369537 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Palette using DARKER accent colors
vec3 palette(float t) {
  vec3 mintDark      = vec3(0.165, 0.671, 0.478); // #2aab7a
  vec3 coralDark     = vec3(0.788, 0.271, 0.271); // #c94545
  vec3 pervencheDark = vec3(0.494, 0.498, 0.859); // #7e7fdb
  vec3 darkBase      = vec3(0.067, 0.067, 0.067); // #111111
  
  float m = smoothstep(0.0, 0.4, t);
  float c = smoothstep(0.3, 0.7, t);
  float p = smoothstep(0.6, 1.0, t);
  
  vec3 col = mix(darkBase, mintDark, m * 0.9);
  col = mix(col, coralDark, c * 0.7);
  col = mix(col, pervencheDark, p * 0.8);
  
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uvA = vec2(uv.x * aspect, uv.y);

  float t = u_time * 0.4; // Fixed by user

  // --- Multi-Point Mouse Interaction ---
  vec2 totalDisplacement = vec2(0.0);
  float voidMask = 0.0;

  for(int i = 0; i < 32; i++) {
    vec2 mPos = vec2(u_mouseHistory[i].x * aspect, 1.0 - u_mouseHistory[i].y);
    float dist = length(uvA - mPos);
    float age = u_mouseAges[i];
    
    // Smooth push displacement
    float weight = exp(-dist * 8.0) * age;
    vec2 dir = normalize(uvA - mPos + 0.0001);
    totalDisplacement += dir * weight * 0.12;
    
    // The 'Void' - Follows the cursor trail
    voidMask += exp(-dist * 18.0) * age;
  }
  
  // Distort coordinates with mouse trail
  vec2 coords = uvA + totalDisplacement;
  
  // Base noise waves utilizing distorted coords
  float n1 = snoise(vec3(coords * 1.5, t * 0.5)) * 0.5 + 0.5;
  float n2 = snoise(vec3(coords * 3.0 + 5.0, t * 0.3)) * 0.5 + 0.5;
  float finalN = mix(n1, n2, 0.4);

  vec3 col = palette(finalN);

  // Apply the Shadow Void
  vec3 darkBase = vec3(0.067, 0.067, 0.067); // #111111
  col = mix(col, darkBase, clamp(voidMask, 0.0, 0.9));

  // Vignette
  float vign = 1.0 - smoothstep(0.3, 1.4, length(uv - 0.5) * 1.6);
  col *= vign;

  // Final brightness boost
  col = col * 1.1;

  fragColor = vec4(col, 1.0);
}`;

const TRAIL_COUNT = 32;

export default function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const prog = createProgram(gl, VERT_SRC, FRAG_SRC);
    if (!prog) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    gl.useProgram(prog);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_resolution");
    const uMouseHistory = gl.getUniformLocation(prog, "u_mouseHistory");
    const uMouseAges    = gl.getUniformLocation(prog, "u_mouseAges");

    const mouseHistory = Array.from({ length: TRAIL_COUNT }, () => ({ x: 0.5, y: 0.5, age: 0 }));
    let targetX = 0.5;
    let targetY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    let start = performance.now();

    const render = (now: number) => {
      const t = (now - start) * 0.001;

      // Smooth the head movement
      mouseHistory[0].x += (targetX - mouseHistory[0].x) * 0.15;
      mouseHistory[0].y += (targetY - mouseHistory[0].y) * 0.15;
      mouseHistory[0].age = 1.0;

      // Trail propagation with MUCH slower decay to ensure persistence
      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        // Points follow each other closely
        mouseHistory[i].x += (mouseHistory[i-1].x - mouseHistory[i].x) * 0.25;
        mouseHistory[i].y += (mouseHistory[i-1].y - mouseHistory[i].y) * 0.25;
        // Age decays slowly to keep a visible trail length
        mouseHistory[i].age = mouseHistory[i-1].age * 0.96; 
      }

      const flatHistory = new Float32Array(TRAIL_COUNT * 2);
      const flatAges = new Float32Array(TRAIL_COUNT);
      for(let i=0; i<TRAIL_COUNT; i++) {
        flatHistory[i*2] = mouseHistory[i].x;
        flatHistory[i*2+1] = mouseHistory[i].y;
        flatAges[i] = mouseHistory[i].age;
      }

      gl.useProgram(prog);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2fv(uMouseHistory, flatHistory);
      gl.uniform1fv(uMouseAges, flatAges);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}

function createShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function createProgram(gl: WebGL2RenderingContext, vert: string, frag: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vert);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program error:", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}
