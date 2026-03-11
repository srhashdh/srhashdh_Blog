// 3d 背景
"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { setupInteractivePoints } from "@/components/interactiveHandler";
import { BookInteraction } from "@/components/BookInteractive";

export const interactivePointsData = [
  { id: 1, position: [-0.47, 2.57, -2.57], title: "最近文章" },
  { id: 2, position: [0.57, 2.54, -2.59], title: "計算機科學" },
  { id: 3, position: [-0.89, 2.72, -2.59], title: "數學" },
  { id: 4, position: [-0.88, 2.37, -2.57], title: "未知1" },
  { id: 5, position: [-1.73, 2.44, -2.60], title: "未知2" },
  { id: 6, position: [1.19, 2.71, -0.36], title: "未知3" },
  { id: 7, position: [-2.34, 2.54, -0.77], title: "未知4" },
  { id: 8, position: [-2.33, 2.53, -0.1], title: "未知5" },
  { id: 9, position: [-2.34, 2.82, -0.78], title: "未知6" },
  { id: 10, position: [1.19, 2.82, -0.04], title: "未知7" }
];

export default function DarkAcademiaScene() {
  const mountRef = useRef(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    let renderer, scene, camera, controls;
    let interactive, bookInteraction;

    const init = async () => {
      // === Scene ===
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f0a05);

      // === Camera ===
      camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.set(-0.57, 2.5, 1.5);
      camera.lookAt(-0.57, 2.5, -2);

      // === Renderer ===
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      // === Light ===
      const ambientLight = new THREE.AmbientLight(0xfff5e1, 0.8);
      scene.add(ambientLight);

      // === Book Interaction ===
      bookInteraction = new BookInteraction(scene, camera, {
        bookModelPath: "/models/old_book.glb",
        distanceFromCamera: 1.5,
        blurAmount: "10px",
      });

      await bookInteraction.initialize(); // <-- 這裡就能安全 await

      // === Interactive Points ===
      interactive = setupInteractivePoints(
        scene,
        camera,
        interactivePointsData,
        (info) => setHoverInfo(info),
        (clickInfo) => {
          const { point } = clickInfo;
          bookInteraction.showBook(point, {});
        }
      );

      // === Load Library Model ===
      const loader = new GLTFLoader();
      loader.load("/models/library.glb", (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.DoubleSide;
            child.material.transparent = false;
            child.material.opacity = 1;
          }
        });
        scene.add(model);
      });

      // === Orbit Controls ===
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enableZoom = false;
      controls.dampingFactor = 0.05;
      controls.target.set(-0.57, 2.5, -0.36);

      // === Events ===
      window.addEventListener("mousemove", interactive.handleMouseMove);
      window.addEventListener("click", interactive.handleClick);

      // === Animation Loop ===
      const clock = new THREE.Clock();
      const animate = () => {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();
        interactive.updateAnimation(time);

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // === Resize ===
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    };

    // initialize
    init();

    return () => {
      window.removeEventListener("mousemove", interactive?.handleMouseMove);
      window.removeEventListener("click", interactive?.handleClick);

      renderer?.dispose();
      bookInteraction?.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0f0a05]">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {hoverInfo && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: hoverInfo.mouseX + 20,
            top: hoverInfo.mouseY - 10,
          }}
        >
          <div className="bg-[#1a1410] border-2 border-[#d4af37] rounded-lg px-4 py-2 shadow-xl">
            <p className="text-[#d4af37] font-serif font-semibold whitespace-nowrap">
              {hoverInfo.point.title}
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 text-[#d4af37] text-sm font-serif bg-black bg-opacity-60 px-6 py-3 rounded-full backdrop-blur-sm">
        請探索發光點
      </div>
    </div>
  );
}