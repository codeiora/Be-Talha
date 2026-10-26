import * as THREE from "three";

export interface ShuktaraBeaconConfig {
  size?: number;
  coreColor?: string;
  spikeColor?: string;
  haloColor?: string;
}

export class ShuktaraBeacon {
  public group: THREE.Group;
  private coreSprite: THREE.Sprite;
  private spikeSprite: THREE.Sprite;
  private haloSprite: THREE.Sprite;
  private orbitingEmbers: THREE.Points;
  private emberGeo: THREE.BufferGeometry;
  private emberMaterial: THREE.PointsMaterial;
  private totalEmbers = 40;
  private emberAngles: Float32Array;
  private emberRadii: Float32Array;
  private emberSpeeds: Float32Array;

  constructor(config: ShuktaraBeaconConfig = {}) {
    const {
      size = 65,
      coreColor = "#ffffff",
      spikeColor = "#bae6fd",
      haloColor = "#38bdf8",
    } = config;

    this.group = new THREE.Group();

    // --- 1. PROCEDURAL DIFFRACTION SPIKES & FLARE TEXTURE ---
    const spikeTexture = this.createDiffractionSpikeTexture();
    const coreTexture = this.createCoreGlowTexture();
    const haloTexture = this.createPrismaticHaloTexture();

    // --- 2. CHROMATIC PRISMATIC HALO SPRITE ---
    const haloMat = new THREE.SpriteMaterial({
      map: haloTexture,
      color: new THREE.Color(haloColor),
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.haloSprite = new THREE.Sprite(haloMat);
    this.haloSprite.scale.set(size * 2.2, size * 2.2, 1);
    this.group.add(this.haloSprite);

    // --- 3. LONG DIFFRACTION SPIKES (4 Primary + 4 Secondary Spikes) ---
    const spikeMat = new THREE.SpriteMaterial({
      map: spikeTexture,
      color: new THREE.Color(spikeColor),
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.spikeSprite = new THREE.Sprite(spikeMat);
    this.spikeSprite.scale.set(size * 2.8, size * 2.8, 1);
    this.group.add(this.spikeSprite);

    // --- 4. SUPER-BRILLIANT CENTRAL CORE SPRITE ---
    const coreMat = new THREE.SpriteMaterial({
      map: coreTexture,
      color: new THREE.Color(coreColor),
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.coreSprite = new THREE.Sprite(coreMat);
    this.coreSprite.scale.set(size * 0.9, size * 0.9, 1);
    this.group.add(this.coreSprite);

    // --- 5. ORBITING CELESTIAL STARDUST EMBERS ---
    this.emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(this.totalEmbers * 3);
    const emberColors = new Float32Array(this.totalEmbers * 3);

    this.emberAngles = new Float32Array(this.totalEmbers);
    this.emberRadii = new Float32Array(this.totalEmbers);
    this.emberSpeeds = new Float32Array(this.totalEmbers);

    const emberCol1 = new THREE.Color("#ffffff");
    const emberCol2 = new THREE.Color("#7dd3fc");

    for (let i = 0; i < this.totalEmbers; i++) {
      const idx = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const r = size * 0.25 + Math.random() * (size * 0.9);

      this.emberAngles[i] = angle;
      this.emberRadii[i] = r;
      this.emberSpeeds[i] = (Math.random() - 0.5) * 1.4;

      emberPositions[idx] = r * Math.cos(angle);
      emberPositions[idx + 1] = (Math.random() - 0.5) * 15;
      emberPositions[idx + 2] = r * Math.sin(angle);

      const c = new THREE.Color().lerpColors(emberCol1, emberCol2, Math.random());
      emberColors[idx] = c.r;
      emberColors[idx + 1] = c.g;
      emberColors[idx + 2] = c.b;
    }

    this.emberGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(emberPositions, 3)
    );
    this.emberGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(emberColors, 3)
    );

    this.emberMaterial = new THREE.PointsMaterial({
      size: 3.5,
      map: coreTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.orbitingEmbers = new THREE.Points(this.emberGeo, this.emberMaterial);
    this.group.add(this.orbitingEmbers);
  }

  // --- PROCEDURAL DIFFRACTION SPIKES BUILDER ---
  private createDiffractionSpikeTexture(): THREE.Texture {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const center = size / 2;

    // Clear background
    ctx.clearRect(0, 0, size, size);

    // Primary 4-point vertical & horizontal razor-sharp spike beams
    const drawSpikeBeam = (angle: number, length: number, width: number, alpha: number) => {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle);

      const grad = ctx.createLinearGradient(-length, 0, length, 0);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(0.35, `rgba(186, 230, 253, ${alpha * 0.4})`);
      grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(0.65, `rgba(186, 230, 253, ${alpha * 0.4})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-length, 0);
      ctx.lineTo(0, -width);
      ctx.lineTo(length, 0);
      ctx.lineTo(0, width);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // Primary Horizontal & Vertical Spikes (Long)
    drawSpikeBeam(0, center * 0.98, 2.5, 0.95);
    drawSpikeBeam(Math.PI / 2, center * 0.98, 2.5, 0.95);

    // Secondary Diagonal Spikes (Medium - James Webb style 8-point cross)
    drawSpikeBeam(Math.PI / 4, center * 0.65, 1.8, 0.6);
    drawSpikeBeam(-Math.PI / 4, center * 0.65, 1.8, 0.6);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createCoreGlowTexture(): THREE.Texture {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const c = size / 2;

    const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.15, "rgba(235, 248, 255, 0.95)");
    grad.addColorStop(0.35, "rgba(147, 197, 253, 0.55)");
    grad.addColorStop(0.7, "rgba(56, 189, 248, 0.15)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createPrismaticHaloTexture(): THREE.Texture {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const c = size / 2;

    // Prismatic subtle rainbow chromatic ring
    const grad = ctx.createRadialGradient(c, c, c * 0.2, c, c, c * 0.9);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    grad.addColorStop(0.35, "rgba(125, 211, 252, 0.3)");
    grad.addColorStop(0.65, "rgba(216, 180, 254, 0.2)");
    grad.addColorStop(0.85, "rgba(251, 191, 36, 0.12)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // --- ANIMATION UPDATE ---
  public update(deltaTime: number, elapsedTime: number): void {
    // Dynamic breathing twinkle pulse
    const pulse = 1.0 + Math.sin(elapsedTime * 2.8) * 0.08 + Math.cos(elapsedTime * 5.2) * 0.04;
    this.coreSprite.scale.set(65 * pulse * 0.9, 65 * pulse * 0.9, 1);
    this.spikeSprite.scale.set(65 * pulse * 2.8, 65 * pulse * 2.8, 1);

    // Subtle slow chromatic rotation of the diffraction spikes
    this.spikeSprite.material.rotation = Math.sin(elapsedTime * 0.3) * 0.05;

    // Orbiting embers animation
    const pos = this.emberGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < this.totalEmbers; i++) {
      const idx = i * 3;
      this.emberAngles[i] += this.emberSpeeds[i] * deltaTime * 0.8;
      const a = this.emberAngles[i];
      const r = this.emberRadii[i];

      pos[idx] = r * Math.cos(a);
      pos[idx + 1] += Math.sin(elapsedTime * 2 + i) * 0.08;
      pos[idx + 2] = r * Math.sin(a);
    }
    this.emberGeo.attributes.position.needsUpdate = true;
  }

  public dispose(): void {
    this.emberGeo.dispose();
    this.emberMaterial.dispose();
    (this.coreSprite.material as THREE.Material).dispose();
    (this.spikeSprite.material as THREE.Material).dispose();
    (this.haloSprite.material as THREE.Material).dispose();
  }
}
