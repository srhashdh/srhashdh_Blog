'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function TarotCardLinks({ links = [], onCardClick, className = "" }) {
  const router = useRouter()
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const [clickedCards, setClickedCards] = useState(new Set())

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    import('three').then(THREE => {
      if (sceneRef.current) {
        sceneRef.current.cleanup()
      }

      const container = containerRef.current
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 12

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.domElement.style.pointerEvents = 'auto'
      renderer.domElement.style.position = 'absolute'
      renderer.domElement.style.top = '0'
      renderer.domElement.style.left = '0'
      container.appendChild(renderer.domElement)

      // ====== 中心圖片 ======
      function loadCenterImage(url) {
  new THREE.TextureLoader().load(url, function(texture) {
    const img = texture.image || { width: 1, height: 1 }

    // 計算螢幕寬度對應的世界單位
    const fov = camera.fov * (Math.PI / 180) // 垂直視角弧度
    const heightAtZ = 2 * Math.tan(fov / 2) * camera.position.z
    const widthAtZ = heightAtZ * (window.innerWidth / window.innerHeight)

    // 模擬 70vw 最大 2000px 對應世界單位
    const scale = Math.min(0.7 * widthAtZ, 2000 / 1500 * widthAtZ)
    const aspect = img.height / img.width
    const w = scale
    const h = w * aspect

    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
    const geometry = new THREE.PlaneGeometry(w, h)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    scene.add(mesh)
  })
}

      loadCenterImage('/MainPageCharacter.png', 6)

      // ====== 卡牌 ======
      const cardGroup = new THREE.Group()
      scene.add(cardGroup)

      const cardMeshes = []
      const radius = 7
      const cardCount = links.length

      links.forEach(function(link, index) {
        const geometry = new THREE.PlaneGeometry(1.35, 1.98)
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 768
        const ctx = canvas.getContext('2d')

        const gradient = ctx.createRadialGradient(256, 200, 0, 256, 384, 600)
        gradient.addColorStop(0, '#0a0e2a')
        gradient.addColorStop(0.25, '#122056')
        gradient.addColorStop(0.45, '#1c2b77')
        gradient.addColorStop(1, '#05081a')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 512, 768)

        ctx.strokeStyle = 'rgba(100, 140, 255, 0.5)'
        ctx.lineWidth = 4
        ctx.strokeRect(10, 10, 492, 748)

        ctx.font = 'bold 120px Arial'
        ctx.fillStyle = '#cfd9ff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(link.icon || '☽', 256, 280)

        ctx.font = 'bold 48px Arial'
        ctx.fillStyle = '#d8e2ff'
        ctx.fillText(link.title, 256, 450)

        if (link.desc) {
          ctx.font = '32px Arial'
          ctx.fillStyle = 'rgba(208, 220, 255, 0.8)'
          ctx.fillText(link.desc, 256, 520)
        }

        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true })
        const card = new THREE.Mesh(geometry, material)

        const angle = (index / cardCount) * Math.PI * 2
        card.position.x = Math.cos(angle) * radius
        card.position.z = Math.sin(angle) * radius
        card.lookAt(0, card.position.y, 0)
        card.rotation.y += Math.PI

        card.userData = { link, index }
        cardMeshes.push(card)
        cardGroup.add(card)
      })

      // ====== 滑鼠旋轉 ======
      let isDragging = false
      let prevMouseX = 0
      let velocity = 0
      let targetRotation = 0

      const onDown = function(e) {
        isDragging = true
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        prevMouseX = clientX
        velocity = 0
      }
      const onMove = function(e) {
        if (!isDragging) return
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const delta = clientX - prevMouseX
        velocity = delta * 0.005
        targetRotation += velocity
        prevMouseX = clientX
      }
      const onUp = function() { isDragging = false }

      renderer.domElement.addEventListener('mousedown', onDown)
      renderer.domElement.addEventListener('mousemove', onMove)
      renderer.domElement.addEventListener('mouseup', onUp)
      renderer.domElement.addEventListener('touchstart', onDown)
      renderer.domElement.addEventListener('touchmove', onMove)
      renderer.domElement.addEventListener('touchend', onUp)

      // ====== 點擊 ======
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()
      const onDoubleClick = function(e) {
        e.stopPropagation()
        if (Math.abs(velocity) > 0.01) return
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(cardMeshes)
        if (intersects.length > 0) {
          const card = intersects[0].object
          const link = card.userData.link
          setClickedCards(prev => new Set([...prev, link.id]))
          onCardClick && onCardClick({ cardId: link.id, cardData: link, timestamp: Date.now() })
          if (link.url && link.url !== window.location.pathname) {
            setTimeout(() => router.push(link.url), 300)
          }
          setTimeout(() => setClickedCards(new Set()), 1500)
        }
      }
      renderer.domElement.addEventListener('click', onDoubleClick)

      // ====== resize ======
      const onResize = function() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)

      // ====== 動畫 ======
      const animate = function() {
        requestAnimationFrame(animate)
        if (!isDragging) {
          velocity *= 0.95
          targetRotation += velocity
        }
        cardGroup.rotation.y += (targetRotation - cardGroup.rotation.y) * 0.1
        cardMeshes.forEach(function(card, i) {
          const t = Date.now() * 0.001
          card.position.y = Math.sin(t + i * 0.5) * 0.1
        })
        renderer.render(scene, camera)
      }
      animate()

      // ====== cleanup ======
      sceneRef.current = {
        cleanup: function() {
          renderer.domElement.removeEventListener('mousedown', onDown)
          renderer.domElement.removeEventListener('mousemove', onMove)
          renderer.domElement.removeEventListener('mouseup', onUp)
          renderer.domElement.removeEventListener('touchstart', onDown)
          renderer.domElement.removeEventListener('touchmove', onMove)
          renderer.domElement.removeEventListener('touchend', onUp)
          renderer.domElement.removeEventListener('click', onDoubleClick)
          window.removeEventListener('resize', onResize)
          container.removeChild(renderer.domElement)
          renderer.dispose()
        }
      }
    })

    return () => {
      if (sceneRef.current) sceneRef.current.cleanup()
    }
  }, [links, router, onCardClick])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 ${className}`}
      style={{ zIndex: 1001, pointerEvents: 'none', width: '100vw', height: '100vh' }}
    >
      <style jsx>{`
        canvas {
          pointer-events: auto !important;
          cursor: grab !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        canvas:active {
          cursor: grabbing !important;
        }
      `}</style>
    </div>
  )
}
