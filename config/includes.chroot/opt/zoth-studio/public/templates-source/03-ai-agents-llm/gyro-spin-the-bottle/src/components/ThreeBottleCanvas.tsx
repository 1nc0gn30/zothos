import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeBottleCanvasProps {
  rotationDeg: number;
  isSpinning: boolean;
  onFlickSpin?: () => void;
}

export const ThreeBottleCanvas: React.FC<ThreeBottleCanvasProps> = ({
  rotationDeg,
  isSpinning,
  onFlickSpin,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const currentRotationRef = useRef<number>(rotationDeg);
  const targetRotationRef = useRef<number>(rotationDeg);

  useEffect(() => {
    targetRotationRef.current = rotationDeg;
  }, [rotationDeg]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animFrameId: number;

    try {
      // 1. Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 8, 12);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      // 2. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const spotLight = new THREE.SpotLight(0x75d7a9, 4.5);
      spotLight.position.set(5, 12, 8);
      spotLight.angle = Math.PI / 4;
      spotLight.penumbra = 0.8;
      spotLight.castShadow = true;
      scene.add(spotLight);

      const rimLight = new THREE.PointLight(0x38bdf8, 3, 20);
      rimLight.position.set(-6, 4, -5);
      scene.add(rimLight);

      const floorGlow = new THREE.PointLight(0x54d595, 2.5, 10);
      floorGlow.position.set(0, 0.5, 0);
      scene.add(floorGlow);

      // 3. Stage Platform
      const stageGeo = new THREE.CylinderGeometry(4.2, 4.5, 0.4, 48);
      const stageMat = new THREE.MeshStandardMaterial({
        color: 0x0f1722,
        roughness: 0.2,
        metalness: 0.8,
      });
      const stage = new THREE.Mesh(stageGeo, stageMat);
      stage.position.y = -0.2;
      stage.receiveShadow = true;
      scene.add(stage);

      // Stage glowing rim ring
      const ringGeo = new THREE.TorusGeometry(4.2, 0.08, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x54d595 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.02;
      scene.add(ring);

      // 4. Bottle Mesh Group
      const bottleGroup = new THREE.Group();

      // Glass Bottle Body (Lathe Geometry for realistic curves)
      const points: THREE.Vector2[] = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.85, 0),
        new THREE.Vector2(0.9, 0.3),
        new THREE.Vector2(0.9, 2.4),
        new THREE.Vector2(0.85, 2.8),
        new THREE.Vector2(0.4, 3.8),
        new THREE.Vector2(0.32, 5.0),
        new THREE.Vector2(0.38, 5.2),
        new THREE.Vector2(0.38, 5.4),
        new THREE.Vector2(0, 5.4),
      ];

      const bottleGeo = new THREE.LatheGeometry(points, 32);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x1f7a55,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.85,
        ior: 1.52,
        thickness: 0.8,
        specularIntensity: 1.0,
        transparent: true,
        opacity: 0.9,
      });

      const bottleMesh = new THREE.Mesh(bottleGeo, glassMat);
      bottleMesh.castShadow = true;
      bottleGroup.add(bottleMesh);

      // Foil Cap
      const capGeo = new THREE.CylinderGeometry(0.39, 0.39, 0.6, 24);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.9,
        roughness: 0.2,
      });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = 5.1;
      bottleGroup.add(capMesh);

      // Label Ring around bottle body
      const labelGeo = new THREE.CylinderGeometry(0.92, 0.92, 1.1, 32);
      const labelMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b,
        roughness: 0.4,
        metalness: 0.2,
      });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.position.y = 1.6;
      bottleGroup.add(labelMesh);

      // Orient bottle lying flat on the stage along Z axis so cap points forward
      bottleGroup.rotation.x = Math.PI / 2;
      bottleGroup.position.set(0, 0.4, 0);

      // Root rotation wrapper to handle Y-axis spin
      const spinWrapper = new THREE.Group();
      spinWrapper.add(bottleGroup);
      scene.add(spinWrapper);

      // 5. Particles ring
      const particleCount = 40;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3.5 + Math.random() * 0.8;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = 0.2 + Math.random() * 0.4;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x84e4b7,
        size: 0.12,
        transparent: true,
        opacity: 0.7,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // 6. Resize listener
      const handleResize = () => {
        if (!container || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      // 7. Render Loop
      let lastTime = performance.now();
      const animate = (now: number) => {
        animFrameId = requestAnimationFrame(animate);
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        // Smoothly interpolate current rotation towards targetRotation
        const targetRad = THREE.MathUtils.degToRad(-targetRotationRef.current);
        const currRad = spinWrapper.rotation.y;

        // Smooth damping
        spinWrapper.rotation.y += (targetRad - currRad) * Math.min(1, delta * 12);

        // Wobble bottle slightly while spinning
        if (isSpinning) {
          bottleGroup.position.y = 0.4 + Math.sin(now * 0.02) * 0.08;
          bottleGroup.rotation.z = Math.sin(now * 0.015) * 0.04;
          particles.rotation.y += 0.02;
        } else {
          bottleGroup.position.y += (0.4 - bottleGroup.position.y) * 0.1;
          bottleGroup.rotation.z += (0 - bottleGroup.rotation.z) * 0.1;
          particles.rotation.y += 0.003;
        }

        renderer?.render(scene, camera);
      };

      animFrameId = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animFrameId);
        if (renderer && renderer.domElement) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch {
      setWebglFailed(true);
    }
  }, [isSpinning]);

  // Click / Drag to Spin trigger handler
  const handlePointerDown = () => {
    if (!isSpinning && onFlickSpin) {
      onFlickSpin();
    }
  };

  if (webglFailed) {
    return null; // Fall back to SVG bottle in parent component if WebGL not supported
  }

  return (
    <div
      ref={containerRef}
      className="three-canvas-container"
      onClick={handlePointerDown}
      role="button"
      tabIndex={0}
      aria-label="3D Bottle Stage - Click or tap to spin"
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onFlickSpin) {
          e.preventDefault();
          onFlickSpin();
        }
      }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        cursor: isSpinning ? 'wait' : 'pointer',
      }}
    />
  );
};
