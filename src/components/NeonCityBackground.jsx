'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function NeonCityBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current

    // === 基本場景 ===
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 20, 60)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

    // === 光源 ===
    const ambientLight = new THREE.AmbientLight(0x6666ff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00f2ff, 1.5, 100)
    pointLight.position.set(0, 30, 50)
    scene.add(pointLight)

    // === 粒子 ===
    const particleCount = 1200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = Math.random() * 200 - 100  // x
      positions[i * 3 + 1] = Math.random() * 40        // y
      positions[i * 3 + 2] = Math.random() * 200 - 100 // z

      colors[i * 3 + 0] = 0.0 + Math.random() * 0.3    // R 偏藍
      colors[i * 3 + 1] = 0.2 + Math.random() * 0.2    // G 偏暗
      colors[i * 3 + 2] = 0.6 + Math.random() * 0.4    // B 深藍霓虹
      sizes[i] = Math.random() * 1.5 + 0.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.6,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // === 動畫 ===
    const animate = () => {
      requestAnimationFrame(animate)

      const positions = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 0] -= 0.15 + Math.random() * 0.05  // x 向左
        positions[i * 3 + 1] += 0.02 * Math.random()         // y 微漂浮
        if (positions[i * 3 + 0] < -100) positions[i * 3 + 0] = 100
        if (positions[i * 3 + 1] > 50) positions[i * 3 + 1] = 0
      }
      geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // === resize ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 z-0" />
}
