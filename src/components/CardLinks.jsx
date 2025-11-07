'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TarotCardLinks({ links = [], onCardClick, className = "" }) {
  const router = useRouter()
  const [clickedCards, setClickedCards] = useState(new Set())
  const [cardPositions, setCardPositions] = useState([])
  const [cardSize, setCardSize] = useState({ width: 176, height: 260 })

  // U 字排列 + 響應式尺寸
  useEffect(() => {
    const updatePositions = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      
      // 響應式卡片大小
      let width, height, cardWidth, cardHeight
      if (vw < 640) {
        // 手機
        cardWidth = 120
        cardHeight = 180
        width = vw * 0.7
      } else if (vw < 1024) {
        // 平板
        cardWidth = 150
        cardHeight = 220
        width = 600
      } else {
        // 桌面
        cardWidth = 176
        cardHeight = 260
        width = 800
      }
      
      setCardSize({ width: cardWidth, height: cardHeight })
      
      const depth = vw < 640 ? 40 : 70
      const centerX = vw / 2
      const centerY = vh / 2 + (vw < 640 ? 30 : 50)
      
      const positions = links.map((_, index) => {
        const total = links.length
        const t = total === 1 ? 0.5 : index / (total - 1)
        const x = centerX - width / 2 + t * width
        const y = centerY - depth * (4 * (t - 0.5) ** 2 - 1)
        return { left: `${x}px`, top: `${y}px` }
      })
      setCardPositions(positions)
    }
    updatePositions()
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [links])

  const handleClick = (link, e) => {
    e.stopPropagation()
    setClickedCards(prev => new Set([...prev, link.id]))

    if (onCardClick)
      onCardClick({ cardId: link.id, cardData: link, timestamp: Date.now() })

    const currentPath = window.location.pathname
    if (link.url && link.url !== currentPath) {
      router.push(link.url)
    }

    setTimeout(() => {
      setClickedCards(new Set())
    }, 1500)
  }

  return (
    <div className={`fixed inset-0 overflow-hidden ${className} pointer-events-none`}>
      <style jsx global>{`
        @keyframes floatGentle {
          0%,100%{transform:translate(-50%,-50%) translateY(0);}
          50%{transform:translate(-50%,-50%) translateY(-6px);}
        }
        @keyframes bubbleUp {
          0%{transform:translateY(0) scale(1);opacity:1;}
          100%{transform:translateY(-60px) scale(0.5);opacity:0;}
        }
        @keyframes shatter {
          0%{transform:scale(1);opacity:1;filter:blur(0);}
          60%{transform:scale(1.2);opacity:0.8;filter:blur(2px);}
          100%{transform:scale(0.5);opacity:0;filter:blur(6px);}
        }
        @keyframes lightSweep {
          0%{transform:translateX(-100%) rotate(10deg);opacity:0;}
          50%{opacity:0.5;}
          100%{transform:translateX(200%) rotate(10deg);opacity:0;}
        }

        .tarot-card {
          position: relative;
          background: radial-gradient(circle at 50% 40%, #0a0e2a 0%, #122056 25%, #1c2b77 45%, #05081a 100%);
          border-radius: 12px;
          border: 1px solid rgba(100,140,255,0.3);
          box-shadow:
            0 0 20px rgba(0,0,40,0.6),
            inset 0 0 40px rgba(100,140,255,0.05),
            inset 0 0 80px rgba(90,130,255,0.08);
          overflow: hidden;
          transform-style: preserve-3d;
          transition: transform 0.4s ease, box-shadow 0.5s ease, background 0.5s ease;
        }
        
        @media (min-width: 640px) {
          .tarot-card:hover {
            transform: rotateY(6deg) rotateX(2deg) scale(1.05);
            box-shadow: 0 0 40px rgba(120,170,255,0.25),
                        inset 0 0 60px rgba(100,150,255,0.12);
            background: radial-gradient(circle at 50% 35%, #121a3a 0%, #1d2c66 30%, #3650b3 60%, #05081a 100%);
          }
        }
        
        @media (max-width: 639px) {
          .tarot-card:active {
            transform: scale(0.95);
          }
        }

        .tarot-frame {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(130,170,255,0.35);
          border-radius: 12px;
          box-shadow: inset 0 0 10px rgba(130,170,255,0.2);
        }

        .tarot-symbol {
          color: #cfd9ff;
          text-shadow:
            0 0 6px rgba(160,200,255,0.6),
            0 0 16px rgba(100,150,255,0.4);
        }

        .tarot-title {
          color: #d8e2ff;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Cinzel', serif;
        }

        .light-sweep {
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(130,170,255,0.2), transparent);
          animation: lightSweep 5s linear infinite;
        }

        .card-clicked {
          animation: shatter 0.8s ease forwards;
        }
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(170,210,255,0.8) 0%, rgba(130,170,255,0.1) 80%);
          animation: bubbleUp 1.2s ease forwards;
          pointer-events: none;
        }
      `}</style>

      {links.map((link, index) => {
        const isClicked = clickedCards.has(link.id)
        const position = cardPositions[index] || { left: '50%', top: '50%' }

        return (
          <div
            key={link.id}
            className="absolute cursor-pointer pointer-events-auto"
            style={{
              ...position,
              transform: 'translate(-50%, -50%)',
              animation: `floatGentle ${3 + index * 0.3}s ease-in-out infinite ${index * 0.2}s`
            }}
            onClick={(e) => handleClick(link, e)}
          >
            {!isClicked && (
              <div 
                className="tarot-card group relative overflow-visible"
                style={{
                  width: `${cardSize.width}px`,
                  height: `${cardSize.height}px`
                }}
              >
                <div className="tarot-frame" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center z-10">
                  <div 
                    className="tarot-symbol mb-2 sm:mb-3"
                    style={{ fontSize: cardSize.width < 150 ? '32px' : '48px' }}
                  >
                    {link.icon || '☽'}
                  </div>
                  <h3 
                    className="tarot-title mb-1 sm:mb-2"
                    style={{ fontSize: cardSize.width < 150 ? '0.75rem' : '1rem' }}
                  >
                    {link.title}
                  </h3>
                  {link.desc && (
                    <p 
                      className="text-[#d0dcff]/80"
                      style={{ fontSize: cardSize.width < 150 ? '0.65rem' : '0.75rem' }}
                    >
                      {link.desc}
                    </p>
                  )}
                </div>
                <div className="light-sweep opacity-0 group-hover:opacity-100 hidden sm:block" />
              </div>
            )}

            {isClicked && (
              <>
                <div 
                  className="tarot-card card-clicked"
                  style={{
                    width: `${cardSize.width}px`,
                    height: `${cardSize.height}px`
                  }}
                />
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bubble"
                    style={{
                      left: `${50 + (Math.random() - 0.5) * 100}%`,
                      top: `${50 + (Math.random() - 0.5) * 30}%`,
                      width: `${8 + Math.random() * 12}px`,
                      height: `${8 + Math.random() * 12}px`,
                      animationDelay: `${Math.random() * 0.4}s`,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}