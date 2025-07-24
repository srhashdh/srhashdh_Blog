"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
const NavLink = ({ link }) => {
    const pathName = usePathname(); 
    return pathName === link.url ? (
        <motion.div 
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r bg-amber-200 text-white rounded-full shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
        <span className="font-semibold tracking-wide">{link.title}</span>
    </motion.div>
    ) : null;
};

export default NavLink;