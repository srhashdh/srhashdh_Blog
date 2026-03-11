import PenWritingScene from "@/components/HandWritingText";
import DarkAcademiaParticles from "@/components/DarkAcademiaParticles";
import DarkAcademiaScene from "@/components/DarkAcademiaScene";

const learnPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-[#F8F2E8] font-serif bg-[#1A0E05]">
      {/* Three.js 場景 - z-0 最底層 */}
      <DarkAcademiaScene />

      
      
      {/* 暗角 - z-40 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_70%,rgba(0,0,0,0.6)_100%)] z-40 pointer-events-none"></div>

      {/* 文字層 - z-50 最上層 */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <PenWritingScene />
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.9; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
export default learnPage;
