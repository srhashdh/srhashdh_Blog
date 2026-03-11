// 所有互動邏輯都在這個檔案

import * as THREE from "three";

export function setupInteractivePoints(scene, camera, interactiveData, onHover, onClick) {
  const meshes = [];
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let currentHoveredId = null;
  
  // 🔥 設定射線檢測閾值（針對 Mesh 物件）
  raycaster.params.Mesh = { threshold: 0 };
  
  // === 創建互動粉塵點 ===
  function createPoints() {
    interactiveData.forEach((point) => {
      // 1️⃣ 建立粉塵粒子幾何（視覺效果）
      const particleGeometry = new THREE.BufferGeometry();
      const count = 10; // 粒子數量
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const r = 0.05 * Math.random(); // 半徑範圍
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }

      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      // 2️⃣ 建立粒子材質
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffed00,
        size: 0.025,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      });

      // 3️⃣ 組合為粒子系統
      const particles = new THREE.Points(particleGeometry, particleMaterial);

      // 4️⃣ 🔥 新增：不可見的球體作為碰撞體

      const hitboxGeometry = new THREE.SphereGeometry(0.03, 16, 16); // 調整半徑控制互動範圍
      const hitboxMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0, // 完全透明
        depthWrite: false,
        // 🔧 可選：開發時取消註解以顯示碰撞範圍
        //opacity: 0.3,
        //color: 0xff0000,
        //wireframe: true,
      });
      const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
      hitbox.userData = point; // 把資料存在 hitbox 上

      // 5️⃣ 建立群組並設定位置
      const group = new THREE.Group();
      group.add(particles);
      group.add(hitbox);
      group.position.set(...point.position);
      
      scene.add(group);
      
      // 🔥 重要：分別儲存視覺元素和碰撞體
      meshes.push({
        visual: particles,
        hitbox: hitbox,
        group: group
      });
    });
  }

  // === 更新動畫 ===
  function updateAnimation(time) {
    meshes.forEach((item, i) => {
      const isHovered = item.hitbox.userData.id === currentHoveredId;

      // 🔥 只對視覺粒子做動畫效果
      item.visual.rotation.y += 0.002;
      item.visual.rotation.x += 0.001;
      item.visual.material.opacity = isHovered
        ? 0.9 + Math.sin(time * 6 + i) * 0.3
        : 0.7 + Math.sin(time * 3 + i) * 0.2;

      // hover 時粒子輕微放大
      const scale = isHovered ? 1.3 : 1;
      item.visual.scale.setScalar(scale);
      
      // 🔥 hitbox 保持不變（不旋轉、不縮放），確保穩定的互動範圍
    });
  }

  // === 滑鼠移動偵測 ===
  function handleMouseMove(event) {
    if (!camera || meshes.length === 0) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    // 🔥 只檢測 hitbox（碰撞體）
    const hitboxes = meshes.map(item => item.hitbox);
    const intersects = raycaster.intersectObjects(hitboxes);

    if (intersects.length > 0) {
      const hovered = intersects[0].object.userData;
      
      // ✅ 只在 hover 的物件改變時才觸發回調
      if (currentHoveredId !== hovered.id) {
        currentHoveredId = hovered.id;
        document.body.style.cursor = 'pointer';
        
        if (onHover) {
          onHover({
            point: hovered,
            mouseX: event.clientX,
            mouseY: event.clientY
          });
        }
      }
    } else {
      // ✅ 只在從 hover 狀態變為無 hover 時才觸發
      if (currentHoveredId !== null) {
        currentHoveredId = null;
        document.body.style.cursor = 'default';
        
        if (onHover) {
          onHover(null);
        }
      }
    }
  }
  function handleClick(event) {
  if (!camera || meshes.length === 0) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const hitboxes = meshes.map(item => item.hitbox);
  const intersects = raycaster.intersectObjects(hitboxes);

  if (intersects.length > 0) {
    const clicked = intersects[0].object.userData;
    const clickedMesh = meshes.find(item => item.hitbox.userData.id === clicked.id);

    if (onClick && clickedMesh) {
      onClick({
        point: clicked,
        position: clickedMesh.group.position.clone()
      });
    }
  }
}


  // === 清理 ===
  function dispose() {
    meshes.forEach((item) => {
      scene.remove(item.group);
      item.visual.geometry.dispose();
      item.visual.material.dispose();
      item.hitbox.geometry.dispose();
      item.hitbox.material.dispose();
    });
    meshes.length = 0;
  }

  // === 初始化 ===
  createPoints();

  return {
    updateAnimation,
    handleMouseMove,
    handleClick,
    dispose,
  };
}