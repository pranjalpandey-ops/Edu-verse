import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Global EduVerse AI Pedagogical Node Coordinates
export const RADAR_NODES = [
  { lat: 37.7749, lon: -122.4194, name: "Circuits & Physics Hub", ping: "4.2ms", topic: "Ohm's Law & Kirchhoff", status: "Active Session" },
  { lat: 51.5074, lon: -0.1278, name: "Quantum Optics Lab", ping: "8.1ms", topic: "Wave-Particle Duality", status: "Simulating" },
  { lat: 35.6762, lon: 139.6503, name: "Algorithms & DS Node", ping: "11.4ms", topic: "Binary Search & Big-O", status: "Live Vector" },
  { lat: 1.3521, lon: 103.8198, name: "Cognitive Diagnostics Hub", ping: "6.8ms", topic: "Misconception Interceptor", status: "Diagnostic Ready" },
  { lat: 47.3769, lon: 8.5417, name: "Calculus & Analysis Core", ping: "9.3ms", topic: "Taylor Series & Limits", status: "Math Synchronized" },
  { lat: -23.5505, lon: -46.6333, name: "Molecular Genetics Lab", ping: "16.7ms", topic: "DNA Replication & Enzymes", status: "Active Session" },
  { lat: -33.8688, lon: 151.2093, name: "Electromagnetism Grid", ping: "14.5ms", topic: "Faraday Induction & Flux", status: "Vector Tracing" },
  { lat: 25.2048, lon: 55.2708, name: "Biochemistry Cluster", ping: "7.9ms", topic: "Enzyme Kinetics & ATP", status: "Live Session" },
];

function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Generate high-resolution procedural Earth texture maps with deep blue & cyan accents
function createEarthCanvasTexture() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Deep space ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#020610');
  oceanGrad.addColorStop(0.5, '#051226');
  oceanGrad.addColorStop(1, '#020610');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Draw procedural continental landmasses with cobalt/slate contours
  ctx.fillStyle = '#0a1a2e';
  ctx.strokeStyle = '#1e3a5f';
  ctx.lineWidth = 2.5;

  const drawContinent = (points) => {
    ctx.beginPath();
    points.forEach(([xPct, yPct], i) => {
      const px = xPct * width;
      const py = yPct * height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // North America
  drawContinent([
    [0.12, 0.20], [0.28, 0.18], [0.32, 0.26], [0.26, 0.42], [0.22, 0.44], 
    [0.18, 0.52], [0.15, 0.48], [0.10, 0.35], [0.08, 0.24]
  ]);

  // South America
  drawContinent([
    [0.24, 0.54], [0.33, 0.58], [0.35, 0.72], [0.28, 0.88], [0.23, 0.86], [0.22, 0.65]
  ]);

  // Europe & Scandinavia
  drawContinent([
    [0.46, 0.18], [0.55, 0.16], [0.58, 0.25], [0.52, 0.34], [0.45, 0.32], [0.44, 0.24]
  ]);

  // Africa
  drawContinent([
    [0.45, 0.38], [0.60, 0.38], [0.62, 0.56], [0.54, 0.76], [0.48, 0.74], [0.42, 0.50]
  ]);

  // Asia / Eurasia
  drawContinent([
    [0.55, 0.16], [0.82, 0.15], [0.88, 0.32], [0.80, 0.52], [0.72, 0.48], 
    [0.64, 0.40], [0.56, 0.26]
  ]);

  // Australia
  drawContinent([
    [0.78, 0.66], [0.88, 0.66], [0.89, 0.80], [0.80, 0.82], [0.76, 0.72]
  ]);

  // Subtle coordinate grid scanlines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  for (let lat = 0; lat < height; lat += 64) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(width, lat);
    ctx.stroke();
  }
  for (let lon = 0; lon < width; lon += 64) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, height);
    ctx.stroke();
  }

  // Draw glowing electric blue & cyan city lights
  ctx.fillStyle = '#60a5fa';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 9;
  const cityClusters = [
    [0.15, 0.30], [0.18, 0.34], [0.22, 0.32], [0.25, 0.30], [0.26, 0.33], [0.16, 0.38],
    [0.48, 0.24], [0.50, 0.26], [0.52, 0.28], [0.47, 0.27], [0.54, 0.25],
    [0.68, 0.42], [0.71, 0.45], [0.78, 0.35], [0.81, 0.32], [0.82, 0.36], [0.76, 0.52],
    [0.31, 0.68], [0.29, 0.72],
    [0.85, 0.75], [0.80, 0.72]
  ];

  cityClusters.forEach(([cx, cy]) => {
    const px = cx * width;
    const py = cy * height;
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
    for (let k = 0; k < 5; k++) {
      const ox = (Math.random() - 0.5) * 22;
      const oy = (Math.random() - 0.5) * 22;
      ctx.beginPath();
      ctx.arc(px + ox, py + oy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return new THREE.CanvasTexture(canvas);
}

// Generate procedural cloud texture
function createCloudsCanvasTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(215, 235, 255, 0.35)';
  ctx.shadowColor = 'rgba(180, 220, 255, 0.45)';
  ctx.shadowBlur = 16;

  for (let i = 0; i < 55; i++) {
    const cx = Math.random() * width;
    const cy = 60 + Math.random() * (height - 120);
    const rw = 45 + Math.random() * 110;
    const rh = 12 + Math.random() * 32;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rw, rh, Math.random() * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

export const EarthCanvas = ({ onNodeSelect, activeNodeIndex = 0 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040711, 0.025);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 4.8);

    // 2. WebGL Renderer with High Precision & Antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Globe Group
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0.7, -0.05, 0);
    scene.add(globeGroup);

    // 4. Main Earth Sphere
    const earthRadius = 1.55;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    
    const earthTexture = createEarthCanvasTexture();
    earthTexture.anisotropy = 8;

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.15,
      bumpScale: 0.05,
      emissive: new THREE.Color(0x021028),
      emissiveIntensity: 0.7,
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 5. Cloud Layer Sphere
    const cloudGeometry = new THREE.SphereGeometry(earthRadius * 1.018, 48, 48);
    const cloudTexture = createCloudsCanvasTexture();
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globeGroup.add(cloudMesh);

    // 6. Multi-Layer Electric Blue Atmospheric Glow Shader
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform vec3 uColor;
      uniform float uIntensity;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float fresnel = dot(viewDir, vNormal);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        float glow = pow(fresnel, 3.2) * uIntensity;
        gl_FragColor = vec4(uColor, glow);
      }
    `;

    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0x0088ff) }, // Electric Blue / Azure
        uIntensity: { value: 1.5 }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    const atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius * 1.18, 48, 48),
      atmosphereMaterial
    );
    globeGroup.add(atmosphereMesh);

    // Inner subtle limb glow (Electric Cyan)
    const innerLimbMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          rim = smoothstep(0.48, 1.0, rim);
          gl_FragColor = vec4(0.1, 0.6, 1.0, rim * 0.5);
        }
      `,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
    const innerLimbMesh = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius * 1.006, 48, 48),
      innerLimbMaterial
    );
    globeGroup.add(innerLimbMesh);

    // 7. Radar Hotspot Markers & Beacons
    const radarGroup = new THREE.Group();
    globeGroup.add(radarGroup);

    const radarMeshes = [];

    RADAR_NODES.forEach((node, idx) => {
      const pos = latLongToVector3(node.lat, node.lon, earthRadius * 1.004);
      
      const dotGeo = new THREE.SphereGeometry(0.024, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ 
        color: idx === activeNodeIndex ? 0x38bdf8 : 0x0284c7 
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      radarGroup.add(dot);

      const ringGeo = new THREE.RingGeometry(0.028, 0.05, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(pos.clone().multiplyScalar(2));
      radarGroup.add(ring);

      const spikeGeo = new THREE.CylinderGeometry(0.003, 0.001, 0.22, 8);
      const spikeMat = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.7
      });
      const spike = new THREE.Mesh(spikeGeo, spikeMat);
      const normal = pos.clone().normalize();
      spike.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.11)));
      spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      radarGroup.add(spike);

      radarMeshes.push({ dot, ring, spike, initialPos: pos, nodeData: node, index: idx });
    });

    // 8. Orbital Constellation Rings & Satellites (Electric Blue)
    const orbitGroup = new THREE.Group();
    globeGroup.add(orbitGroup);

    const createOrbitRing = (radius, tiltX, tiltZ) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(100);
      const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
      const material = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.22
      });
      const line = new THREE.Line(geometry, material);
      line.rotation.x = tiltX;
      line.rotation.z = tiltZ;
      return line;
    };

    const orbit1 = createOrbitRing(earthRadius * 1.35, 0.45, 0.3);
    const orbit2 = createOrbitRing(earthRadius * 1.55, -0.6, -0.4);
    const orbit3 = createOrbitRing(earthRadius * 1.75, 1.1, 0.7);
    orbitGroup.add(orbit1, orbit2, orbit3);

    const satellites = [];
    for (let i = 0; i < 8; i++) {
      const satGeo = new THREE.SphereGeometry(0.016, 12, 12);
      const satMat = new THREE.MeshBasicMaterial({ color: 0xbfdbfe });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      
      const satGlowGeo = new THREE.SphereGeometry(0.035, 12, 12);
      const satGlowMat = new THREE.MeshBasicMaterial({ 
        color: 0x38bdf8, 
        transparent: true, 
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      });
      const satGlow = new THREE.Mesh(satGlowGeo, satGlowMat);
      satMesh.add(satGlow);

      globeGroup.add(satMesh);
      satellites.push({
        mesh: satMesh,
        orbitRadius: earthRadius * (1.3 + (i % 3) * 0.22),
        speed: 0.003 + (i * 0.001),
        angle: (i * Math.PI) / 4,
        inclination: 0.35 + (i * 0.25),
        tilt: (i * 0.5)
      });
    }

    // 9. Particle Starfield
    const starCount = 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starScales = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 18 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
      starScales[i] = 0.5 + Math.random() * 1.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('scale', new THREE.BufferAttribute(starScales, 1));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // 10. Lighting (Sunlight + Cyan Rim)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    blueRimLight.position.set(-6, -2, -3);
    scene.add(blueRimLight);

    const ambientLight = new THREE.AmbientLight(0x050e1f, 0.8);
    scene.add(ambientLight);

    // 11. Mouse Parallax & Scroll Integration
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = window.scrollY;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = normX * 0.35;
      mouse.targetY = normY * 0.25;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);

      if (window.innerWidth < 1024) {
        globeGroup.position.set(0, -0.4, -0.4);
      } else {
        globeGroup.position.set(0.7, -0.05, 0);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // 12. Main Render Loop
    let time = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.01;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      globeGroup.rotation.y = time * 0.08 + mouse.x * 0.4;
      globeGroup.rotation.x = 0.22 + mouse.y * 0.3;

      cloudMesh.rotation.y = time * 0.095;

      radarMeshes.forEach(({ ring }, i) => {
        const pulse = (Math.sin(time * 3 + i) + 1) * 0.5;
        const scale = 1 + pulse * 1.4;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = (1 - pulse) * 0.85;
      });

      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        const x = Math.cos(sat.angle) * sat.orbitRadius;
        const z = Math.sin(sat.angle) * sat.orbitRadius;
        sat.mesh.position.set(
          x * Math.cos(sat.inclination),
          x * Math.sin(sat.inclination) + z * Math.sin(sat.tilt),
          z * Math.cos(sat.tilt)
        );
      });

      const scrollProgress = Math.min(scrollY / (window.innerHeight * 2), 1.5);
      camera.position.y = 0.4 - scrollProgress * 0.35;
      camera.position.z = 4.8 + scrollProgress * 0.6;
      globeGroup.position.y = (window.innerWidth < 1024 ? -0.4 : -0.05) - scrollProgress * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[760px] flex items-center justify-center overflow-hidden">
      {/* ThreeJS WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />
    </div>
  );
};

export default EarthCanvas;
