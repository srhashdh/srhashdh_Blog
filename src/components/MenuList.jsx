// MenuList.jsx
"use client"
import { motion } from "framer-motion";

const MenuList = ({ links, onClose }) => {
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

  return (
    <motion.div 
      className='fixed top-0 left-0 w-screen h-screen bg-cyan-300 text-white flex flex-col items-center justify-center gap-8 z-[9998] pr-16 bg-opacity-70'
      style={{ opacity: 0.1 }}
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
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
                onClose();
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 背景效果 */}
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/20"></div>
              
              {/* 文字 */}
              <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                {link.title}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MenuList;