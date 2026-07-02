"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../context/language-context";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import OpportunityCard from "@/components/chatbot/OpportunityCard";
import { DocumentData } from "@/types/chat";

export default function OpportunitiesPage() {
  const { language, t, isRtl } = useLanguage();
  
  const [opportunities, setOpportunities] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [category, setCategory] = useState<string>("all");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const categoriesList = [
    { id: "all", label: t.allOpportunities },
    { id: "competition", label: t.competitions },
    { id: "event", label: t.conferences }, // mapped closely to what backend expects
    { id: "volunteering", label: t.volunteering },
    { id: "job", label: t.jobs },
    { id: "scholarship", label: t.scholarships },
    { id: "fellowship", label: t.fellowships },
    { id: "internship", label: t.internships },
    { id: "freelance", label: "Freelance/عمل حر" },
    { id: "training", label: "Training/تدريب" },
    { id: "hackathon", label: "Hackathon/هاكاثون" },
  ];

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const params = new URLSearchParams();
      params.append("lang", language);
      params.append("limit", "100"); // fetch up to 100
      
      if (category && category !== "all") {
        params.append("category", category);
      }
      if (country.trim()) {
        params.append("country", country.trim());
      }
      if (city.trim()) {
        params.append("city", city.trim());
      }

      const res = await fetch(`${apiUrl}/opportunities/?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.items);
      } else {
        console.error("Failed to fetch opportunities");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [language, category, country, city]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOpportunities();
    }, 500); // 500ms debounce for typing

    return () => clearTimeout(delayDebounceFn);
  }, [fetchOpportunities]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 bg-radial from-transparent to-emerald-50/5 dark:to-emerald-950/5">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {t.oppTitle}
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {isRtl 
              ? "استكشف أحدث الفرص والمنح في مجالات البيئة والمناخ وقم بتصفيتها حسب اهتماماتك وموقعك." 
              : "Explore the latest opportunities and grants in environment and climate, and filter them by your interests and location."}
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground/80">
                {isRtl ? "التصنيف" : "Category"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-card-border bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                dir={isRtl ? "rtl" : "ltr"}
              >
                {categoriesList.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground/80">
                {isRtl ? "الدولة" : "Country"}
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={isRtl ? "مثال: السعودية" : "e.g. Saudi Arabia"}
                className="px-4 py-3 rounded-xl border border-card-border bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                dir={isRtl ? "rtl" : "ltr"}
              />
            </div>

            {/* City Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground/80">
                {isRtl ? "المدينة" : "City"}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={isRtl ? "مثال: الرياض" : "e.g. Riyadh"}
                className="px-4 py-3 rounded-xl border border-card-border bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                dir={isRtl ? "rtl" : "ltr"}
              />
            </div>

          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1">
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="text-foreground/60 py-2 text-sm flex items-center gap-1.5">
                 <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"></span>
                 <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                 <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
               </div>
             </div>
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map(opp => (
                <div key={opp.id} className="relative group">
                  {/* Reuse OpportunityCard but we might want to wrap it to redirect to details page */}
                  <a href={`/opportunities/${opp.id}`} className="block h-full">
                    <div className="pointer-events-none h-full">
                      <OpportunityCard doc={opp} isRtl={isRtl} />
                    </div>
                  </a>
                  {/* We make a separate link overlay so the card styling works but clicking goes to details page */}
                  <a href={`/opportunities/${opp.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${opp.title}`}></a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-card-bg border border-dashed border-card-border rounded-2xl">
              <span className="text-5xl mb-4 block">🔍</span>
              <p className="text-foreground/70 font-medium text-lg">
                {isRtl ? "لم يتم العثور على فرص تطابق معايير البحث." : "No opportunities found matching your criteria."}
              </p>
              <button 
                onClick={() => {
                  setCategory("all");
                  setCountry("");
                  setCity("");
                }}
                className="mt-4 text-primary hover:text-primary-hover font-semibold underline underline-offset-4 cursor-pointer"
              >
                {isRtl ? "إعادة ضبط الفلاتر" : "Reset Filters"}
              </button>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
