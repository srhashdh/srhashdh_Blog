"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const PenWritingScene = () => {
  const mountRef = useRef(null);
  const [loadStatus, setLoadStatus] = useState("初始化中...");
  const [penPosition, setPenPosition] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    // 相機
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(-0.57, 2.5, 1.5);
    camera.lookAt(-0.57, 2.5, -2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // 燈光
    const ambientLight = new THREE.AmbientLight(0xfff5e1, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffd7a3, 1.2);
    directionalLight.position.set(3, 5, 2);
    scene.add(directionalLight);

    // 筆群組
    const penGroup = new THREE.Group();
    scene.add(penGroup);

    // 載入筆模型
    const loader = new GLTFLoader();
    setLoadStatus("正在載入鋼筆模型...");
    loader.load(
      '/models/quillpen.glb',
      (gltf) => {
        const penModel = gltf.scene;
        penModel.scale.set(1, 1, 1);
        penModel.rotation.z = -0.3;
        penModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.emissive = new THREE.Color(0x442200);
              child.material.emissiveIntensity = 0.3;
            }
          }
        });
        penGroup.add(penModel);
        setLoadStatus("✓ 模型載入成功");
      },
      (progress) => {
        const percent = progress.total > 0 ? (progress.loaded / progress.total * 100).toFixed(0) : 0;
        setLoadStatus(`載入中: ${percent}%`);
      },
      (error) => {
        console.error('❌ 筆模型載入錯誤：', error);
        setLoadStatus(`載入失敗: ${error.message || '檔案路徑錯誤'}`);
      }
    );

    // 文字 Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 2048;
    canvas.height = 256;
    const fullText = "Welcome to my study chamber";
    ctx.fillStyle = '#FAF3DD';
    ctx.font = 'italic 60px "Times New Roman", serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const planeWidth = 2;       // PlaneGeometry 寬度
    const textStartPixel = 50;   // Canvas 字起點
    const textWidthPixel = ctx.measureText(fullText).width;

    // 計算 3D X 坐標，確保筆與文字起點對齊
    const startX = -planeWidth / 2 + (textStartPixel / canvas.width) * planeWidth;
    const endX = startX + (textWidthPixel / canvas.width) * planeWidth;

    const texture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth, 0.25), textMaterial);
    textMesh.position.set(0, 2.8, -1); // PlaneGeometry 中心對齊世界座標
    scene.add(textMesh);

    // 動畫參數
    let time = 0;
    const duration = 15;
    const penLeadTime = 0.5; // 筆先動0.5秒
    const baseY = 2.85;
    const baseZ = -0.9;
    const amplitude = 0.03;
    const frequency = 2;

    function animate() {
      time += 0.016;
      const totalProgress = Math.min(time / duration, 1);

      // 筆位置
      const penProgress = totalProgress;
      const currentX = startX + (endX - startX) * penProgress;
      const currentY = baseY + Math.sin(time * frequency) * amplitude;
      penGroup.position.set(currentX, currentY, baseZ);
      penGroup.rotation.z = -0.3 + Math.sin(time * frequency) * 0.05;

      // 文字延遲 0.5 秒出現
      let textProgress = 0;
      if (time > penLeadTime) {
        textProgress = Math.min((time - penLeadTime) / (duration - penLeadTime), 1);
      }
      const visibleChars = Math.floor(fullText.length * textProgress);
      const displayText = fullText.substring(0, visibleChars);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText(displayText, textStartPixel, canvas.height / 2);
      texture.needsUpdate = true;

      setPenPosition({ x: currentX, y: currentY, z: baseZ });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mount && renderer.domElement) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />
      <div className="absolute top-4 right-4 text-[#FAF3DD] text-xs bg-black bg-opacity-70 px-3 py-2 rounded font-mono z-[100]">

      </div>
    </>
  );
};

export default PenWritingScene;
