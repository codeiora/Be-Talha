"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Compass,
  RotateCcw,
  Sparkles,
  Move,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
} from "lucide-react";
import {
  ShuktaraBeacon,
  NeedleGalaxy,
} from "./celestial";

interface ShootingStar {
  active: boolean;
  start: THREE.Vector3;
  current: THREE.Vector3;
  velocity: THREE.Vector3;
  length: number;
  progress: number;
  speed: number;
  color: THREE.Color;
}

export interface InteractiveGalaxyProps {
  onInspectChange?: (isInspecting: boolean) => void;
}

export function InteractiveGalaxy({ onInspectChange }: InteractiveGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mode state: Universe Panoramic (false) vs Galaxy Deep 360° Inspect (true)
  const [isInspecting, setIsInspecting] = useState(false);
  const [isGalaxyHovered, setIsGalaxyHovered] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // References to keep track of camera angles and interaction
  const interactionRef = useRef({
    // Mode tracking
    mode: "universe" as "universe" | "inspect",
    transitionProgress: 0, // 0 = Universe, 1 = Inspect mode
    targetTransition: 0,

    // Universe view orientation
    yaw: 0.35,
    pitch: 0.12,
    targetYaw: 0.35,
    targetPitch: 0.12,
    vx: 0,
    vy: 0,

    // Galaxy Inspect Mode: Orbital coordinates around the galaxy
    galaxyPos: new THREE.Vector3(195, 78, 515),
    orbitYaw: 0.2, // Horizontal orbit around galaxy
    targetOrbitYaw: 0.2,
    orbitPitch: 0.45, // Vertical angle: >0 top view, 0 = edge-on, <0 bottom view
    targetOrbitPitch: 0.45,
    orbitRadius: 330, // Distance from galaxy center
    targetOrbitRadius: 330,
    orbitVx: 0,
    orbitVy: 0,

    // Drag tracking
    isPointerDown: false,
    dragDistance: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastInteractionTime: Date.now(),

    // Mouse positions
    mouseNormalizedX: 0,
    mouseNormalizedY: 0,
    screenMouseX: -1000,
    screenMouseY: -1000,
    isMouseOnScreen: false,
    isHoveringGalaxy: false,
  });

  // Cursor particle trail reference
  const cursorParticlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      hue: number;
      life: number;
      maxLife: number;
    }>
  >([]);

  // Function to enter deep inspection mode
  const enterInspectMode = useCallback(() => {
    interactionRef.current.mode = "inspect";
    interactionRef.current.targetTransition = 1;
    interactionRef.current.targetOrbitRadius = 330;
    interactionRef.current.lastInteractionTime = Date.now();
    setIsInspecting(true);
    onInspectChange?.(true);
  }, [onInspectChange]);

  // Function to smoothly return to full universe mode
  const exitInspectMode = useCallback(() => {
    interactionRef.current.mode = "universe";
    interactionRef.current.targetTransition = 0;
    interactionRef.current.lastInteractionTime = Date.now();
    setIsInspecting(false);
    onInspectChange?.(false);
  }, [onInspectChange]);

  // Function to smoothly reset the view to the galactic core
  const resetView = useCallback(() => {
    if (interactionRef.current.mode === "inspect") {
      interactionRef.current.targetOrbitYaw = 0.2;
      interactionRef.current.targetOrbitPitch = 0.45;
      interactionRef.current.targetOrbitRadius = 330;
    } else {
      interactionRef.current.targetYaw = 0.35;
      interactionRef.current.targetPitch = 0.12;
      interactionRef.current.vx = 0;
      interactionRef.current.vy = 0;
    }
    interactionRef.current.lastInteractionTime = Date.now();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- 1. THREE.JS INITIALIZATION ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    // --- 2. PROCEDURAL TEXTURES FOR STARS & GLOWS ---
    const createStarTexture = () => {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.12, "rgba(235, 245, 255, 0.95)");
      grad.addColorStop(0.35, "rgba(140, 195, 255, 0.5)");
      grad.addColorStop(0.7, "rgba(56, 120, 240, 0.15)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(size / 2, 4);
      ctx.lineTo(size / 2, size - 4);
      ctx.moveTo(4, size / 2);
      ctx.lineTo(size - 4, size / 2);
      ctx.stroke();

      const texture = new THREE.CanvasTexture(c);
      texture.needsUpdate = true;
      return texture;
    };

    const createDustTexture = () => {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      grad.addColorStop(0, "rgba(255, 230, 180, 1)");
      grad.addColorStop(0.25, "rgba(251, 191, 36, 0.8)");
      grad.addColorStop(0.5, "rgba(245, 158, 11, 0.3)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(c);
      texture.needsUpdate = true;
      return texture;
    };

    const starTexture = createStarTexture();
    const dustTexture = createDustTexture();

    // --- 3. REALISTIC 360-DEGREE CELESTIAL SKY SPHERE ---
    const sphereRadius = 1400;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 60, 40);
    sphereGeo.scale(-1, 1, 1);

    const skyShader = {
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        uniform float uTime;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
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
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vec3 dir = normalize(vWorldPosition);
          vec3 spaceDark = vec3(0.008, 0.012, 0.025);
          vec3 deepIndigo = vec3(0.025, 0.045, 0.095);
          vec3 cosmicCyan = vec3(0.05, 0.16, 0.28);
          vec3 cosmicMagenta = vec3(0.22, 0.08, 0.26);
          vec3 galacticCoreGold = vec3(0.38, 0.28, 0.14);

          float planeDist = abs(dir.y * 0.88 + dir.x * 0.45);
          float bandFactor = exp(-planeDist * 3.2);

          float noise1 = snoise(dir * 2.2 + vec3(0.0, uTime * 0.01, 0.0));
          float noise2 = snoise(dir * 4.8 - vec3(uTime * 0.006, 0.0, 0.0));
          float noise3 = snoise(dir * 9.5);
          float combinedNoise = (noise1 * 0.55 + noise2 * 0.3 + noise3 * 0.15);

          vec3 coreDir = normalize(vec3(0.7, 0.2, 0.65));
          float coreDist = dot(dir, coreDir);
          float coreGlow = pow(max(0.0, coreDist), 5.5) * 1.8;

          vec3 color = spaceDark;
          color += deepIndigo * (0.5 + 0.5 * combinedNoise);
          color += cosmicCyan * bandFactor * max(0.0, combinedNoise);
          color += cosmicMagenta * bandFactor * max(0.0, noise2 * 0.8);
          color += galacticCoreGold * (coreGlow + bandFactor * 0.4 * max(0.0, noise1));

          float dustLane = snoise(dir * 6.0 + vec3(2.3));
          if (dustLane > 0.2 && bandFactor > 0.3) {
            color *= (1.0 - (dustLane - 0.2) * 0.7);
          }

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
    };

    const skyMat = new THREE.ShaderMaterial({
      vertexShader: skyShader.vertexShader,
      fragmentShader: skyShader.fragmentShader,
      uniforms: skyShader.uniforms,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyMesh = new THREE.Mesh(sphereGeo, skyMat);
    scene.add(skyMesh);

    // --- 4. SHUKTARA BEACON (Morning Star with 8-Point Diffraction Spikes) ---
    const shuktara = new ShuktaraBeacon({
      size: 68,
      coreColor: "#ffffff",
      spikeColor: "#bae6fd",
      haloColor: "#38bdf8",
    });
    // Elevated in the deep sky dome
    shuktara.group.position.set(-95, 285, 475);
    scene.add(shuktara.group);

    // --- 4.2. NEEDLE GALAXY (Edge-on Tilted Disc Galaxy) ---
    const needleGalaxy = new NeedleGalaxy({
      length: 145,
      thickness: 6,
      bulgeRadius: 18,
      starCount: 4500,
    });
    // Positioned across the sky dome to the left
    needleGalaxy.group.position.set(-390, 115, 260);
    needleGalaxy.group.lookAt(0, 0, 0);
    needleGalaxy.group.rotateZ(0.55);
    scene.add(needleGalaxy.group);

    // --- 5. 3D DEEP-SPACE STARS ---
    const starCount = 7500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const starPalette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#e0f2fe"),
      new THREE.Color("#93c5fd"),
      new THREE.Color("#fef08a"),
      new THREE.Color("#fde047"),
      new THREE.Color("#f97316"),
      new THREE.Color("#f472b6"),
    ];

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      let theta, phi, r;
      if (Math.random() < 0.65) {
        theta = Math.random() * Math.PI * 2;
        const diskSpread = (Math.random() - 0.5) * 0.35;
        phi = Math.PI / 2 + diskSpread;
        r = 600 + Math.random() * 550;
      } else {
        theta = Math.random() * Math.PI * 2;
        phi = Math.acos(2 * Math.random() - 1);
        r = 500 + Math.random() * 700;
      }

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      const rotAngle = 0.6;
      const rx = x * Math.cos(rotAngle) - y * Math.sin(rotAngle);
      const ry = x * Math.sin(rotAngle) + y * Math.cos(rotAngle);

      starPositions[idx] = rx;
      starPositions[idx + 1] = ry;
      starPositions[idx + 2] = z;

      const color = starPalette[Math.floor(Math.random() * starPalette.length)];
      starColors[idx] = color.r;
      starColors[idx + 1] = color.g;
      starColors[idx + 2] = color.b;

      const isBeacon = Math.random() < 0.03;
      starSizes[i] = isBeacon
        ? 6.0 + Math.random() * 8.0
        : 1.8 + Math.random() * 3.5;
    }

    starGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: 3.5,
      map: starTexture || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starField = new THREE.Points(starGeo, starMaterial);
    scene.add(starField);

    // --- 6. FLOATING 3D SPACE PARTICLES ---
    const dustCount = 450;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustVelocities: THREE.Vector3[] = [];

    const dustColorOptions = [
      new THREE.Color("#fbbf24"),
      new THREE.Color("#38bdf8"),
      new THREE.Color("#c084fc"),
      new THREE.Color("#fef08a"),
    ];

    for (let i = 0; i < dustCount; i++) {
      const idx = i * 3;
      const dist = 35 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      dustPositions[idx] = dist * Math.sin(phi) * Math.cos(theta);
      dustPositions[idx + 1] = dist * Math.cos(phi);
      dustPositions[idx + 2] = dist * Math.sin(phi) * Math.sin(theta);

      const color =
        dustColorOptions[Math.floor(Math.random() * dustColorOptions.length)];
      dustColors[idx] = color.r;
      dustColors[idx + 1] = color.g;
      dustColors[idx + 2] = color.b;

      dustVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04
        )
      );
    }

    dustGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 5.5,
      map: dustTexture || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const floatingDust = new THREE.Points(dustGeo, dustMaterial);
    scene.add(floatingDust);

    // --- 7. DYNAMIC SHOOTING STARS / COMETS ---
    const shootingStars: ShootingStar[] = [];
    const maxShootingStars = 2;
    const shootingStarLines: THREE.Line[] = [];

    const createShootingStarLine = () => {
      const lineGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(6);
      lineGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        linewidth: 2,
        depthWrite: false,
      });

      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      return line;
    };

    for (let i = 0; i < maxShootingStars; i++) {
      shootingStarLines.push(createShootingStarLine());
      shootingStars.push({
        active: false,
        start: new THREE.Vector3(),
        current: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        length: 80,
        progress: 0,
        speed: 1,
        color: new THREE.Color("#ffffff"),
      });
    }

    const spawnShootingStar = (star: ShootingStar, lineIndex: number) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = 0.4 + Math.random() * (Math.PI - 0.8);
      const r = 550;

      const sx = r * Math.sin(phi) * Math.cos(theta);
      const sy = r * Math.cos(phi);
      const sz = r * Math.sin(phi) * Math.sin(theta);

      star.start.set(sx, sy, sz);
      star.current.copy(star.start);

      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        -0.8 - Math.random() * 0.4,
        (Math.random() - 0.5) * 1.5
      ).normalize();

      star.speed = 14 + Math.random() * 12;
      star.velocity.copy(dir).multiplyScalar(star.speed);
      star.length = 75 + Math.random() * 65;
      star.progress = 0;
      star.active = true;

      const colors = ["#ffffff", "#38bdf8", "#fbbf24", "#a78bfa"];
      star.color.set(colors[Math.floor(Math.random() * colors.length)]);

      const mat = shootingStarLines[lineIndex]
        .material as THREE.LineBasicMaterial;
      mat.color = star.color;
      mat.opacity = 0.95;
    };

    let lastMeteorSpawnTime = Date.now();

    // --- 8. INTERACTIVE EVENT LISTENERS: DRAG, WHEEL ZOOM, & RAYCASTING ---
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        return;
      }

      const state = interactionRef.current;
      state.isPointerDown = true;
      state.dragDistance = 0;
      state.startX = e.clientX;
      state.startY = e.clientY;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.vx = 0;
      state.vy = 0;
      state.orbitVx = 0;
      state.orbitVy = 0;
      state.lastInteractionTime = Date.now();
      setIsDragging(true);
      setShowHint(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      const state = interactionRef.current;
      state.screenMouseX = e.clientX;
      state.screenMouseY = e.clientY;
      state.isMouseOnScreen = true;

      // Normalized device coordinates (-1 to 1) for Three.js raycasting
      state.mouseNormalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouseNormalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseVector.set(state.mouseNormalizedX, state.mouseNormalizedY);

      state.isHoveringGalaxy = false;
      setIsGalaxyHovered(false);

      // Cursor stardust trail
      if (Math.random() < 0.65) {
        cursorParticlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.6,
          size: 1.5 + Math.random() * 3,
          alpha: 1,
          hue: Math.random() < 0.5 ? 195 : 45,
          life: 0,
          maxLife: 25 + Math.random() * 20,
        });
      }

      if (state.isPointerDown) {
        const dx = e.clientX - state.lastX;
        const dy = e.clientY - state.lastY;
        state.dragDistance += Math.abs(dx) + Math.abs(dy);

        if (state.mode === "inspect") {
          // --- GALAXY CLOSE-UP ORBIT INSPECTION (360° top, bottom & sides) ---
          const orbitSensitivity = 0.005;
          state.targetOrbitYaw -= dx * orbitSensitivity;
          state.targetOrbitPitch += dy * orbitSensitivity;

          // Pitch range allows full exploration from top view to bottom view!
          state.targetOrbitPitch = Math.max(
            -1.48,
            Math.min(1.48, state.targetOrbitPitch)
          );

          state.orbitVx = -dx * orbitSensitivity;
          state.orbitVy = dy * orbitSensitivity;
        } else {
          // --- UNIVERSE PANORAMIC ROTATION ---
          const sensitivity = 0.0035;
          state.targetYaw += dx * sensitivity;
          state.targetPitch += dy * sensitivity;
          state.targetPitch = Math.max(-1.42, Math.min(1.42, state.targetPitch));

          state.vx = dx * sensitivity;
          state.vy = dy * sensitivity;
        }

        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.lastInteractionTime = Date.now();
      }
    };

    const onPointerUp = () => {
      const state = interactionRef.current;
      // If was a click (not a drag) on the galaxy, enter Inspect Mode
      if (
        state.isPointerDown &&
        state.dragDistance < 8 &&
        state.isHoveringGalaxy &&
        state.mode === "universe"
      ) {
        enterInspectMode();
      }

      state.isPointerDown = false;
      setIsDragging(false);
    };

    // --- MOUSE WHEEL SCROLL ZOOM & FLY-THROUGH ---
    const onWheel = (e: WheelEvent) => {
      // If the wheel event occurred on top of any UI element (menu drawer, modal, buttons, etc.), ignore completely
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button, a, input, textarea, select, [role='dialog'], aside, nav, header, footer, .overflow-y-auto, [data-interactive-ui]") ||
          (containerRef.current && !containerRef.current.contains(target) && target !== canvasRef.current))
      ) {
        return;
      }

      const state = interactionRef.current;
      state.lastInteractionTime = Date.now();
      setShowHint(false);

      // In universe mode, do NOT expand universe with wheel scroll (prevents accidental zoom while navigating/scrolling)
      if (state.mode === "inspect") {
        // In Inspect mode: Scroll zooms in or out smoothly
        const zoomDelta = e.deltaY * 0.45;
        state.targetOrbitRadius += zoomDelta;

        // If user zooms in: min limit
        if (state.targetOrbitRadius < 140) {
          state.targetOrbitRadius = 140;
        }

        // If user scrolls backwards past outer limit (> 520), seamlessly exit back to universe!
        if (state.targetOrbitRadius > 530) {
          exitInspectMode();
        }
      }
    };

    const onMouseLeave = () => {
      interactionRef.current.isMouseOnScreen = false;
      interactionRef.current.isPointerDown = false;
      setIsDragging(false);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (cursorCanvasRef.current) {
        cursorCanvasRef.current.width = window.innerWidth;
        cursorCanvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    if (cursorCanvasRef.current) {
      cursorCanvasRef.current.width = window.innerWidth;
      cursorCanvasRef.current.height = window.innerHeight;
    }

    // --- 9. ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = clock.getDelta();
      const state = interactionRef.current;

      // Update shader time for nebula flow
      skyMat.uniforms.uTime.value = elapsedTime;

      // Animate Shuktara & Needle Galaxy
      shuktara.update(deltaTime, elapsedTime);
      needleGalaxy.update(deltaTime, elapsedTime);

      // --- SMOOTH TRANSITION BETWEEN MODES (Lerp transitionProgress 0 <-> 1) ---
      state.transitionProgress +=
        (state.targetTransition - state.transitionProgress) * 0.055;

      // Idle auto-drift: slowly rotates in inspect or universe mode
      const isIdle =
        Date.now() - state.lastInteractionTime > 3000 && isAutoRotating;
      if (isIdle && !state.isPointerDown) {
        if (state.mode === "inspect") {
          state.targetOrbitYaw += 0.0012;
        } else {
          state.targetYaw += 0.00065;
        }
      }

      // Smooth inertia when released
      if (!state.isPointerDown) {
        if (state.mode === "inspect") {
          state.targetOrbitYaw += state.orbitVx;
          state.targetOrbitPitch += state.orbitVy;
          state.targetOrbitPitch = Math.max(
            -1.48,
            Math.min(1.48, state.targetOrbitPitch)
          );
          state.orbitVx *= 0.92;
          state.orbitVy *= 0.92;
        } else {
          state.targetYaw += state.vx;
          state.targetPitch += state.vy;
          state.targetPitch = Math.max(
            -1.42,
            Math.min(1.42, state.targetPitch)
          );
          state.vx *= 0.94;
          state.vy *= 0.94;
        }
      }

      // Lerp Damping towards target angles
      state.yaw += (state.targetYaw - state.yaw) * 0.08;
      state.pitch += (state.targetPitch - state.pitch) * 0.08;

      state.orbitYaw += (state.targetOrbitYaw - state.orbitYaw) * 0.08;
      state.orbitPitch += (state.targetOrbitPitch - state.orbitPitch) * 0.08;
      state.orbitRadius +=
        (state.targetOrbitRadius - state.orbitRadius) * 0.08;

      // --- CALCULATE CAMERA POSITION & ORIENTATION BASED ON TRANSITION ---
      // Universe camera position: Origin (0,0,0)
      const uPos = new THREE.Vector3(0, 0, 0);

      // Universe look direction
      const parallaxYaw = state.yaw + state.mouseNormalizedX * 0.05;
      const parallaxPitch = state.pitch + state.mouseNormalizedY * 0.03;
      const uDir = new THREE.Vector3(
        Math.cos(parallaxPitch) * Math.sin(parallaxYaw),
        Math.sin(parallaxPitch),
        Math.cos(parallaxPitch) * Math.cos(parallaxYaw)
      );
      const uLookAt = uDir.clone().multiplyScalar(500);

      // Inspect camera position: orbiting around galaxy
      const gPos = state.galaxyPos;
      const iPos = new THREE.Vector3(
        gPos.x +
          state.orbitRadius *
            Math.cos(state.orbitPitch) *
            Math.sin(state.orbitYaw),
        gPos.y + state.orbitRadius * Math.sin(state.orbitPitch),
        gPos.z +
          state.orbitRadius *
            Math.cos(state.orbitPitch) *
            Math.cos(state.orbitYaw)
      );
      const iLookAt = gPos.clone();

      // Smooth Cubic Hermite S-Curve Interpolation between Universe and Inspect
      const t = state.transitionProgress;
      const smoothT = t * t * (3 - 2 * t);

      // Final camera position & lookAt target
      const finalCamPos = new THREE.Vector3().lerpVectors(uPos, iPos, smoothT);
      const finalLookAt = new THREE.Vector3().lerpVectors(
        uLookAt,
        iLookAt,
        smoothT
      );

      camera.position.copy(finalCamPos);
      camera.lookAt(finalLookAt);

      // Rotate starfield ever so slightly
      starField.rotation.y = elapsedTime * 0.003;

      // Animate floating space dust particles
      const dPos = dustGeo.attributes.position.array as Float32Array;
      const warpSpeed =
        state.transitionProgress > 0.05 && state.transitionProgress < 0.95
          ? 3.8
          : 1.0;

      for (let i = 0; i < dustCount; i++) {
        const idx = i * 3;
        const vel = dustVelocities[i];

        dPos[idx] += vel.x * warpSpeed;
        dPos[idx + 1] +=
          (vel.y + Math.sin(elapsedTime + i) * 0.02) * warpSpeed;
        dPos[idx + 2] += vel.z * warpSpeed;

        const maxDist = 300;
        if (Math.abs(dPos[idx]) > maxDist) dPos[idx] *= -0.9;
        if (Math.abs(dPos[idx + 1]) > maxDist) dPos[idx + 1] *= -0.9;
        if (Math.abs(dPos[idx + 2]) > maxDist) dPos[idx + 2] *= -0.9;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Handle Shooting Stars
      const now = Date.now();
      if (now - lastMeteorSpawnTime > 4500 + Math.random() * 4000) {
        for (let i = 0; i < maxShootingStars; i++) {
          if (!shootingStars[i].active) {
            spawnShootingStar(shootingStars[i], i);
            lastMeteorSpawnTime = now;
            break;
          }
        }
      }

      for (let i = 0; i < maxShootingStars; i++) {
        const star = shootingStars[i];
        if (star.active) {
          star.progress += 1;
          star.current.add(star.velocity);

          const tail = star.current
            .clone()
            .sub(star.velocity.clone().normalize().multiplyScalar(star.length));

          const lineGeo = shootingStarLines[i]
            .geometry as THREE.BufferGeometry;
          const pos = lineGeo.attributes.position.array as Float32Array;

          pos[0] = star.current.x;
          pos[1] = star.current.y;
          pos[2] = star.current.z;
          pos[3] = tail.x;
          pos[4] = tail.y;
          pos[5] = tail.z;
          lineGeo.attributes.position.needsUpdate = true;

          const mat = shootingStarLines[i]
            .material as THREE.LineBasicMaterial;
          mat.opacity = Math.max(0, 1 - star.progress / 40);

          if (star.progress > 45) {
            star.active = false;
            mat.opacity = 0;
          }
        }
      }

      // Render 3D Scene
      renderer.render(scene, camera);

      // --- 2D Interactive Celestial Cursor & Ripple Loop ---
      const cCanvas = cursorCanvasRef.current;
      if (cCanvas) {
        const ctx = cCanvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, cCanvas.width, cCanvas.height);

          const particles = cursorParticlesRef.current;
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life++;
            const progress = p.life / p.maxLife;
            p.alpha = 1 - progress;

            if (p.life >= p.maxLife) {
              particles.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha * 0.75})`;
            ctx.shadowColor = `hsl(${p.hue}, 100%, 70%)`;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
          }

          if (state.isMouseOnScreen && state.screenMouseX > 0) {
            const mx = state.screenMouseX;
            const my = state.screenMouseY;

            ctx.save();
            const grad = ctx.createRadialGradient(
              mx,
              my,
              0,
              mx,
              my,
              state.isHoveringGalaxy ? 44 : 32
            );
            grad.addColorStop(
              0,
              state.isHoveringGalaxy
                ? "rgba(251, 191, 36, 0.7)"
                : "rgba(56, 189, 248, 0.45)"
            );
            grad.addColorStop(
              0.3,
              state.isHoveringGalaxy
                ? "rgba(245, 158, 11, 0.35)"
                : "rgba(251, 191, 36, 0.2)"
            );
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(mx, my, state.isHoveringGalaxy ? 44 : 32, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(mx, my, state.isHoveringGalaxy ? 3.5 : 2, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = state.isHoveringGalaxy ? "#fbbf24" : "#38bdf8";
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.restore();
          }
        }
      }
    };

    animate();

    // --- 10. CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);

      sphereGeo.dispose();
      skyMat.dispose();
      starGeo.dispose();
      starMaterial.dispose();
      dustGeo.dispose();
      dustMaterial.dispose();
      shuktara.dispose();
      needleGalaxy.dispose();
      shootingStarLines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [isAutoRotating, enterInspectMode, exitInspectMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-auto overflow-hidden select-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "auto",
        overflow: "hidden",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* 3D WebGL Canvas for 360-Degree Galaxy & Particles */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-1000 ${
          isDragging ? "cursor-grabbing" : isGalaxyHovered ? "cursor-pointer" : "cursor-grab"
        }`}
        style={{ width: "100%", height: "100%", display: "block" }}
      />

      {/* 2D Overlay Canvas for Celestial Mouse Trail & Ripples */}
      <canvas
        ref={cursorCanvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* --- GALAXY HOVER TOOLTIP IN UNIVERSE MODE --- */}
      {isGalaxyHovered && !isInspecting && (
        <div
          onClick={enterInspectMode}
          className="fixed z-30 transform -translate-x-1/2 -translate-y-12 cursor-pointer pointer-events-auto px-4 py-2 rounded-2xl bg-slate-950/80 border border-amber-400/50 backdrop-blur-xl shadow-2xl shadow-amber-500/30 text-xs text-amber-200 flex items-center gap-2.5 animate-bounce-slow"
          style={{
            left: `${interactionRef.current.screenMouseX}px`,
            top: `${interactionRef.current.screenMouseY}px`,
          }}
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Barred Spiral Galaxy • Click to enter</span>
        </div>
      )}

      {/* --- GALAXY CLOSE-UP 360° INSPECT MODE HUD --- */}
      {isInspecting && (
        <>
          {/* Top Floating Inspection Pill */}
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-950/80 border border-amber-500/40 backdrop-blur-xl shadow-2xl shadow-amber-950/60 text-slate-100 text-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-semibold text-amber-300">
              Barred Spiral Galaxy
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              360° Inspection: Drag mouse to look around
            </span>
          </div>

          {/* Top-Right "Back to Universe" Button */}
          <button
            onClick={exitInspectMode}
            className="fixed top-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 text-xs font-mono uppercase tracking-wider backdrop-blur-md transition-all shadow-xl shadow-cyan-950/50 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Universe (Exit)</span>
          </button>

          {/* Bottom Zoom Controls */}
          <div className="fixed bottom-6 left-6 z-30 flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-md text-xs text-slate-400 font-mono">
            <button
              onClick={() => {
                interactionRef.current.targetOrbitRadius = Math.max(
                  140,
                  interactionRef.current.targetOrbitRadius - 40
                );
              }}
              title="Zoom In"
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                interactionRef.current.targetOrbitRadius += 40;
                if (interactionRef.current.targetOrbitRadius > 520) {
                  exitInspectMode();
                }
              }}
              title="Zoom Out"
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-500 pl-1">
              Scroll mouse wheel to zoom
            </span>
          </div>
        </>
      )}

      {/* --- STANDARD 360° UNIVERSE HUD (Hidden in Inspect Mode) --- */}
      {!isInspecting && (
        <div className="fixed bottom-6 right-6 z-20 flex items-center gap-2">
          {showHint && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono backdrop-blur-md shadow-lg shadow-cyan-950/50 animate-pulse">
              <Move className="w-3.5 h-3.5" />
              <span>Drag 360° to look around • Click to inspect galaxy</span>
            </div>
          )}

          {/* Direct shortcut to inspect the Golden Galaxy */}
          <button
            onClick={enterInspectMode}
            title="Explore Golden Galaxy"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-950/70 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 text-xs font-mono backdrop-blur-md transition-all shadow-lg shadow-amber-950/30 hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Inspect Galaxy</span>
          </button>

          {/* 360° Compass & Auto-Orbit Toggle Button */}
          <button
            onClick={() => setIsAutoRotating((prev) => !prev)}
            title={
              isAutoRotating
                ? "Pause auto cosmic drift"
                : "Resume auto cosmic drift"
            }
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg ${
              isAutoRotating
                ? "bg-slate-900/80 border-cyan-500/40 text-cyan-300 shadow-cyan-950/40"
                : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass
              className={`w-4 h-4 ${
                isAutoRotating ? "animate-spin-slow text-cyan-400" : ""
              }`}
            />
          </button>

          {/* Reset View Button */}
          <button
            onClick={resetView}
            title="Reset galaxy alignment to center"
            className="p-2.5 rounded-full bg-slate-950/70 border border-white/10 hover:border-amber-400/40 text-slate-400 hover:text-amber-300 backdrop-blur-md transition-all shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default InteractiveGalaxy;
