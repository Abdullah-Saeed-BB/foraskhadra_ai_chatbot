"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../context/language-context";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const { language, t, isRtl } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts
  const suggestionsAr = [
    "ما هي أحدث الفرص المتاحة الآن؟",
    "كيف أكتب رسالة دافع (Motivation Letter) ناجحة؟",
    "اقترح عليّ فرص تدريبية عن بعد في مجال البيئة.",
    "ما هي المهارات المطلوبة للوظائف الخضراء في 2026؟"
  ];

  const suggestionsEn = [
    "What are the latest opportunities available?",
    "How do I write a successful Motivation Letter?",
    "Suggest remote environmental internships.",
    "What skills are needed for green jobs in 2026?"
  ];

  const suggestions = isRtl ? suggestionsAr : suggestionsEn;

  // Initial welcome message
  useEffect(() => {
    const welcomeText = isRtl
      ? "أهلاً بك في الدردشة الذكية لمنصة فرص خضراء! 🌿 كيف يمكنني مساعدتك اليوم في استكشاف المنح والوظائف والتطوع البيئي؟"
      : "Welcome to Foras Khadra's AI Chatbot! 🌿 How can I help you today in exploring environmental grants, internships, and green jobs?";
    
    setMessages([
      {
        id: 1,
        sender: "bot",
        text: welcomeText,
        timestamp: new Date()
      }
    ]);
  }, [isRtl]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle bot reply logic
  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (isRtl) {
      if (input.includes("منحة") || input.includes("منح") || input.includes("زمالة") || input.includes("تمويل")) {
        return "لدينا عدة زمالات ممتازة حالياً:\n1. *زمالة Vital Signs for Climate 2026* للتربية الصحية والمناخية.\n2. *زمالة الصندوق العالمي للخير 2027* لرواد الأعمال الاجتماعيين والبيئيين (بتمويل 10,000$).\n\nيمكنك قراءة المزيد والتقديم مباشرة من قسم الفرص بالصفحة الرئيسية! 🎓";
      }
      if (input.includes("تدريب") || input.includes("متدرب") || input.includes("تطوع")) {
        return "فرص التدريب والتطوع المتاحة:\n1. *متدرب في مبادرة Mangrove Breakthrough* (عن بعد - منظمة Ambition Loop).\n2. *برنامج الابتكارات الشاملة للذكاء الاصطناعي في إفريقيا* (مسار HAID).\n3. *المجموعة الوطنية للعمل المناخي (NCAG) في العراق* (بالتعاون مع يونيسف).\n\nهذه فرص رائعة لبناء سيرة ذاتية خضراء! 🌍";
      }
      if (input.includes("دافع") || input.includes("خطاب") || input.includes("كتابة") || input.includes("سيرة")) {
        return "لكتابة خطاب دافع (Motivation Letter) قوي:\n- ابدأ بشرح المشكلة البيئية في مجتمعك المحلي.\n- وضّح كيف تتقاطع خلفيتك الأكاديمية أو المهنية مع هذه المشكلة.\n- اشرح لماذا هذا البرنامج بالتحديد هو الخطوة التالية لك.\n- ركّز على الأرقام والتأثير القابل للقياس (مثال: 'شاركت في إعادة تدوير 500 كجم من البلاستيك' بدلاً من 'أهتم بالتدوير'). 📝";
      }
      if (input.includes("مهارات") || input.includes("2026") || input.includes("وظائف") || input.includes("اقتصاد أخضر")) {
        return "أبرز المهارات المطلوبة في الاقتصاد الأخضر لعام 2026:\n- تحليل البصمة الكربونية وتقييم الأثر البيئي (EIA).\n- استخدام نظم المعلومات الجغرافية (GIS) لرسم الخرائط البيئية.\n- فهم معايير الاستدامة البيئية والحوكمة (ESG).\n- مهارات التواصل المناخي وتبسيط المفاهيم العلمية للجمهور. 🌱";
      }
      return "سؤال رائع! تركز منصة فرص خضراء على ربطك بالفرص البيئية المناسبة. يمكنك استكشاف أقسام 'المنح'، 'الوظائف'، و'المسابقات' على صفحتنا الرئيسية، أو تصفح المقالات للحصول على نصائح صياغة التقديم. هل ترغب في معرفة تفاصيل أي من هذه المواضيع؟";
    } else {
      if (input.includes("scholarship") || input.includes("fellowship") || input.includes("grant") || input.includes("fund")) {
        return "We have outstanding fellowships available now:\n1. *Vital Signs for Climate Fellowship 2026* focusing on climate education.\n2. *Global Good Fund Fellowship 2027* for green social entrepreneurs (includes a $10,000 grant).\n\nYou can read details and apply via the main landing page! 🎓";
      }
      if (input.includes("intern") || input.includes("internship") || input.includes("volunteer")) {
        return "Current internships and volunteer roles include:\n1. *Mangrove Breakthrough Intern* (Remote - Ambition Loop).\n2. *Inclusive AI Innovations in Africa* (HAID Hub).\n3. *National Climate Action Group in Iraq* (UNICEF partner).\n\nThese are perfect paths to build a solid green portfolio! 🌍";
      }
      if (input.includes("motivation") || input.includes("letter") || input.includes("write") || input.includes("cover")) {
        return "Tips to structure a powerful Motivation Letter:\n- Start by highlighting a local environmental concern you target.\n- Connect your academic or volunteer path with the opportunity requirements.\n- Explain why this specific host institution fits your long-term goals.\n- Emphasize measurable impact (e.g., 'coordinated a local planting event of 200 trees' rather than 'I like plants'). 📝";
      }
      if (input.includes("skill") || input.includes("2026") || input.includes("job") || input.includes("green economy")) {
        return "Top green skills in demand for 2026:\n- Carbon footprinting and Environmental Impact Assessment (EIA).\n- Geographic Information Systems (GIS) for environment mapping.\n- Understanding of Environmental, Social, and Governance (ESG) standards.\n- Climate communication and simplified scientific storytelling. 🌱";
      }
      return "That's a great question! Foras Khadra aims to connect you with suitable environmental pathways. Explore the 'Scholarships', 'Jobs', or 'Competitions' sections on our Home page, or read our latest articles for portfolio advice. What topic would you like to discuss next?";
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const responseText = getBotResponse(text);
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: responseText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Info */}
        <section className="md:w-1/3 flex flex-col gap-6">
          <div className="border border-card-border bg-white dark:bg-card-bg/50 p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <h2 className="font-extrabold text-lg text-foreground">
                  {isRtl ? "المستشار المناخي الذكي" : "Smart Climate Advisor"}
                </h2>
                <span className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isRtl ? "متصل بالخدمة" : "Online & ready"}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-foreground/75 leading-relaxed">
              {isRtl
                ? "دردش مع الذكاء الاصطناعي التوجيهي للبحث عن منح دراسية، فرص تدريبية، مسابقات بيئية، وتطوير سيرتك الذاتية المناخية."
                : "Chat with our guided AI tool to search for environmental scholarships, internships, green competitions, and build your climate resume."}
            </p>

            <div className="border-t border-card-border pt-4">
              <Link
                href="/"
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
              >
                {isRtl ? "← العودة إلى الرئيسية" : "← Back to Homepage"}
              </Link>
            </div>
          </div>

          {/* Quick suggestions panel */}
          <div className="border border-card-border bg-emerald-50/20 dark:bg-emerald-950/10 p-6 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {isRtl ? "أسئلة مقترحة" : "Suggested Prompts"}
            </h3>
            <div className="flex flex-col gap-2">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="w-full text-right text-xs bg-white dark:bg-card-bg border border-card-border hover:border-primary/50 hover:bg-emerald-50/50 p-3 rounded-xl transition-all cursor-pointer text-foreground font-medium"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Chat Window */}
        <section className="flex-1 border border-card-border bg-white dark:bg-card-bg/40 rounded-2xl shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          {/* Chat Window Header */}
          <div className="p-4 border-b border-card-border bg-emerald-50/20 dark:bg-emerald-950/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary/10 rounded-full text-primary">🌿</span>
              <span className="text-sm font-bold text-foreground">
                Foras Khadra Assistant
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm(isRtl ? "هل أنت متأكد من مسح المحادثة؟" : "Are you sure you want to clear the conversation?")) {
                  setMessages([
                    {
                      id: 1,
                      sender: "bot",
                      text: isRtl
                        ? "أهلاً بك في الدردشة الذكية لمنصة فرص خضراء! 🌿 كيف يمكنني مساعدتك اليوم؟"
                        : "Welcome to Foras Khadra's AI Chatbot! 🌿 How can I help you today?",
                      timestamp: new Date()
                    }
                  ]);
                }
              }}
              className="text-xs text-foreground/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              {isRtl ? "مسح السجل" : "Clear Chat"}
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-radial from-transparent to-emerald-50/5 dark:to-emerald-950/5">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap leading-relaxed ${
                      isBot
                        ? "bg-emerald-50/50 dark:bg-emerald-950/30 text-foreground border border-card-border rounded-tl-none"
                        : "bg-primary text-white rounded-tr-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-emerald-50/50 dark:bg-emerald-950/30 text-foreground/60 border border-card-border rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/45 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/45 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/45 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input field area */}
          <div className="p-4 border-t border-card-border bg-emerald-50/5 dark:bg-card-bg/25">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={isRtl ? "اكتب سؤالك هنا..." : "Type your question..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-primary hover:bg-primary-hover disabled:bg-foreground/20 disabled:cursor-not-allowed text-white p-3 rounded-xl shadow-md transition-all cursor-pointer"
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
