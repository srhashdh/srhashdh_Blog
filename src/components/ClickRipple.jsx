'use client'
import { useEffect } from 'react'

export default function ClickRipple() {
  useEffect(() => {
    // 將樣式注入到 head
    const style = document.createElement('style')
    style.textContent = `
      .page-ripple {
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(circle, rgba(0,255,255,0.5) 0%, rgba(0,150,255,0.3) 40%, transparent 70%);
        box-shadow: 0 0 20px rgba(0,255,255,0.6), 0 0 40px rgba(0,180,255,0.4);
        transform: scale(0);
        animation: rippleAnim 0.8s ease-out forwards;
        z-index: 9999;
      }
      @keyframes rippleAnim {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        50% {
          transform: scale(2.5);
          opacity: 0.6;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    const handleClick = (e) => {
      const ripple = document.createElement('span')
      const diameter = Math.max(window.innerWidth, window.innerHeight) * 1.5
      ripple.style.width = ripple.style.height = `${diameter}px`
      ripple.style.left = `${e.clientX - diameter / 2}px`
      ripple.style.top = `${e.clientY - diameter / 2}px`
      ripple.className = 'page-ripple'
      document.body.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove())
    }
    
    document.addEventListener('click', handleClick)
    
    return () => {
      document.removeEventListener('click', handleClick)
      style.remove()
    }
  }, [])

  
}