"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";


const TerminalScene = () => {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [isInteractive, setIsInteractive] = useState(false);
  const terminalRef = useRef(null);
  
  const router = useRouter()
  // 模擬的檔案系統
  const files = {
    "name.txt": "srhashdh",
    "birth.txt": "04-15 Please Give Me Birthday Gifts",
    "gender.txt": "Hideyoshi!",
    "hobby.txt": "Coding, Fortune-telling, Traveling, Wristwatch",
    "Dislike.txt": "Patronizing",
    "occupation.txt": "Feild Application Engineer",
    "self-evaluation": "Lazy people who follow trends",
    "exit.txt": "Please Press the Left Red Button To Exit"
  };

// 開場動畫腳本
const script = [
    { type: "typing", text: "ls" },
    { type: "output", text: Object.keys(files).join("   ") },
    { type: "typing", text: "cat name.txt" },
    { type: "output", text: files["name.txt"] },
    { type: "typing", text: "cat gender.txt"},
    { type: "output", text: files["gender.txt"]},
    { type: "typing", text: "cat birth.txt" },
    { type: "output", text: files["birth.txt"] },
    { type: "typing", text: "cat hobby.txt" },
    { type: "output", text: files["hobby.txt"] },
    { type: "typing", text: "cat Dislike.txt" },
    { type: "output", text: files["Dislike.txt"] },
    { type: "typing", text: "cat occupation.txt" },
    { type: "output", text: files["occupation.txt"] },
    { type: "typing", text: "cat self-evaluation" },
    { type: "output", text: files["self-evaluation"] },
    { type: "typing", text: "cat exit.txt" },
    { type: "output", text: files["exit.txt"] },
  ];

  // === 開場動畫 ===
  useEffect(() => {
    let scriptIndex = 0;
    let charIndex = 0;

    const typeStep = () => {
      if (scriptIndex >= script.length) {
        setIsInteractive(true);
        return;
      }

      const current = script[scriptIndex];
      
      if (current.type === "typing") {
        const currentText = current.text.slice(0, charIndex + 1);
        setLines((prev) => {
          const newLines = [...prev];
          if (newLines.length && newLines[newLines.length - 1].type === "typing") {
            newLines[newLines.length - 1].text = `user@intro:~$ ${currentText}`;
          } else {
            newLines.push({ text: `user@intro:~$ ${currentText}`, type: "typing" });
            
          }
          return newLines;
        });

        if (charIndex < current.text.length - 1) {
          charIndex++;
          setTimeout(typeStep, 300);
        } else {
          charIndex = 0;
          scriptIndex++;
          setTimeout(typeStep, 200); // typing 完成後短暫停頓
        }
      } else if (current.type === "output") {
  setLines((prev) => {
    // 避免 output 重複
    const lastLine = prev[prev.length - 1];
    if (lastLine && lastLine.type === "output" && lastLine.text === current.text) {
      return prev; // 已經有這行 output，跳過
    }
    return [...prev, { text: current.text, type: "output" }];
  });
  scriptIndex++;
  setTimeout(typeStep, 150);
}

    };

    typeStep();
  }, []);
  const containerRef = useRef(null);

useEffect(() => {
    if (isInteractive && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isInteractive]);

  // 點擊終端任何地方都能聚焦
  const handleClick = () => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };
  // === 自動滾動到底部 ===
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines, input]);
  const handleBack = () => {
    
    router.push("/")
  }
  // === 命令處理 ===
  const handleCommand = (cmd) => {
    const [command, ...args] = cmd.split(" ");
    switch (command) {
      case "ls":
        return Object.keys(files).join("   ");
      case "cat":
        if (!args[0]) return "cat: missing file operand";
        return files[args[0]] || `cat: ${args[0]}: No such file`;
      case "clear":
        setLines([]);
        return null;
      case "cd":
        return "Permission denied. You're already home.";
      case "exit":{
        handleBack();
        return "Exiting terminal...";
        
      }
      default:
        return `${command}: command not found`;
    }
  };

  // === 鍵盤事件 ===
  const handleKeyDown = (e) => {
    if (!isInteractive) return;

    if (e.key === "Enter") {
      const trimmed = input.trim();
      if (!trimmed) return;

      const output = handleCommand(trimmed);
      setLines((prev) => [
        ...prev,
        { text: `user@intro:~$ ${trimmed}`, type: "typing" },
        ...(output ? [{ text: output, type: "output" }] : []),
      ]);
      setInput("");
    } else if (e.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setInput((prev) => prev + e.key);
    }
  };
  
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-[#0d0d0d] z-[999] "
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      style={{ outline: 'none' }} 
    >
      <div className="w-[700px] bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-[#2b2b2b] h-8 flex items-center px-3 space-x-2">
          <button 
            className="relative w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-600" 
            onClick={(e) => {
                e.stopPropagation();  // 🔑 阻止事件被外層攔截
                e.preventDefault();    // 🔑 防止預設行為
                console.log('紅色按鈕被點擊!'); // 測試用
                handleBack();
            }}
            ></button>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="text-gray-400 text-sm ml-3">Terminal</div>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          onWheel={(e) => {e.stopPropagation(); e.preventDefault();}}
          className="relative font-mono text-sm p-4 min-h-[400px] max-h-[500px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-gray-100 cursor-pointer"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={line.type === "output" ? "text-green-400" : "text-gray-100"}
            >
              {line.text}
            </div>
          ))}

          {/* 互動輸入 */}
          {isInteractive && (
            <div className="text-gray-100">
              user@intro:~$ {input}
              <span className="animate-pulse">▋</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalScene;