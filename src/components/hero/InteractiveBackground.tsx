"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Mouse-reactive particle constellation behind the (transparent) burger.
 * The whole field gently drifts and twinkles, and parallax-tilts toward the
 * pointer so it visibly reacts to mouse movement — without any harsh glowing
 * blob. React owns the <canvas>, so there is no manual appendChild/removeChild
 * (which previously crashed on unmount).
 */
const VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
attribute float aSize;
attribute float aSeed;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vColor = aColor;
  vec3 p = position;
  p.x += sin(uTime * 0.30 + aSeed * 6.283) * 0.18;
  p.y += cos(uTime * 0.24 + aSeed * 6.283) * 0.18;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aSize * uSize * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
  vAlpha = 0.22 + 0.38 * abs(sin(uTime * 0.8 + aSeed * 10.0));
}
`;

const FRAG = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

const PALETTE = [
  [0.961, 0.769, 0.0], // gold
  [1.0, 0.863, 0.37], // gold-light
  [0.435, 0.55, 1.0], // soft royal
  [1.0, 0.992, 0.94], // cream
];

export function InteractiveBackground({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;

    const COUNT = 720;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = rand(-6, 6);
      positions[i * 3 + 1] = rand(-3.5, 3.5);
      positions[i * 3 + 2] = rand(-3, 1.5);
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
      // most are small specks; a few are larger soft bokeh for depth
      sizes[i] = Math.random() < 0.06 ? rand(9, 16) : rand(2.5, 8);
      seeds[i] = Math.random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const group = new THREE.Group();
    group.add(new THREE.Points(geometry, material));
    scene.add(group);

    const size = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    size();
    window.addEventListener("resize", size);

    // pointer parallax target (-1..1)
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const start = performance.now();
    const loop = () => {
      const t = reduce ? 0 : (performance.now() - start) / 1000;
      material.uniforms.uTime.value = t;
      // ease the field toward the pointer for a parallax tilt
      group.rotation.y += (target.x * 0.35 - group.rotation.y) * 0.05;
      group.rotation.x += (-target.y * 0.25 - group.rotation.x) * 0.05;
      group.position.x += (target.x * 0.6 - group.position.x) * 0.04;
      group.position.y += (-target.y * 0.4 - group.position.y) * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={style} aria-hidden />;
}
