import * as THREE from "three";

export interface NeedleGalaxyConfig {
  length?: number;
  thickness?: number;
  bulgeRadius?: number;
  starCount?: number;
}

export class NeedleGalaxy {
  public group: THREE.Group;
  private starGeometry: THREE.BufferGeometry;
  private starMaterial: THREE.PointsMaterial;
  private bulgeSprite: THREE.Sprite;
  private dustLaneMesh: THREE.Mesh;
  private totalStars: number;

  constructor(config: NeedleGalaxyConfig = {}) {
    const {
      length = 135,
      thickness = 5.5,
      bulgeRadius = 16,
      starCount = 4500,
    } = config;

    this.group = new THREE.Group();
    this.totalStars = starCount;

    // --- 1. PROCEDURAL BULGE TEXTURE ---
    const bulgeTexture = this.createBulgeTexture();
    const starTexture = this.createStarTexture();

    // --- 2. LUMINOUS BULGE ELLIPSOID SPRITE ---
    const bulgeMat = new THREE.SpriteMaterial({
      map: bulgeTexture,
      color: 0xffedd5, // Warm celestial amber-white
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.bulgeSprite = new THREE.Sprite(bulgeMat);
    this.bulgeSprite.scale.set(bulgeRadius * 2.6, bulgeRadius * 1.8, 1);
    this.group.add(this.bulgeSprite);

    // --- 3. 3D NEEDLE DISC PARTICLES ---
    this.starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colCore = new THREE.Color("#fff7ed");
    const colDiscMid = new THREE.Color("#fed7aa");
    const colDiscEdge = new THREE.Color("#93c5fd");
    const colDarkDust = new THREE.Color("#334155");

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;

      // Elongated along the X axis (-length/2 to +length/2)
      // Higher density toward the center
      const u = (Math.random() - 0.5) * 2;
      const x = Math.sign(u) * Math.pow(Math.abs(u), 1.35) * (length * 0.5);

      // Distance from center
      const r = Math.abs(x) / (length * 0.5);

      // Thickness along the Y axis (knife-thin at edges, slight bulge at center)
      const currentThickness =
        thickness * 0.6 + (1 - r) * (bulgeRadius * 0.65);
      const y = (Math.random() - 0.5) * currentThickness;

      // Thin depth along Z axis (edge-on view)
      const z = (Math.random() - 0.5) * (thickness * 1.2);

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      // Color distribution: warm golden core to crisp blue-white edge
      const starCol = new THREE.Color();
      if (r < 0.25) {
        starCol.lerpColors(colCore, colDiscMid, r / 0.25);
      } else {
        starCol.lerpColors(colDiscMid, colDiscEdge, (r - 0.25) / 0.75);
      }

      // Dark dust lane running through the equator (y near 0)
      if (Math.abs(y) < 1.4 && r > 0.15 && Math.random() < 0.45) {
        starCol.copy(colDarkDust);
      }

      colors[idx] = starCol.r;
      colors[idx + 1] = starCol.g;
      colors[idx + 2] = starCol.b;

      sizes[i] = 1.4 + Math.random() * 2.2;
    }

    this.starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.starGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    this.starGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    this.starMaterial = new THREE.PointsMaterial({
      size: 2.8,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starPoints = new THREE.Points(this.starGeometry, this.starMaterial);
    this.group.add(starPoints);

    // --- 4. ABSORPTION DUST LANE SLICE ---
    const dustGeo = new THREE.PlaneGeometry(length * 0.88, 2.2);
    const dustMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.dustLaneMesh = new THREE.Mesh(dustGeo, dustMat);
    this.dustLaneMesh.position.z = 0.5;
    this.group.add(this.dustLaneMesh);

    // Default angle: tilted at ~32 degrees just like in Image 2
    this.group.rotation.z = 0.54;
    this.group.rotation.x = 0.18;
  }

  private createBulgeTexture(): THREE.Texture {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const c = size / 2;

    const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.2, "rgba(254, 215, 170, 0.95)");
    grad.addColorStop(0.45, "rgba(251, 146, 60, 0.5)");
    grad.addColorStop(0.75, "rgba(234, 88, 12, 0.15)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createStarTexture(): THREE.Texture {
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const c = size / 2;

    const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.3, "rgba(254, 240, 138, 0.8)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  public update(deltaTime: number, elapsedTime: number): void {
    // Subtle pulsating glow
    const pulse = 1.0 + Math.sin(elapsedTime * 1.5) * 0.05;
    this.bulgeSprite.scale.set(16 * 2.6 * pulse, 16 * 1.8 * pulse, 1);
  }

  public dispose(): void {
    this.starGeometry.dispose();
    this.starMaterial.dispose();
    this.dustLaneMesh.geometry.dispose();
    (this.dustLaneMesh.material as THREE.Material).dispose();
    (this.bulgeSprite.material as THREE.Material).dispose();
  }
}
