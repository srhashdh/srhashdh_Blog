"use client";

import React, { useState, useEffect, useRef } from "react";

const TerminalScene = () => {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [isInteractive, setIsInteractive] = useState(false);
  const terminalRef = useRef(null);

  // 模擬的檔案系統
  const files = {
    "name.txt": "Stone",
    "birth.txt": "2001-04-15 please give me birthday gifts",
    "gender.txt": "secret",
    "hobby.txt": "coding, novel,",
    "occupation.txt": "firmware engineer / creative coder",
    "exit.txt": "exit",
  };

  // 開場動畫腳本
  const script = [
    { type: "typing", text: "ls" },
    { type: "output", text: Object.keys(files).join("   ") },
    { type: "typing", text: "cat name.txt" },
    { type: "output", text: files["name.txt"] },
    { type: "typing", text: "cat birth.txt" },
    { type: "output", text: files["birth.txt"] },
    { type: "typing", text: "cat hobby.txt" },
    { type: "output", text: files["hobby.txt"] },
    { type: "typing", text: "cat occupation.txt" },
    { type: "output", text: files["occupation.txt"] },
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
            newLines[newLines.length - 1].text = `user@pc:~$ ${currentText}`;
          } else {
            newLines.push({ text: `user@pc:~$ ${currentText}`, type: "typing" });
            
          }
          return newLines;
        });

        if (charIndex < current.text.length - 1) {
          charIndex++;
          setTimeout(typeStep, 200);
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

  // === 自動滾動到底部 ===
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines, input]);

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
      case "exit":
        return "Exiting terminal...";
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
        { text: `user@pc:~$ ${trimmed}`, type: "typing" },
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
      className="flex justify-center items-center min-h-screen bg-[#0d0d0d]"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="w-[700px] bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#2b2b2b] h-8 flex items-center px-3 space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="text-gray-400 text-sm ml-3">Ubuntu Terminal</div>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="font-mono text-sm p-4 min-h-[400px] max-h-[500px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-gray-100"
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
              user@pc:~$ {input}
              <span className="animate-pulse">▋</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalScene;
