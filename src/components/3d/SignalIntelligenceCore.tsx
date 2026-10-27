import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SpindleDigitalTwinProps {
  reducedMotion?: boolean;
  speedRpm?: number;
  torqueNm?: number;
  isFailure?: boolean;
}

export const SignalIntelligenceCore: React.FC<SpindleDigitalTwinProps> = ({
  reducedMotion = false,
  speedRpm = 1500,
  torqueNm = 40.0,
  isFailure = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const machineGroup = new THREE.Group();
    scene.add(machineGroup);

    // 1. Spindle Rotor Cylinder (Machining core)
    const spindleColor = isFailure ? 0xef4444 : 0x06b6d4;
    const cylinderGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.2, 32);
    const cylinderMat = new THREE.MeshBasicMaterial({
      color: spindleColor,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const spindleMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    spindleMesh.rotation.z = Math.PI / 2;
    machineGroup.add(spindleMesh);

    // 2. High-speed Tool Tip / Milling Cutter Cone
    const cutterGeo = new THREE.ConeGeometry(0.7, 1.2, 16);
    const cutterMat = new THREE.MeshBasicMaterial({
      color: isFailure ? 0xf59e0b : 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const cutterMesh = new THREE.Mesh(cutterGeo, cutterMat);
    cutterMesh.position.x = 2.1;
    cutterMesh.rotation.z = -Math.PI / 2;
    machineGroup.add(cutterMesh);

    // 3. Sensor Housing Rings (Bearing Sensors)
    const ringGeo = new THREE.RingGeometry(1.5, 1.55, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.y = Math.PI / 2;
    ring1.position.x = -1.2;
    machineGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ring2.rotation.y = Math.PI / 2;
    ring2.position.x = 1.0;
    machineGroup.add(ring2);

    // 4. Rotating Telemetry Sensor Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.8 + 0.3 * Math.sin(i * 0.4);
      const x = ((i - particleCount / 2) / particleCount) * 4.5;
      const y = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = isFailure ? 0.95 : 0.02;
      colors[i * 3 + 1] = isFailure ? 0.2 : 0.71;
      colors[i * 3 + 2] = isFailure ? 0.2 : 0.83;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    machineGroup.add(particles);

    machineGroup.rotation.x = 0.35;
    machineGroup.rotation.y = -0.4;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldAnimate = !reducedMotion && !mediaQuery.matches;

    // Scale rotational speed visually
    const rotSpeed = 0.01 + (speedRpm / 3000) * 0.04;

    const animate = () => {
      if (shouldAnimate) {
        spindleMesh.rotation.x += rotSpeed;
        cutterMesh.rotation.y += rotSpeed * 1.5;
        ring1.rotation.z += 0.008;
        ring2.rotation.z -= 0.008;
        machineGroup.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (shouldAnimate) {
      animFrameIdRef.current = requestAnimationFrame(animate);
    } else {
      renderer.render(scene, camera);
    }

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
        if (!shouldAnimate) renderer.render(scene, camera);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      cylinderGeo.dispose();
      cylinderMat.dispose();
      cutterGeo.dispose();
      cutterMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion, speedRpm, torqueNm, isFailure]);

  return (
    <div className="relative w-full h-full min-h-[260px] flex items-center justify-center select-none overflow-hidden rounded-xl border border-cyan-500/10 bg-slate-950/60 shadow-inner">
      <div ref={mountRef} className="w-full h-full" />

      {/* Industrial Digital Twin Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider uppercase bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
          <span className={`w-1.5 h-1.5 rounded-full ${isFailure ? 'bg-rose-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
          Milling Spindle Digital Twin
        </div>
        <span className="text-[10px] font-mono text-slate-400">Multi-Channel Sensor Telemetry</span>
      </div>

      <div className="absolute bottom-2.5 right-3 text-right pointer-events-none font-mono text-[10px] text-slate-400 flex flex-col gap-0.5">
        <span className="text-cyan-400">Rotational Speed: {speedRpm} RPM</span>
        <span className="text-purple-400">Torque: {torqueNm} Nm</span>
        <span className={isFailure ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
          Status: {isFailure ? 'FAILURE ANOMALY' : 'HEALTHY OPERATING'}
        </span>
      </div>
    </div>
  );
};
