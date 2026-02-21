"use client";

import { useEffect, useRef } from "react";
import VERT_SRC from "./shaders/vertex.glsl";
import FRAG_SRC from "./shaders/fragment.glsl";

// WebGL2 Background with 'Shadow Void' cursor trail

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
    const posLoc = gl.getAttribLocation(prog, "vertexPosition");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "time");
    const uRes  = gl.getUniformLocation(prog, "resolution");
    const uMouseHistory = gl.getUniformLocation(prog, "mouseTrailPoints");
    const uMouseAges    = gl.getUniformLocation(prog, "mouseTrailAges");

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
    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) * 0.001;

      // Smooth the head movement
      mouseHistory[0].x += (targetX - mouseHistory[0].x) * 0.13;
      mouseHistory[0].y += (targetY - mouseHistory[0].y) * 0.13;
      mouseHistory[0].age = 1.0;

      // Trail propagation with MUCH slower decay to ensure persistence
      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        // Points follow each other closely
        mouseHistory[i].x += (mouseHistory[i-1].x - mouseHistory[i].x) * 0.7;
        mouseHistory[i].y += (mouseHistory[i-1].y - mouseHistory[i].y) * 0.7;
        // Age decays slowly to keep a visible trail length
        mouseHistory[i].age = mouseHistory[i-1].age * 1; 
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
      className="fixed inset-0 w-full h-full z-0 pointer-events-none block"
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
