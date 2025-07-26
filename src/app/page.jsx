"use client"
import Image from "next/image";
import Navbar from "@/components/navbar";
import BubbleLinks from "@/components/BubbleLink";
const links = [
    { id: 1, url: "/", title: "Home", color: "bg-transparent" },
    { id: 2, url: "/about", title: "About", color: "bg-transparent" },
    { id: 3, url: "/portfolio", title: "Portfolio", color: "bg-transparent" },
    { id: 4, url: "/contact", title: "Contact", color: "bg-transparent" },
];
const handleBubblePop = (popData) => {
  console.log('bubble popped', popData);
  // popData 包含：
  // - bubbleId: 泡泡的 ID
  // - bubbleData: 完整的 link 資料
  // - timestamp: 點擊時間戳
  
  // 你可以在這裡觸發其他組件的動作
  // 例如：播放音效、改變 3D 模型、更新其他 UI 等
};

const Homepage = () => {
  return (
    <div className="w-screen min-h-screen bg-[linear-gradient(to_bottom,theme(colors.amber.800)_0%,theme(colors.amber.50)_70%,theme(colors.cyan.100)_100%)]">
      <div className="h-24">
            <Navbar links = {links}/>
      </div>
      <div className="min-h-[calc(100vh)-6rem]">
        <div className="h-screen flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
             <BubbleLinks 
                links={links}
                onBubblePop={handleBubblePop}
            /> 
                {/* TEXT CONTAINER */}
              <div className="h-1/2 lg:h-full lg:w-1/2 flex flex-col gap-8 items-center justify-center">
                {/* TITLE */}
                <h1 className="text-4xl md:text-6xl font-bold">Crafting Digital Experiences, Designing Tomorrow.</h1>
                {/* DESC */}
                <p className="md:text-xl">
                  Wellcome to my digital canvas, where innovation and creativity converge. With a keen eye for aesthetics and a mastery of code, my portfolio showcases a diverse collection of projects that reflect my commitment to excellence.  
                </p>
                {/* BUTTONS 
                <div className="w-full flex gap-4">
                  <button className="p-4 rounded-lg ring-1 ring-black bg-black text-white">View My Work</button>
                  <button className="p-4 rounded-lg ring-1 ring-black">Contact Me</button>
                </div>
                */}

              </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
