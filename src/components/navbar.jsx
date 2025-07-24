"use client"
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import NavLink from "./navLink";
import { motion } from "framer-motion";

const links = [
    { url: "/", title: "Home" },
    { url: "/about", title: "About" },
    { url: "/portfolio", title: "Portfolio" },
    { url: "/contact", title: "Contact" },
];
/*
const links = [
    {title: "Home"},
    {title: "About"},  
    {title: "Portfolio"},
    {title: "Contact"},
]
    */
// 動畫變體
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 依序出現效果
        delayChildren: 0.2
      }
    }
  };

  const linkVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
const Navbar = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className='h-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 text-lg'> 
            <div className="hidden md:flex gap-4 w-1/3">
                {links.map((link) => (
                    <NavLink link={link} key={link.title}/>
                ))}
            </div>
            {/*social*/}
            <div className="hidden md:flex gap-4 w-1/3">
                <Link href="/">
                    <Image src="/github.png" alt="" width={24} height={24}/>
                </Link>
                <Link href="/">
                    <Image src="/instagram.png" alt="" width={24} height={24}/>
                </Link>
                <Link href="/">
                    <Image src="/facebook.png" alt="" width={24} height={24}/>
                </Link>
                <Link href="#">
                    <Image src="/linkedin.png" alt="" width={24} height={24}/>
                </Link>
            </div>
            
            <div className="fixed right-10 z-[10000]">
                { /* Menu button*/}
                <button 
                    className="w-10 h-8 flex flex-col justify-between z-[9999] relative " 
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {/* 第一條線 */}
                    <motion.div 
                        className="w-10 h-1 bg-cyan-600 rounded origin-center"
                        initial={{ y: 0, rotate: 0 }}
                        animate={open ? {
                            y: [0, 14, 14],        // 向下移動14px到第二條線位置
                            rotate: [0, 0, 45],    // 然後旋轉45度
                        } : {
                            y: [14, 14, 0],        // 先移回中間，再回到原位
                            rotate: [45, 0, 0],    // 先取消旋轉
                        }}
                        transition={{ 
                            duration: 0.6,
                            times: [0, 0.5, 1],
                            ease: "easeInOut"
                        }}
                    />
    
                    {/* 第二條線 - 本來就在中間，只控制透明度 */}
                    <motion.div 
                        className="w-10 h-1 z-10 bg-cyan-600 rounded relative"
                        initial={{ opacity: 1 }}
                        animate={open ? {
                            // 開啟：階段1保持可見，階段2消失
                            opacity: [1, 1, 0], 
                        } : {
                            // 關閉：階段1重新出現，階段2保持可見
                            opacity: [0, 1, 1], 
                        }}
                        transition={{ 
                            duration: 0.6,
                            times: [0, 0.5, 1],  // 在階段2才開始變化
                            ease: "easeInOut"
                        }}
                    />
    
                    {/* 第三條線 */}
                    <motion.div 
                        className="w-10 h-1 bg-cyan-600 rounded origin-center"
                        initial={{ y: 0, rotate: 0 }}
                        animate={open ? {
                            y: [0, -14, -14],      // 向上移動14px到第二條線位置
                            rotate: [0, 0, -45],   // 然後旋轉-45度
                        } : {
                            y: [-14, -14, 0],      // 先移回中間，再回到原位
                            rotate: [-45, 0, 0],   // 先取消旋轉
                        }}
                        transition={{ 
                            duration: 0.6,
                            times: [0, 0.5, 1],
                            ease: "easeInOut"
                        }}
                    />
                </button>
                {/*menu list*/}
                {open &&
                    (<motion.div 
                        className='fixed top-0 left-0 w-screen h-screen bg-cyan-300 text-white flex flex-col items-center justify-center gap-8 z-[9998] pr-16 bg-opacity-70'
                        style={{ opacity: 0.1 }}
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        
                        onClick={() => setOpen(false)}
                    >
                    {/* 菜單容器 - 從右邊滑入 */}
                    
                    <motion.div
                        className="fixed top-0 right-0 w-80 h-full bg-cyan-400/20 backdrop-blur-lg border-l border-white/10 z-[100001]"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30,
                            duration: 0.4 
                        }}
                        
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col items-center gap-6"
                            >
                                {links.map((link) => (
                                    <motion.a
                                        href={link.url}
                                        key={link.title}
                                        variants={linkVariants}
                                        className="group relative px-8 py-4 top-20 text-3xl md:text-4xl font-light tracking-wide cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpen(false);
                                        }}
                                        whileHover={{ 
                                            scale: 1.05,
                                            transition: { type: "spring", stiffness: 400, damping: 10 }
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                    {/* 背景效果 */}
                                    <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/20" ></div>
                                    
                                
                                    {/* 文字 */}
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                                    {link.title}
                                    </span>
                                    
                                    
                                </motion.a>
                                ))}
                            </motion.div>
                        </motion.div>

                    </motion.div>)
                }
            </div>
            
        </div>
    )
}

export default Navbar;