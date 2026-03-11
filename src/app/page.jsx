"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import TarotCardLinks from "@/components/CardLinks";
import NeonCityBackground from "@/components/NeonCityBackground";
import ClickRipple from "@/components/ClickRipple";
import Image from "next/image";
import TerminalScene from "@/components/terminalScene";


const links = [
  { id: 1, url: "#about", title: "About", color: "bg-transparent" },
  { id: 2, url: "/learn", title: "Learning", color: "bg-transparent" },
  { id: 3, url: "/read", title: "Reading", color: "bg-transparent" },
  { id: 4, url: "/travel", title: "Traveling", color: "bg-transparent" },
  { id: 5, url: "/observe", title: "Observing", color: "bg-transparent"}
];

const Homepage = () => {
  const [showHomeEffects, setShowHomeEffects] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 立即檢查 hash 避免閃爍
    const hash = window.location.hash;
    if (hash === "#about") {
      setShowHomeEffects(false);
    }
    setMounted(true);

    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (!aboutSection) return;

      const scrollY = window.scrollY;
      const aboutTop = aboutSection.offsetTop;

      // 當滾動超過 About 區塊頂部 → 關閉首頁特效
      if (scrollY + 50 >= aboutTop) {
        setShowHomeEffects(false);
      } else {
        setShowHomeEffects(true);
      }
    };

    // 初始化時檢查滾動位置
    const checkInitialPosition = () => {
      const hash = window.location.hash;
      if (hash === "#about") {
        // 如果 URL 有 #about，等待元素載入後滾動過去
        setTimeout(() => {
          const aboutSection = document.getElementById("about");
          if (aboutSection) {
            window.scrollTo({ top: aboutSection.offsetTop, behavior: "smooth" });
            setShowHomeEffects(false);
          }
        }, 100);
      } else {
        // 否則檢查當前滾動位置
        handleScroll();
      }
    };

    checkInitialPosition();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);




  
  return (
    <div className="relative w-screen min-h-screen bg-[#050014] text-white overflow-x-hidden z-[0]">
      {/* === Three.js 粒子城市背景 === */}
      <div className="fixed inset-0 z-[0]">
        <NeonCityBackground />
      </div>

      {/* === 光暈層（僅首頁顯示） === */}
      
       {showHomeEffects && (
      <div
        className="fixed top-1/2 left-1/2 w-[60vw] h-[60vw]
        -translate-x-1/2 -translate-y-1/4
        bg-cyan-500 opacity-20 blur-[180px]
        rounded-full animate-pulse
        z-[1] pointer-events-none"
      />
    )}
    

      {/* === 導覽列 === */}
      <div className="h-24 z-1000 relative">
        <Navbar links={links} />
      </div>

      {/* === 主角色層 === */}
      {/*}
      {mounted && showHomeEffects && (<div className="relative w-full h-[calc(100vh-6rem)] flex items-center justify-center z-20">
        <Image
          src="/MainPageCharacter.png"
          alt="MainPageCharacter"
          width={1500}
          height={1500}
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[2000px] h-auto"
/>
    
      </div>
      )}
      *}
      {/* === About 區塊 === */}
      <section
      id="about"
      className="z-30 w-full min-h-screen items-center justify-center"
    >
      {mounted && !showHomeEffects && <TerminalScene />}
    </section>

      {/* === 卡片層（只在首頁顯示） === */}
      {mounted && showHomeEffects && (
        <TarotCardLinks
          links={links}
          className="fixed inset-0 z-[999] transition-opacity duration-700 ease-in-out 
                     w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8"
        />
      )}

      {/* === 點擊漣漪 === */}
      <ClickRipple />
    </div>
  );
};

export default Homepage;