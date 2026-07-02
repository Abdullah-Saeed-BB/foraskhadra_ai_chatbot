"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/language-context";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Message } from "@/types/chat";
import ChatMessage from "@/components/chatbot/ChatMessage";

export default function ChatbotPage() {
  const { language, t, isRtl } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "human",
      ar_text: text,
      en_text: text,
      language: "unknown",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      
      const bodyMessages = [...messages, userMsg].map((message:Message) => {
        return {
          "type": message.sender,
          "content": message.language === "ar" ? message.ar_text : message.en_text,
        }
      })

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/agent/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: bodyMessages }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        ar_text: data.ar_response,
        en_text: data.en_response,
        language: data.language,
        timestamp: new Date(),
        ragData: data.used_rag ? data.rag_data : undefined,
        suggestions: data.suggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error communicating with chatbot API:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        ar_text: "حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.",
        en_text: "An error occurred while connecting to the server. Please try again later.",
        language: isRtl ? "ar" : "en",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [inputValue]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-2 py-2 flex flex-col gap-6">
        
        {/* Chat Window */}
        <section className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Chat Window Header */}
          {/* <div className="p-4 border-b border-card-border bg-emerald-50/20 dark:bg-emerald-950/10 flex items-center justify-between">
            <Link
              href="/"
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
            >
              {isRtl ? "← العودة إلى الرئيسية" : "← Back to Homepage"}
            </Link>
            <button
              onClick={() => {
                if (confirm(isRtl ? "هل أنت متأكد من مسح المحادثة؟" : "Are you sure you want to clear the conversation?")) {
                  setMessages([]);
                }
              }}
              className="text-xs text-foreground/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              {isRtl ? "مسح السجل" : "Clear Chat"}
            </button>
          </div> */}

          {/* Messages list */}
          <div className="flex-1 min-h-100 max-h-[70vh] p-4 overflow-y-auto space-y-6 bg-radial from-transparent to-emerald-50/5 dark:to-emerald-950/5 relative">
            
            {messages.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center h-full max-h-[80%] my-auto">
                <div className="w-24 h-24 mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center p-3 shadow-inner">
                  <Image src="/images/bot_logo_t.png" alt={isRtl ? "خبير" : "Khabeer"} width={80} height={80} className="object-contain" />
                </div>
                <h2 className="font-extrabold text-3xl text-foreground mb-3">
                  {isRtl ? "خبير" : "Khabeer"}
                </h2>
                <p className="text-sm text-foreground/75 leading-relaxed max-w-md mx-auto">
                  {isRtl
                    ? "الذكاء الاصطناعي التوجيهي لمساعدتك في استكشاف الفرص وإرشادك نحو خيارات أفضل للوصول إلى منح دراسية، فرص تدريبية، ومسابقات بيئية."
                    : "Your guided AI to help you find opportunities and lead you to better choices for environmental scholarships, internships, and green competitions."}
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} isRtl={isRtl} setInputValue={setInputValue} />
            ))}

            {isTyping && (
              <div className="flex justify-start w-full" dir={isRtl ? "rtl" : "ltr"}>
                <div className="text-foreground/60 py-2 text-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/45 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/45 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/45 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input field area */}
          <div className="p-4 border-t border-card-border bg-emerald-50/5 dark:bg-card-bg/25 relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-3 max-w-4xl mx-auto"
            >
              <textarea
                ref={textareaRef}
                placeholder={isRtl ?
                  "ما هي أفضل الفرص التطوعية المتعلقة بالفضاء والبيئة للمهندسين في جدة؟" :
                  "What is the best volunteering opportunities related to space and enviroment for engineers and in Jeddah?"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-4 rounded-2xl border border-card-border bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all resize-none shadow-sm min-h-[85px] max-h-[150px] overflow-y-auto"
                rows={1}
                dir={isRtl ? "rtl" : "ltr"}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary hover:bg-primary-hover disabled:bg-foreground/20 disabled:cursor-not-allowed text-white p-4 rounded-xl shadow-md transition-all cursor-pointer h-[60px] flex items-center justify-center aspect-square shrink-0"
              >
                {isRtl ? "إرسال" : "Send"}
              </button>
            </form>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
