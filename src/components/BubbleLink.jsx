"use client"
import React, { useState } from 'react';

const BubbleLinks = ({links,  onBubblePop}) => {

  const [poppedBubbles, setPoppedBubbles] = useState(new Set());
  
  const handleBubbleClick = (link) => {
    // 添加破泡動畫效果
    setPoppedBubbles(prev => new Set([...prev, link.id]));
    
    if (onBubblePop) {
      onBubblePop({
        bubbleId: link.id,
        bubbleData: link,
        timestamp: Date.now()
      });
    }
    
    // 延遲跳轉，讓動畫完成
    setTimeout(() => {
      window.location.href = link.url;
      // 重置泡泡狀態（可選）
      setTimeout(() => {
        setPoppedBubbles(prev => {
          const newSet = new Set(prev);
          newSet.delete(link.id);
          return newSet;
        });
      }, 1000);
    }, 300);
  };

  const getBubbleStyle = (index) => {
    const positions = [
      { top: '20%', left: '15%' },
      { top: '35%', left: '70%' },
      { top: '15%', left: '50%' },
      { top: '60%', left: '25%' },
      { top: '45%', left: '80%' },
      { top: '70%', left: '60%' }
    ];
    
    return positions[index % positions.length];
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        {links.map((link, index) => {
          const isPopped = poppedBubbles.has(link.id);
          const position = getBubbleStyle(index);
          
          return (
            <div
              key={link.id}
              className={`absolute cursor-pointer transform transition-all duration-300 ${
                isPopped ? 'scale-150 opacity-0' : 'scale-100 opacity-100 hover:scale-110'
              }`}
              style={{
                top: position.top,
                left: position.left,
                transform: `translate(-50%, -50%) ${isPopped ? 'scale(1.5)' : 'scale(1)'}`,
              }}
              onClick={() => handleBubbleClick(link)}
            >
              {/* 泡泡主體 */}
              <div className={`
                relative w-24 h-24 rounded-full ${link.color} 
                shadow-lg hover:shadow-xl
                flex items-center justify-center
                transition-all duration-200
                ${isPopped ? 'animate-ping' : 'animate-bounce'}
              `}>
                {/* 泡泡光澤效果 */}
                <div className="absolute top-2 left-3 w-4 h-4 bg-white bg-opacity-40 rounded-full"></div>
                <div className="absolute top-4 right-3 w-2 h-2 bg-white bg-opacity-30 rounded-full"></div>
                
                {/* 文字 */}
                <span className="text-black text-xs font-semibold text-center px-2 leading-tight">
                  {link.title}
                </span>
                
                {/* 破裂效果 */}
                {isPopped && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                        style={{
                          transform: `rotate(${i * 45}deg) translateY(-20px)`,
                          animationDelay: `${i * 50}ms`,
                          animationDuration: '0.6s'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* 浮動動畫的小氣泡 */}
              <div className="absolute -top-2 -right-1 w-3 h-3 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-white bg-opacity-15 rounded-full animate-pulse delay-500"></div>
            </div>
          );
        })}
      </div>
      
      
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BubbleLinks;