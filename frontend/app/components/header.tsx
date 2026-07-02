"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/language-context";

export const Header: React.FC = () => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [oppDropdownOpen, setOppDropdownOpen] = useState(false);

  const opportunitiesMenu = [
    { title: t.competitions, href: "/#opportunities?type=competitions" },
    { title: t.conferences, href: "/#opportunities?type=conferences" },
    { title: t.volunteering, href: "/#opportunities?type=volunteering" },
    { title: t.jobs, href: "/#opportunities?type=jobs" },
    { title: t.scholarships, href: "/#opportunities?type=scholarships" },
    { title: t.fellowships, href: "/#opportunities?type=fellowships" },
    { title: t.internships, href: "/#opportunities?type=internships" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/95 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Foras Khadra Logo"
                width={160}
                height={55}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-medium">
            <Link href="/" className="hover:text-primary transition-colors text-ring/5">
              {t.home}
            </Link>
            
            {/* Opportunities Dropdown */}
            <Link href="/opportunities" className="hover:text-primary transition-colors text-ring/5">
              {t.allOpportunities}
            </Link>
            
            {/* AI Chatbot Link in Nav */}
            <Link href="/chatbot" className="flex items-center gap-2 hover:text-primary transition-colors font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t.aiChatbot}
            </Link>
          </nav>

          {/* Action Buttons: Language Switcher Only */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex rounded-full border border-card-border p-1 bg-emerald-50/50">
              <button
                onClick={() => setLanguage("ar")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  language === "ar"
                    ? "bg-primary text-white shadow-sm"
                    : "text-foreground hover:text-primary"
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  language === "en"
                    ? "bg-primary text-white shadow-sm"
                    : "text-foreground hover:text-primary"
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggles */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Small screen Language Switcher */}
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="rounded-full border border-card-border p-2 bg-emerald-50/50 hover:bg-emerald-50 text-[13px] font-bold"
            >
              {language === "ar" ? "EN" : "عربي"}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-foreground hover:bg-emerald-50/50 transition-colors"
            >
              <span className="sr-only">Open Menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-card-border bg-background px-4 py-4 space-y-3 animate-in slide-in-from-top duration-250">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-4 py-2 hover:bg-emerald-50 text-[15px] font-medium"
          >
            {t.home}
          </Link>
          
          <div className="space-y-1">
            <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t.allOpportunities}
            </p>
            {opportunitiesMenu.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg pl-8 pr-4 py-1.5 text-sm hover:bg-emerald-50 text-foreground/80 hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <Link
            href="/chatbot"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-4 py-2 hover:bg-emerald-50 text-[15px] font-medium text-primary flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t.aiChatbot}
          </Link>
        </div>
      )}
    </header>
  );
};
