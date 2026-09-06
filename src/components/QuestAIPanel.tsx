import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, Trash2, ArrowRight, Mic } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

interface Message {
  role: "user" | "model";
  content: string;
}

interface QuestAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  userLevel: number;
}

export const QuestAIPanel: React.FC<QuestAIPanelProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  userLevel,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hello! I am **Quest AI**, your personal Java and programming tutor. I'm here to guide you with hints, explanations, and analogies. What are you working on today?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onSpeechResult: (text, isFinal) => {
      setInput(text);
      if (isFinal && text.trim()) {
        // Voice query captured
      }
    },
  });

  const quickChips = [
    "Explain in simple words",
    "Give me a hint",
    "Why is my code wrong?",
    "Show me a small example",
    "What is the difference between String and char?",
  ];

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: query };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/quest-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          conversationHistory: updatedHistory,
          userLevel,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content:
              "I'm thinking through your code! Remember: in Java, check semicolons, matching brackets, and variable types. Would you like to check a specific line?",
          },
        ]);
      }
    } catch (err) {
      console.error("AI fetch error", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "I'm here! In Java, breaking down logic into small steps is the best path forward. What concept can I clarify for you?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              Quest AI Tutor
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Socratic learning guide • Level {userLevel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setMessages([
                {
                  role: "model",
                  content: "Chat cleared! What shall we explore next?",
                },
              ])
            }
            title="Clear Chat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs leading-relaxed">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-indigo-600 text-white shadow-sm"
              }`}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[82%] whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-orange-500 text-white rounded-tr-none font-medium"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/60"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
              <span>Quest AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 flex items-center gap-1"
          >
            <span>{chip}</span>
            <ArrowRight className="w-2.5 h-2.5 opacity-60" />
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isListening ? "Listening to your voice..." : "Ask Quest AI anything..."}
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 rounded-xl text-xs border border-transparent focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => (isListening ? stopListening() : startListening())}
          className={`p-2 rounded-xl transition-all ${
            isListening
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/40 animate-pulse"
              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          }`}
          title={isListening ? "Stop listening" : "Speak to Quest AI"}
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
