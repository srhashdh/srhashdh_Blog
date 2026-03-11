// ===== lib/bookInteraction.js =====
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class BookInteraction {
  constructor(scene, camera, options = {}) {
    this.scene = scene;
    this.camera = camera;
    this.loader = new GLTFLoader();

    this.options = {
      bookModelPath: options.bookModelPath || '/models/old_book.glb',
      finalScale: options.finalScale || 0.6,
      distanceFromCamera: options.distanceFromCamera || 1.5,
      blurAmount: options.blurAmount || '10px',
      ...options
    };

    this.bookModel = null;
    this.currentBook = null;
    this.isBookVisible = false;
    this.currentPointData = null;

    this.blurOverlay = null;
    this.contentPanel = null;

    this.onShowComplete = null;
    this.onHideComplete = null;
  }

  /** 初始化：載入模型 + 建立 UI */
  async initialize() {
    try {
      await this.preloadBook();
      this.createUIElements();
      console.log('✅ 書本互動系統初始化完成');
      return true;
    } catch (err) {
      console.error('❌ 初始化失敗:', err);
      return false;
    }
  }

  /** 預載書本模型 */
  async preloadBook() {
    return new Promise((resolve, reject) => {
      this.loader.load(
        this.options.bookModelPath,
        (gltf) => {
          this.bookModel = gltf.scene;
          resolve(gltf.scene);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  /** 建立 UI 元素 */
  createUIElements() {
    // 背景霧化遮罩
    this.blurOverlay = document.createElement('div');
    this.blurOverlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 30;
      opacity: 0;
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
      background-color: rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(this.blurOverlay);

    // 內容面板
    this.contentPanel = document.createElement('div');
    this.contentPanel.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 50;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      pointer-events: none;
    `;
    document.body.appendChild(this.contentPanel);
  }

  /** 顯示書本 + 內容 */
  showBook(startPosition, pointData) {
  if (!this.bookModel || this.isBookVisible) return;

  this.currentBook = this.bookModel.clone();

  // 直接放在相機前方
  const cameraDirection = new THREE.Vector3();
  this.camera.getWorldDirection(cameraDirection);
  this.currentBook.position.copy(
    this.camera.position.clone().add(cameraDirection.multiplyScalar(this.options.distanceFromCamera))
  );

  this.currentBook.scale.set(this.options.finalScale, this.options.finalScale, this.options.finalScale);
  this.currentBook.rotation.set(0, 0, 0);

  this.scene.add(this.currentBook);

  // 設定狀態
  this.isBookVisible = true;
  this.currentPointData = pointData;

  // 顯示背景霧化
  this.blurOverlay.style.opacity = '1';
  this.blurOverlay.style.backdropFilter = `blur(${this.options.blurAmount})`;
  this.blurOverlay.style.webkitBackdropFilter = `blur(${this.options.blurAmount})`;
  this.blurOverlay.style.pointerEvents = 'auto';

  // 顯示內容面板
  this.contentPanel.style.display = 'flex';
  this.contentPanel.style.pointerEvents = 'auto';
  this.renderContentPanel();
}


  /** 渲染內容面板（帶關閉按鈕） */
  renderContentPanel() {
    if (!this.currentPointData || !this.currentPointData.content) return;
    const content = this.currentPointData.content;

    this.contentPanel.innerHTML = `
      <div style="
        background:#1a1410;
        border:4px solid #d4af37;
        border-radius:1rem;
        padding:2rem;
        max-width:600px;
        width:100%;
        max-height:90vh;
        overflow-y:auto;
        position:relative;
      ">
        <button id="closeBookBtn" style="
          position:absolute;
          top:1rem;
          right:1rem;
          background:none;
          border:none;
          font-size:2rem;
          color:#d4af37;
          cursor:pointer;
        ">✕</button>
        <h2 style="color:#d4af37; margin-top:0;">${content.title}</h2>
        <p style="color:rgba(212,175,55,0.9);">${content.description}</p>
      </div>
    `;

    const btn = document.getElementById('closeBookBtn');
    if (btn) btn.onclick = () => this.hideBook();
  }

  /** 隱藏書本 */
  hideBook() {
    if (!this.currentBook || !this.isBookVisible) return;

    this.scene.remove(this.currentBook);
    this.currentBook = null;
    this.isBookVisible = false;
    this.currentPointData = null;

    this.blurOverlay.style.opacity = '0';
    this.blurOverlay.style.backdropFilter = 'blur(0px)';
    this.blurOverlay.style.pointerEvents = 'none';

    this.contentPanel.style.display = 'none';
    this.contentPanel.style.pointerEvents = 'none';
  }

  /** 清理資源 */
  dispose() {
    if (this.currentBook) this.scene.remove(this.currentBook);
    if (this.bookModel) {
      this.bookModel.traverse((c) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) {
          const mats = Array.isArray(c.material) ? c.material : [c.material];
          mats.forEach(m => m.dispose());
        }
      });
    }
    if (this.blurOverlay && this.blurOverlay.parentNode) this.blurOverlay.parentNode.removeChild(this.blurOverlay);
    if (this.contentPanel && this.contentPanel.parentNode) this.contentPanel.parentNode.removeChild(this.contentPanel);
  }
}
