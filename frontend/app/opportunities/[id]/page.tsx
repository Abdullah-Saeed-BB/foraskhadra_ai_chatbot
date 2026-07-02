"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "../../context/language-context";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { DocumentData } from "@/types/chat";

const CATEGORIES: Record<string, string> = {
  job: "وظيفة",
  internship: "تدريب عملي",
  freelance: "عمل حر",
  volunteering: "تطوع",
  training: "تدريب",
  scholarship: "منحة",
  competition: "مسابقة",
  hackathon: "هاكاثون",
  fellowship: "زمالة",
  event: "حدث",
};

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t, isRtl } = useLanguage();
  
  const [opp, setOpp] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/opportunities/${params.id}?lang=${language}`);
        if (res.ok) {
          const data = await res.json();
          setOpp(data);
        } else {
          setError(isRtl ? "لم يتم العثور على الفرصة" : "Opportunity not found");
        }
      } catch (err) {
        console.error(err);
        setError(isRtl ? "حدث خطأ أثناء تحميل البيانات" : "An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOpportunity();
    }
  }, [params.id, language, isRtl]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 flex justify-center items-center">
           <div className="text-foreground/60 py-2 text-sm flex items-center gap-1.5">
             <span className="w-3 h-3 rounded-full bg-primary animate-bounce"></span>
             <span className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
             <span className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
           </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center py-20 gap-4">
          <span className="text-6xl">⚠️</span>
          <h2 className="text-2xl font-bold text-foreground">{error}</h2>
          <button 
            onClick={() => router.push('/opportunities')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            {isRtl ? "العودة إلى الفرص" : "Back to Opportunities"}
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const tagsArray = opp.tags ? opp.tags.split(',').map(t => t.trim()) : [];
  const categoryLabel = isRtl && CATEGORIES[opp.category] ? CATEGORIES[opp.category] : opp.category;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 bg-radial from-transparent to-emerald-50/5 dark:to-emerald-950/5">
        
        {/* Back Button */}
        <div>
          <button 
            onClick={() => router.push('/opportunities')}
            className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isRtl ? "← العودة" : "← Back"}
          </button>
        </div>

        {/* Header Content */}
        <div className="bg-white dark:bg-card-bg border border-card-border rounded-3xl p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
          {/* Decorative Blob */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-3 flex-1">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3.5 py-1 text-xs font-semibold text-primary border border-emerald-100 dark:border-emerald-800/50 capitalize">
                {categoryLabel}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                {opp.title}
              </h1>
              <p className="text-lg text-primary font-semibold flex items-center gap-2">
                🏢 {opp.organization}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-card-border/60">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                {t.location}
              </span>
              <span className="text-sm font-medium text-foreground">
                📍 {opp.location || (isRtl ? "غير محدد" : "Not specified")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                {isRtl ? "تاريخ النشر" : "Published Date"}
              </span>
              <span className="text-sm font-medium text-foreground">
                📅 {formatDate(opp.published_at)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                {t.deadline}
              </span>
              <span className="text-sm font-medium text-destructive">
                ⌛ {opp.expires_at ? formatDate(opp.expires_at) : (isRtl ? "مفتوح" : "Open")}
              </span>
            </div>
          </div>

          {tagsArray.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tagsArray.map((tag, idx) => (
                <span key={idx} className="bg-foreground/5 text-foreground/80 text-xs px-2.5 py-1 rounded-md font-medium border border-card-border">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Sections */}
        <div className="flex flex-col gap-8">
          
          <section className="bg-white dark:bg-card-bg border border-card-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-4 border-b border-card-border pb-2 flex items-center gap-2">
              📝 {isRtl ? "الوصف" : "Description"}
            </h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {opp.description}
            </p>
          </section>

          {opp.requirements && (
            <section className="bg-white dark:bg-card-bg border border-card-border rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4 border-b border-card-border pb-2 flex items-center gap-2">
                📋 {isRtl ? "المتطلبات" : "Requirements"}
              </h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {opp.requirements}
              </p>
            </section>
          )}

          {opp.benefits && (
            <section className="bg-white dark:bg-card-bg border border-card-border rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4 border-b border-card-border pb-2 flex items-center gap-2">
                🎁 {isRtl ? "المزايا" : "Benefits"}
              </h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {opp.benefits}
              </p>
            </section>
          )}

        </div>

        {/* Action Call */}
        <div className="flex justify-center pt-6 pb-12">
          <a
            href={opp.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 px-12 rounded-full shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
          >
            {isRtl ? "قدّم الآن" : "Apply Now"}
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
}
