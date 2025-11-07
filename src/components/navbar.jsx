"use client"
//import Link from "next/link";
//import Image from "next/image";
import { useState } from "react";
//import NavLink from "./navLink";
import { motion } from "framer-motion";
import  MenuList  from "./MenuList";
/*
const links = [
    { url: "/", title: "Home" },
    { url: "/about", title: "About" },
    { url: "/portfolio", title: "Portfolio" },
    { url: "/contact", title: "Contact" },
];
*/
/*
const links = [
    {title: "Home"},
    {title: "About"},  
    {title: "Portfolio"},
    {title: "Contact"},
]
    */
// 動畫變體

const Navbar = ({links}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className='h-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 text-lg'> 
            {/*
            <div className="hidden md:flex gap-4 w-1/3">
                {links.map((link) => (
                    <NavLink link={link} key={link.title}/>
                ))}
                
            </div>
            
            
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
            */}
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
                {open && (
                    <MenuList 
                        links={links} 
                        onClose={() => setOpen(false)} 
                    />
                )
                
                    
                    
                    
                }
            </div>
            
        </div>
    )
}

export default Navbar;