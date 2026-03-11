// components/DarkAcademiaParticles.jsx
"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const DarkAcademiaParticles = ({
  count = 100,
  color = 0xfaf3dd,
  speed = 0.15,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // 粒子生成
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800; // x
      positions[i * 3 + 1] = Math.random() * 600 - 300; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 500; // z
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color,
      size: 2.2,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    sceneRef.current = scene;

    // 光線與氛圍
    const light = new THREE.PointLight(0xffeebb, 1, 1000);
    light.position.set(0, 200, 400);
    scene.add(light);

    // 動畫
    const animate = () => {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(Date.now() * 0.0001 + i) * speed; // y 浮動
        if (positions[i * 3 + 1] > 300) positions[i * 3 + 1] = -300; // 循環
      }
      geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0008; // 微旋轉
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [count, color, speed]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default DarkAcademiaParticles;
