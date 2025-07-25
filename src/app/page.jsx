import Image from "next/image";
import Navbar from "@/components/navbar";
const links = [
    { url: "/", title: "Home" },
    { url: "/about", title: "About" },
    { url: "/portfolio", title: "Portfolio" },
    { url: "/contact", title: "Contact" },
];

const Homepage = () => {
  return (
    <div className="w-screen min-h-screen bg-[linear-gradient(to_bottom,theme(colors.amber.100)_0%,theme(colors.amber.50)_70%,theme(colors.cyan.100)_100%)]">
      <div className="h-24">
            <Navbar links = {links}/>
      </div>
      <div className="min-h-[calc(100vh)-6rem]">
        <div className="h-screen flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
              
              {/*IMAGE CONTAINER*/}
              <div className=" lg:h-full lg:w-1/2 relative">
                <Image src="/hero.png" alt="" fill className="object-contain"/>
              </div>
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
