"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./context/language-context";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

interface Opportunity {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  type: string; // competitions, conferences, volunteering, jobs, scholarships, fellowships, internships
  locationAr: string;
  locationEn: string;
  date: string;
  bodyAr: string;
  bodyEn: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: 1,
    titleAr: "برنامج Sister-to-Sister للقيادة النسوية الشابة 2026",
    titleEn: "Sister-to-Sister Young Feminist Leadership Program 2026",
    descAr: "برنامج افتراضي مكثف تنظمه مبادرة نوبل للنساء بهدف دعم القيادات النسوية الشابة في مجالات الدفاع عن البيئة والعدالة الاجتماعية.",
    descEn: "An intensive virtual program organized by the Nobel Women's Initiative aimed at supporting young feminist leaders in environmental and social justice advocacy.",
    type: "fellowships",
    locationAr: "افتراضي (عن بعد)",
    locationEn: "Virtual (Remote)",
    date: "2026-08-30",
    bodyAr: "برنامج Sister-to-Sister للقيادة النسوية الشابة لعام 2026 هو برنامج افتراضي مكثف تنظمه مبادرة نوبل للنساء بهدف دعم القيادات النسوية الشابة. يوفر التدريب المكثف على المهارات القيادية وحملات الدعم والمناصرة والتشبيك الدولي، مع التركيز على النشاط البيئي وحماية المناخ بقيادة نسوية.",
    bodyEn: "The 2026 Sister-to-Sister Young Feminist Leadership Program is an intensive virtual program by the Nobel Women's Initiative. It provides comprehensive training in leadership, advocacy, and international networking, focusing on ecofeminism and climate advocacy."
  },
  {
    id: 2,
    titleAr: "زمالة Vital Signs for Climate – Community Health Educators Fellowship (VSCHEF) لعام 2026",
    titleEn: "Vital Signs for Climate – Community Health Educators Fellowship (VSCHEF) 2026",
    descAr: "زمالة إقليمية افتراضية تهدف إلى تمكين المعلمين والمثقفين الصحيين لربط تأثير التغير المناخي بالصحة العامة والمجتمعية.",
    descEn: "A regional virtual fellowship aiming to empower educators and health workers to link climate change impacts with public and community health.",
    type: "fellowships",
    locationAr: "إقليمي (الشرق الأوسط وإفريقيا)",
    locationEn: "Regional (Middle East & Africa)",
    date: "2026-09-15",
    bodyAr: "زمالة Vital Signs for Climate هي زمالة إقليمية افتراضية تهدف إلى تمكين الكوادر الشبابية من ربط التغير المناخي بالصحة المجتمعية. سيتلقى الزملاء تدريباً متقدماً وشهادات معتمدة ومنحاً صغيرة لتنفيذ مبادرات توعوية محلية.",
    bodyEn: "Vital Signs for Climate Fellowship is a regional virtual fellowship designed to empower youth in connecting climate change to public health. Fellows receive advanced training, certifications, and micro-grants for local campaigns."
  },
  {
    id: 3,
    titleAr: "برنامج الابتكارات الشاملة للذكاء الاصطناعي في إفريقيا 2026",
    titleEn: "Inclusive AI Innovations Program in Africa 2026",
    descAr: "برنامج يستهدف تمويل ودعم المشاريع الريادية المناخية القائمة على الذكاء الاصطناعي لخدمة ذوي الإعاقة والمجتمعات المهمشة.",
    descEn: "A program focused on funding and supporting AI-driven climate entrepreneurial projects serving people with disabilities and marginalized groups.",
    type: "internships",
    locationAr: "إفريقيا (عدة دول)",
    locationEn: "Africa (Multi-country)",
    date: "2026-07-20",
    bodyAr: "يهدف برنامج الابتكارات الشاملة للذكاء الاصطناعي في إفريقيا ضمن مسار مركز الذكاء الاصطناعي والإدماج لذوي الإعاقة (HAID) لتطوير حلول تكنولوجية وذكية لمواجهة الكوارث الطبيعية وتوفير سبل تكيف بيئي يسهل الوصول إليها.",
    bodyEn: "The Inclusive AI Innovations Program in Africa (HAID Hub) targets the development of technological and smart solutions for natural disasters and accessible environmental adaptation mechanisms."
  },
  {
    id: 4,
    titleAr: "برنامج قادة الجيل القادم في حوكمة الموارد – الدفعة الحادية عشرة لعام 2026",
    titleEn: "Next Generation Leaders in Resource Governance – 11th Cohort 2026",
    descAr: "برنامج تدريب عملي مكثف مقدم من مركز إفريقيا لسياسات الطاقة (ACEP)، يهدف إلى إعداد قيادات شبابية في حوكمة الطاقة والبيئة.",
    descEn: "Intensive training program by the Africa Centre for Energy Policy (ACEP), focused on preparing youth leaders in energy and environmental governance.",
    type: "fellowships",
    locationAr: "أكرا، غانا + هجين",
    locationEn: "Accra, Ghana + Hybrid",
    date: "2026-08-01",
    bodyAr: "برنامج قادة الجيل القادم في حوكمة الموارد هو برنامج تدريب عملي مقدم من مركز إفريقيا لسياسات الطاقة (ACEP)، يهدف إلى إعداد قادة شباب مجهزين بالمعرفة والمهارات اللازمة للإشراف الفعال على قطاع الطاقة والموارد الطبيعية والانتقال العادل للوقود الأخضر.",
    bodyEn: "Next Generation Leaders in Resource Governance is an internship program by the Africa Centre for Energy Policy (ACEP), equipping young leaders with governance knowledge, natural resource oversight tools, and policies for a just transition."
  },
  {
    id: 5,
    titleAr: "فرصة تدريبية في مبادرة (Mangrove Breakthrough)",
    titleEn: "Internship in the Mangrove Breakthrough Initiative",
    descAr: "تقدم منظمة Ambition Loop فرصة تدريبية للعمل كمتدرب لدعم المبادرة العالمية لحماية واستعادة غابات المانغروف الساحلية.",
    descEn: "Ambition Loop offers an internship opportunity to support the global initiative aimed at protecting and restoring coastal mangrove forests.",
    type: "internships",
    locationAr: "عن بعد (دولي)",
    locationEn: "Remote (International)",
    date: "2026-07-05",
    bodyAr: "تقدم منظمة Ambition Loop فرصة تدريبية للعمل كمتدرب ضمن مبادرة (Mangrove Breakthrough)، وهي مبادرة عالمية تهدف إلى حماية واستعادة 15 مليون هكتار من غابات المانغروف على مستوى العالم بحلول عام 2030 لتخزين الكربون وحماية السواحل.",
    bodyEn: "Ambition Loop provides an internship within the 'Mangrove Breakthrough' initiative, which aims to protect and restore 15 million hectares of mangrove forests globally by 2030 to bolster carbon storage and protect coastlines."
  },
  {
    id: 6,
    titleAr: "جوائز حلول المناخ العادلة بين الجنسين 2026",
    titleEn: "Gender Just Climate Solutions Awards 2026",
    descAr: "مبادرة دولية تنظمها شبكة النساء والنوع الاجتماعي المعنية بالمناخ (WGC) للاحتفاء بالحلول والمشاريع المناخية الرائدة والنسوية.",
    descEn: "An international initiative by the Women and Gender Constituency (WGC) celebrating pioneering, feminist climate solutions and projects.",
    type: "competitions",
    locationAr: "دولية (حفل في COP31)",
    locationEn: "International (Ceremony at COP31)",
    date: "2026-10-10",
    bodyAr: "جوائز الحلول المناخية العادلة جندريًا هي مبادرة دولية تنظمها شبكة النساء والنوع الاجتماعي المعنية بالمناخ (Women and Gender Constituency) للاحتفاء بالشركاء الذين يدمجون مبادئ المساواة وحقوق المرأة في صميم حلول التغير المناخي والزراعة المستدامة وطاقة الرياح/الشمس.",
    bodyEn: "The Gender Just Climate Solutions Awards celebrate initiatives and organizations integrating gender equality and women's rights into local climate actions, sustainable farming, and renewable energy sectors."
  },
  {
    id: 7,
    titleAr: "زمالة الصندوق العالمي للخير 2027",
    titleEn: "The Global Good Fund Fellowship 2027",
    descAr: "برنامج زمالة قيادي يمتد لمدة 12 شهرًا ويستهدف رواد الأعمال الاجتماعيين والبيئيين الناشئين الذين يحدثون تغييراً مجتمعياً.",
    descEn: "A 12-month leadership fellowship targeting emerging social and environmental entrepreneurs driving positive societal change.",
    type: "fellowships",
    locationAr: "عالمي + تدريب قيادي شخصي",
    locationEn: "Global + 1-on-1 Leadership Coaching",
    date: "2026-09-30",
    bodyAr: "زمالة الصندوق العالمي للخير هي برنامج قيادي يمتد لمدة 12 شهرًا ويستهدف رواد الأعمال الاجتماعيين والقادة الناشئين الذين يديرون شركات أو مؤسسات ناشئة تركز على الاستدامة وحل الأزمات البيئية والتنمية الاقتصادية العادلة.",
    bodyEn: "The Global Good Fund Fellowship is a 12-month mentorship program supporting social and green entrepreneurs globally, providing executive coaching, peer learning, and $10,000 for leadership development."
  },
  {
    id: 8,
    titleAr: "جوائز UNIDO العالمية للاستدامة 2026",
    titleEn: "UNIDO Global Sustainability Awards 2026",
    descAr: "تُعد جوائز الاستدامة مبادرة عالمية أطلقتها منظمة الأمم المتحدة للتنمية الصناعية للاحتفاء بالحلول الصناعية الدائرية والخضراء.",
    descEn: "The sustainability awards are a global initiative launched by UNIDO to celebrate circular economy and green industrial solutions.",
    type: "competitions",
    locationAr: "فيينا، النمسا (ترشيحات افتراضية)",
    locationEn: "Vienna, Austria (Virtual Nominations)",
    date: "2026-11-05",
    bodyAr: "تُعد جوائز العالم الواحد للاستدامة مبادرة عالمية أطلقتها منظمة الأمم المتحدة للتنمية الصناعية (UNIDO) للاحتفاء بالشركات والمشاريع التي تساهم في الانتقال إلى اقتصاد دائري خالٍ من الانبعاثات الكربونية الضارة بالبيئة.",
    bodyEn: "The UNIDO Global Sustainability Awards celebrate green projects and businesses accelerating the transition to a low-carbon, circular economy through smart and eco-friendly industrial designs."
  },
  {
    id: 9,
    titleAr: "المجموعة الوطنية للعمل المناخي (NCAG) في العراق",
    titleEn: "National Climate Action Group (NCAG) in Iraq",
    descAr: "تعلن وزارة الشباب والرياضة العراقية بالتعاون مع يونيسف عن فتح باب الانضمام للمجموعة الوطنية للعمل المناخي وبناء القدرات.",
    descEn: "The Iraqi Ministry of Youth & Sports, in partnership with UNICEF, announces application openings for the Climate Action Group.",
    type: "volunteering",
    locationAr: "العراق (محلياً وهجين)",
    locationEn: "Iraq (Local & Hybrid)",
    date: "2026-07-31",
    bodyAr: "تعلن وزارة الشباب والرياضة العراقية بالتعاون مع يونيسف العراق عن فتح باب الانضمام إلى المجموعة الوطنية للعمل المناخي (National Climate Action Group - NCAG). المبادرة تهدف لجمع الشباب العراقي لابتكار حلول لشح المياه والتصحر وتأثير المناخ المحلي.",
    bodyEn: "The Iraqi Ministry of Youth and Sports, alongside UNICEF Iraq, invites applications for the National Climate Action Group (NCAG), focusing on mobilizing young volunteers to tackle water scarcity and desertification."
  }
];

export default function Home() {
  const { t, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  // Extract type from url hash if clicking anchor links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes("type=")) {
        const type = hash.split("type=")[1];
        if (type) {
          setActiveTab(type.toLowerCase());
          // Scroll to opportunities section
          const el = document.getElementById("opportunities");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // run once at init
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesTab = activeTab === "all" || opp.type === activeTab;
    return matchesTab;
  });

  const categoriesList = [
    { id: "all", label: t.allOpportunities },
    { id: "competitions", label: t.competitions },
    { id: "conferences", label: t.conferences },
    { id: "volunteering", label: t.volunteering },
    { id: "jobs", label: t.jobs },
    { id: "scholarships", label: t.scholarships },
    { id: "fellowships", label: t.fellowships },
    { id: "internships", label: t.internships },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-radial from-emerald-50/70 via-background to-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Hero details */}
            <div className="lg:col-span-7 text-center lg:text-right space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-primary border border-emerald-100">
                🌱 {t.heroSubtitle}
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.15]">
                {t.heroTitle}
              </h1>
              <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.heroDescription}
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#opportunities"
                  className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all transform hover:-translate-y-0.5"
                >
                  {t.heroExplore}
                </a>
                <Link
                  href="/chatbot"
                  className="rounded-full bg-white border border-card-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-emerald-50/50 hover:border-primary/50 transition-all flex items-center gap-2"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {t.heroChatbot}
                </Link>
              </div>
            </div>

            {/* Hero graphics/artwork */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-100/50 absolute -z-10 blur-3xl animate-pulse"></div>
              <div className="border-4 border-emerald-500/10 rounded-2xl p-4 bg-white/40 backdrop-blur-md shadow-2xl relative">
                {/* SVG representing organic networks and sustainability */}
                <svg className="w-64 h-64 sm:w-80 sm:h-80 text-primary" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 20C55.817 20 20 55.817 20 100C20 144.183 55.817 180 100 180C144.183 180 180 144.183 180 100C180 55.817 144.183 20 100 20Z" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                  <path d="M100 40C66.863 40 40 66.863 40 100C40 133.137 66.863 160 100 160C133.137 160 160 133.137 160 100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M100 60C77.909 60 60 77.909 60 100C60 122.091 77.909 140 100 140C122.091 140 140 122.091 140 100" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" />
                  {/* Leaves details */}
                  <path d="M100 100C100 70 120 50 140 50C140 80 120 100 100 100Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
                  <path d="M100 100C100 130 80 150 60 150C60 120 80 100 100 100Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
                  <circle cx="100" cy="100" r="8" fill="currentColor" />
                  <circle cx="140" cy="50" r="5" fill="currentColor" />
                  <circle cx="60" cy="150" r="5" fill="currentColor" />
                </svg>
                <div className="absolute -bottom-6 -right-6 bg-white border border-card-border p-4 rounded-xl shadow-lg flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-primary">
                    🌍
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Arab Youth</h4>
                    <p className="text-sm font-extrabold text-foreground">100% Green Action</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="opportunities" className="py-20 bg-white border-y border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {t.oppTitle}
              </h2>
              <p className="mt-2 text-foreground/70">
                {isRtl ? "اكتشف أحدث البرامج والمنح والوظائف للنهوض بالعمل البيئي والمناخي" : "Discover the newest programs, grants and roles driving environmental and climate actions."}
              </p>
            </div>
          </div>

          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-2 mb-8 pb-3 border-b border-card-border overflow-x-auto scrollbar-none">
            {categoriesList.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.location.hash = `opportunities?type=${tab.id}`;
                }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-emerald-50/50 hover:bg-emerald-50 text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Opportunities Grid */}
          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOpportunities.map((opp) => {
                const title = isRtl ? opp.titleAr : opp.titleEn;
                const desc = isRtl ? opp.descAr : opp.descEn;
                const loc = isRtl ? opp.locationAr : opp.locationEn;
                
                return (
                  <article
                    key={opp.id}
                    className="flex flex-col rounded-2xl border border-card-border bg-white p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group duration-300"
                  >
                    {/* Upper badge & meta details */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary capitalize">
                        {opp.type}
                      </span>
                      <span className="text-xs text-foreground/50 flex items-center gap-1">
                        📅 {opp.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    
                    <p className="text-sm text-foreground/70 mb-6 flex-1 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>

                    {/* Bottom Meta & Action */}
                    <div className="pt-4 border-t border-card-border flex items-center justify-between">
                      <span className="text-xs text-foreground/60 flex items-center gap-1">
                        📍 {loc}
                      </span>
                      <button
                        onClick={() => setSelectedOpp(opp)}
                        className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {t.readMore} {isRtl ? "←" : "→"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-card-border rounded-2xl">
              <span className="text-4xl">🔍</span>
              <p className="mt-4 text-foreground/60 font-medium">
                {isRtl ? "لم يتم العثور على فرص تطابق معايير البحث." : "No opportunities found matching your criteria."}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* Opportunity Detail Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-card-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-card-border flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary capitalize mb-2">
                  {selectedOpp.type}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {isRtl ? selectedOpp.titleAr : selectedOpp.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-2 text-foreground/60 hover:text-foreground hover:bg-emerald-50/50 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
              <div className="grid grid-cols-2 gap-4 bg-emerald-50/30 p-4 rounded-xl">
                <div>
                  <span className="block text-xs text-foreground/50">{t.location}</span>
                  <span className="font-semibold text-foreground">📍 {isRtl ? selectedOpp.locationAr : selectedOpp.locationEn}</span>
                </div>
                <div>
                  <span className="block text-xs text-foreground/50">{t.deadline}</span>
                  <span className="font-semibold text-foreground">📅 {selectedOpp.date}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-base border-b border-card-border pb-1">
                  {isRtl ? "تفاصيل الفرصة" : "Opportunity Details"}
                </h4>
                <p className="text-foreground/80">
                  {isRtl ? selectedOpp.bodyAr : selectedOpp.bodyEn}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => {
                    alert(isRtl ? "تم توجيهك إلى استمارة التقديم الرسمية." : "Redirecting you to the official registration page.");
                    setSelectedOpp(null);
                  }}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-hover transition-all cursor-pointer"
                >
                  {isRtl ? "قدّم الآن" : "Apply Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
