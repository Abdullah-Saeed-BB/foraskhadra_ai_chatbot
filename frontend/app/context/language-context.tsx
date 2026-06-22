"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface TranslationType {
  // Navigation
  home: string;
  articles: string;
  news: string;
  allOpportunities: string;
  competitions: string;
  conferences: string;
  volunteering: string;
  jobs: string;
  scholarships: string;
  fellowships: string;
  internships: string;
  organizationsMap: string;
  aboutUs: string;
  contact: string;
  aiChatbot: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroExplore: string;
  heroChatbot: string;
  
  // Opportunities Section
  oppTitle: string;
  viewAll: string;
  readMore: string;
  close: string;
  opportunityType: string;
  deadline: string;
  location: string;
  
  // Articles Section
  artTitle: string;
  
  // Organizations Section
  orgTitle: string;
  orgSubtitle: string;
  
  // Footer Sections
  footerBrowseOpp: string;
  footerBrowseJobs: string;
  footerExtraLinks: string;
  footerPolicies: string;
  privacyPolicy: string;
  usagePolicy: string;
  termsAndConditions: string;
  rightsReserved: string;
}

const translations: Record<Language, TranslationType> = {
  ar: {
    home: "الرئيسية",
    articles: "المقالات",
    news: "نشاطاتنا",
    allOpportunities: "كل الفرص",
    competitions: "المسابقات",
    conferences: "المؤتمرات",
    volunteering: "فرص التطوع",
    jobs: "الوظائف",
    scholarships: "المنح",
    fellowships: "الزمالات",
    internships: "فرص التدريب",
    organizationsMap: "شبكة المنظمات",
    aboutUs: "من نحن",
    contact: "تواصل معنا",
    aiChatbot: "الدردشة الذكية AI",
    
    heroTitle: "منصة فرص خضراء",
    heroSubtitle: "من وإلى شباب الوطن العربي",
    heroDescription: "منصة عربية تربط شباب الوطن العربي بالفرص والمنح البيئية والمناخية محلياً وعالمياً، بلغة واضحة ومحتوى موثوق، وتركز على الوصول العادل وبناء القدرات. تهدف المنصة لكسر الحواجز اللغوية والتوجيهية وتحويل الفرص إلى مسارات فعلية قابلة للتقديم.",
    heroExplore: "تصفح الفرص",
    heroChatbot: "الدردشة الذكية",
    
    oppTitle: "أحدث الفرص البيئية والمناخية",
    viewAll: "عرض الكل",
    readMore: "اقرأ المزيد",
    close: "إغلاق",
    opportunityType: "نوع الفرصة",
    deadline: "الموعد النهائي",
    location: "الموقع",
    
    artTitle: "أحدث المقالات والدورات",
    
    orgTitle: "شبكة المنظمات الشريكة",
    orgSubtitle: "انقر على البطاقة لاستكشاف ملف المنظمة والمساهمات البيئية.",
    
    footerBrowseOpp: "تصفح الفرص",
    footerBrowseJobs: "تصفح الوظائف والمنح",
    footerExtraLinks: "روابط إضافية",
    footerPolicies: "سياساتنا",
    privacyPolicy: "سياسة الخصوصية",
    usagePolicy: "سياسة الاستخدام",
    termsAndConditions: "الشروط والأحكام",
    rightsReserved: "جميع الحقوق محفوظة © 2026 منصة فرص خضراء."
  },
  en: {
    home: "Home",
    articles: "Articles",
    news: "Our Activities",
    allOpportunities: "All Opportunities",
    competitions: "Competitions",
    conferences: "Conferences",
    volunteering: "Volunteering",
    jobs: "Jobs",
    scholarships: "Scholarships",
    fellowships: "Fellowships",
    internships: "Internships",
    organizationsMap: "Organizations Network",
    aboutUs: "About Us",
    contact: "Contact Us",
    aiChatbot: "AI Chatbot",
    
    heroTitle: "Foras Khadra Platform",
    heroSubtitle: "From and to the youth of the Arab World",
    heroDescription: "An Arabic platform connecting Arab youth to environmental and climate opportunities and scholarships locally and globally, with clear language and reliable content, focusing on equitable access and capacity building. The platform aims to break linguistic and guidance barriers, turning opportunities into actual, actionable application pathways.",
    heroExplore: "Explore Opportunities",
    heroChatbot: "Ask AI Chatbot",
    
    oppTitle: "Latest Climate & Green Opportunities",
    viewAll: "View All",
    readMore: "Read More",
    close: "Close",
    opportunityType: "Opportunity Type",
    deadline: "Deadline",
    location: "Location",
    
    artTitle: "Latest Articles & Guides",
    
    orgTitle: "Partner Organizations Network",
    orgSubtitle: "Click on any card to explore the organization's profile and environmental contributions.",
    
    footerBrowseOpp: "Browse Opportunities",
    footerBrowseJobs: "Browse Jobs & Scholarships",
    footerExtraLinks: "Extra Links",
    footerPolicies: "Our Policies",
    privacyPolicy: "Privacy Policy",
    usagePolicy: "Usage Policy",
    termsAndConditions: "Terms and Conditions",
    rightsReserved: "All rights reserved © 2026 Foras Khadra Platform."
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationType;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    // Look up saved language preference if any
    const saved = localStorage.getItem("foras_khadra_lang") as Language;
    if (saved === "ar" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("foras_khadra_lang", lang);
  };

  const isRtl = language === "ar";
  const t = translations[language];

  useEffect(() => {
    // Set HTML dir and lang attributes
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
