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

interface Article {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  readTimeAr: string;
  readTimeEn: string;
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

const mockArticles: Article[] = [
  {
    id: 1,
    titleAr: "مهارات مطلوبة في 2026 للحصول على فرص دولية",
    titleEn: "Skills Required in 2026 to Obtain International Opportunities",
    descAr: "الدليل الشامل لأبرز المهارات الخضراء، التحليل البيئي، والتواصل المناخي التي تبحث عنها المنظمات المانحة والمؤسسات البيئية هذا العام.",
    descEn: "The comprehensive guide to key green skills, environmental analysis, and climate communication sought by donors and eco-institutions this year.",
    readTimeAr: "دقيقتان قراءة",
    readTimeEn: "2 min read",
    bodyAr: "مهارات مطلوبة في 2026 تشمل التفكير المستدام، وتحليل البصمة الكربونية للمشاريع، وإدارة المخاطر المناخية، بالإضافة إلى المهارات الرقمية المتقدمة مثل استخدام نظم المعلومات الجغرافية والمحاكاة البيئية.",
    bodyEn: "Essential skills in 2026 include sustainability thinking, carbon footprint analysis, climate risk management, and digital competencies like GIS mapping and environmental simulation."
  },
  {
    id: 2,
    titleAr: "هل اللغة الانجليزية عائق أمام الفرص العالمية؟",
    titleEn: "Is the English Language a Barrier to Global Opportunities?",
    descAr: "كيف تكسر حاجز اللغة وتوظف أدوات الترجمة والذكاء الاصطناعي لصياغة ملف تقديم احترافي، وتطوير لغتك الأكاديمية أثناء التقديم.",
    descEn: "How to break the language barrier and leverage translation and AI tools to craft professional applications while improving your academic language.",
    readTimeAr: "3 دقائق قراءة",
    readTimeEn: "3 min read",
    bodyAr: "لا شك أن الإنجليزية مهمة، ولكنها لم تعد عائقاً مطلقاً! مع توفر الذكاء الاصطناعي والمصححات اللغوية، يمكنك صياغة رسائل اهتمام قوية وتطوير مهارتك الشفوية تدريجياً عبر البرامج التبادلية والمنح المخصصة لغير المتحدثين بها بطلاقة.",
    bodyEn: "While English is crucial, it is no longer an absolute barrier! Thanks to AI assistants and language proofreaders, you can structure strong motivation letters and steadily build oral skills."
  },
  {
    id: 3,
    titleAr: "كيف تحضر رسالة التقديم الاحترافية للفرص المناخية؟",
    titleEn: "How to Prepare a Professional Motivation Letter for Climate Opportunities?",
    descAr: "خطوة بخطوة: صياغة رسالة الاهتمام وربط شغفك البيئي وتجاربك المحلية بمتطلبات الجهة المانحة لإقناع لجان الاختيار الدولية.",
    descEn: "Step-by-step: Crafting a compelling motivation letter linking your environmental passion and local projects to donor requirements to impress review boards.",
    readTimeAr: "4 دقائق قراءة",
    readTimeEn: "4 min read",
    bodyAr: "لكتابة رسالة دافع قوية للفرص البيئية، ابدأ بتوضيح المشكلة المناخية المحلية التي تسعى لحلها، ثم اذكر مساهمتك السابقة، واختتم بما ستقدمه للمجتمع بعد عودتك أو تخرجك من هذا البرنامج.",
    bodyEn: "To write an outstanding letter, state the local climate challenge you address, specify your actions, and explain how the opportunity will enable you to expand your local impact."
  },
  {
    id: 4,
    titleAr: "مستقبل الفرص في الاقتصاد الأخضر",
    titleEn: "The Future of Opportunities in the Green Economy",
    descAr: "ما هو الاقتصاد الأخضر؟ وما هي الوظائف والمنح الناشئة في مجالات الطاقة المتجددة، التدوير، والزراعة العضوية وكيف تستعد لها؟",
    descEn: "What is the green economy? Discover emerging jobs and fellowships in renewable energy, circular economy, and organic farming and how to prepare.",
    readTimeAr: "3 دقائق قراءة",
    readTimeEn: "3 min read",
    bodyAr: "الاقتصاد الأخضر هو نموذج تنموي يهدف لتقليل المخاطر البيئية. الوظائف الناشئة فيه تشمل استشاريي الطاقة النظيفة، ومحللي سلاسل الإمداد الدائرية، والمهندسين الزراعيين الحيويين.",
    bodyEn: "The green economy is a development model targeting low carbon emissions and resource efficiency. Emerging roles include clean energy advisors, circular supply chain analysts, and bio-agricultural engineers."
  },
  {
    id: 5,
    titleAr: "عقلية الباحث عن الفرص: كيف يفكر المقبولون دائما؟",
    titleEn: "Opportunity Seeker Mindset: How Do Constant Nominees Think?",
    descAr: "أسرار الفوز بالمنح والزمالات الدولية: كيف تتعامل مع الرفض كخطوة للتعلم، وكيف تبني ملفاً شخصياً تراكمياً يفرض نفسه في كل تقديم.",
    descEn: "Secrets to winning international fellowships: Handling rejection as a learning process, and creating a cumulative portfolio that stands out in applications.",
    readTimeAr: "5 دقائق قراءة",
    readTimeEn: "5 min read",
    bodyAr: "المقبولون دائماً لا يتميزون بذكاء خارق، بل بـ 'عقلية النمو والتراكم'. إنهم ينظرون لكل رفض كتحديث لملف التقديم، ويقومون بالتقديم المبكر ويركزون على دقة تلبية معايير الجائزة أو المنحة.",
    bodyEn: "Successful applicants rely on a growth mindset. They treat every rejection as feedback to update their drafts, start early, and align their resumes precisely with selection metrics."
  },
  {
    id: 6,
    titleAr: "كيف تكتب \"نبذة مهنية\" احترافية على حسابك في لينكدن لزيادة قبولك",
    titleEn: "How to Write a Professional LinkedIn Summary for Green Opportunities",
    descAr: "دليل عملي لتنسيق حسابك الشخصي على لينكدن واستهداف الكلمات المفتاحية البيئية لجذب أنظار مسؤولي التوظيف والباحثين عن الكفاءات.",
    descEn: "A practical guide to structuring your LinkedIn profile and optimizing environmental keywords to attract international green recruiters.",
    readTimeAr: "دقيقتان قراءة",
    readTimeEn: "2 min read",
    bodyAr: "اجعل نبذتك على لينكدن واضحة وتبدأ بعبارات قوية مثل 'أخصائي بيئي يسعى لتقليل البصمة الكربونية'. استخدم كلمات مفتاحية مثل: الاستدامة، التغير المناخي، التنوع البيولوجي، كفاءة الطاقة.",
    bodyEn: "Make your LinkedIn summary clear and start with an impact line like 'Environmentalist driving carbon offset projects'. Highlight keywords: sustainability, climate action, biodiversity, ESG."
  },
  {
    id: 7,
    titleAr: "من الهامش إلى الدولية: طريقك للفرص المناخية الكبرى",
    titleEn: "From the Margins to the Global Stage: Path to Climate Opportunities",
    descAr: "حتى لو كنت تعيش في قرية نائية أو تفتقر للدعم المحلي، إليك كيف تفرض مبادراتك المجتمعية الصغيرة نفسها على الساحة الدولية.",
    descEn: "Even if you reside in remote areas or lack local backing, here is how to position your grassroots community projects on the global stage.",
    readTimeAr: "4 دقائق قراءة",
    readTimeEn: "4 min read",
    bodyAr: "تبحث المنظمات العالمية عن التأثير الحقيقي والحلول من القاعدة الشعبية. وثّق عملك بالصور والأرقام البسيطة، وتقدم لبرامج بناء القدرات الإقليمية، فالأهم هو المبادرة على أرض الواقع.",
    bodyEn: "Global agencies seek real impact and grassroots solutions. Document your project with simple metrics and photos, apply for capacity building, and showcase actual community engagement."
  },
  {
    id: 8,
    titleAr: "من \"ماذا أملك\" إلى \"ماذا يحتاجون\": فن ربط مهاراتك بالجهات المانحة",
    titleEn: "From 'What I Have' to 'What They Need': Alignment Art",
    descAr: "مهارة إعادة صياغة خبراتك السابقة لتناسب تطلعات المانحين والمنظمات، وكيف تحول تجاربك العادية إلى نقاط قوة تفي بالمتطلبات المحددة.",
    descEn: "The skill of framing your previous experiences to fit donor criteria, converting general volunteer work into robust competencies that address specific calls.",
    readTimeAr: "3 دقائق قراءة",
    readTimeEn: "3 min read",
    bodyAr: "بدل كتابة 'شاركت في زراعة أشجار'، صغها بـ 'قمت بقيادة حملة تشجير محلية أسفرت عن زراعة 500 شجرة وتثقيف 100 فرد حول مكافحة التصحر'. هكذا يرى المانحون الأرقام والتأثير الفعلي الموجه.",
    bodyEn: "Instead of writing 'planted trees', frame it as 'led a reforestation drive planting 500 saplings, educating 100 locals on anti-desertification'. Donors appreciate quantitative impact."
  },
  {
    id: 9,
    titleAr: "الفرق بين Motivation Letter وCover Letter الدليل الكامل وطرق كتابتهما",
    titleEn: "Difference Between Motivation Letter & Cover Letter: Full Guide",
    descAr: "توضيح الفروقات الجوهرية بين الخطابين وكيفية اختيار الرسالة الأنسب لكل نوع من أنواع التقديم (وظائف، منح، تدريب).",
    descEn: "Clarifying core differences between the two documents and choosing the correct letter for each application type (jobs, grants, internships).",
    readTimeAr: "4 دقائق قراءة",
    readTimeEn: "4 min read",
    bodyAr: "رسالة الدافع (Motivation Letter) تركز على شغفك وأهدافك المستقبلية وعلاقتها بالدراسة أو المنحة. أما رسالة التغطية (Cover Letter) فتركز بشكل أكبر على مؤهلاتك المهنية وخبراتك السابقة وكيف تطابق متطلبات الوظيفة الشاغرة.",
    bodyEn: "A Motivation Letter describes your passion, long-term goals, and alignment with academic programs. A Cover Letter focuses on your career achievements, skills, and direct alignment with job responsibilities."
  }
];

const mockOrganizations = [
  "ClimaMedix", "مؤسسة ماسة حواء للتنمية", "FEPS Green Office", "Beyond Borders", 
  "Asaleb albkaa", "Youth LED Algeria", "مؤسسة إمكان", "ToRead SARL", 
  "منتدى طلاب سقطرى الجامعي", "Growvity Initiative", "Yemblue", "بيئة وسلام", 
  "أساليب البقاء", "Plant For Good", "Together for Blue and Green", "GDA borj Essougui", 
  "منظمة رياديو المناخ السوريون", "مؤسسة روافد للتنمية المستدامة", "مبادرة خضراء الفكر", 
  "LoopX", "Youth Impact Iraq", "Soqia for Innovative Environmental Solutions", 
  "Youth Working Group", "Biocert", "Alula international", "OrganicG", 
  "Beit Al karma", "جمعيه كل الناس لتنمية البيئه والسلام", "Algerian Youth For Nature", 
  "Bara'ah altawarh", "Sustainable fashion arabia _ SFA", "Ins foundation", 
  "مؤسسة قِوام للتدريب و التمكين", "Association for Ksour Preservation"
];

export default function Home() {
  const { language, t, isRtl } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [selectedArt, setSelectedArt] = useState<Article | null>(null);
  
  // Custom dark mode toggle state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Sync dark mode preference
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

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
    const title = isRtl ? opp.titleAr : opp.titleEn;
    const desc = isRtl ? opp.descAr : opp.descEn;
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || opp.type === activeTab;
    return matchesSearch && matchesTab;
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
      <section className="relative overflow-hidden bg-radial from-emerald-50/70 via-background to-background dark:from-emerald-950/20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Hero details */}
            <div className="lg:col-span-7 text-center lg:text-right space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-primary dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
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
                  className="rounded-full bg-white dark:bg-card-bg border border-card-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 hover:border-primary/50 transition-all flex items-center gap-2"
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
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-100/50 dark:bg-emerald-950/20 absolute -z-10 blur-3xl animate-pulse"></div>
              <div className="border-4 border-emerald-500/10 rounded-2xl p-4 bg-white/40 dark:bg-emerald-950/5 backdrop-blur-md shadow-2xl relative">
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
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card-bg border border-card-border p-4 rounded-xl shadow-lg flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-primary">
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

      {/* Floating Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-emerald-900 text-foreground border border-card-border shadow-xl hover:scale-105 hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-all cursor-pointer"
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Opportunities Section */}
      <section id="opportunities" className="py-20 bg-white dark:bg-card-bg/30 border-y border-card-border">
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
            
            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder={isRtl ? "ابحث عن فرصة..." : "Search for opportunity..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                🔍
              </div>
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
                    : "bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-foreground"
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
                    className="flex flex-col rounded-2xl border border-card-border bg-white dark:bg-card-bg/60 p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group duration-300"
                  >
                    {/* Upper badge & meta details */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-primary dark:text-emerald-400 capitalize">
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

      {/* Articles Section */}
      <section id="articles" className="py-20 bg-emerald-50/30 dark:bg-emerald-950/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t.artTitle}
            </h2>
            <p className="mt-2 text-foreground/70">
              {isRtl ? "نصائح وإرشادات وتوجيهات عملية لصياغة ملفات تقديم متميزة في التخصصات البيئية" : "Practical guidebooks, tips and tricks to prepare standout portfolios for green positions."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockArticles.map((art) => {
              const title = isRtl ? art.titleAr : art.titleEn;
              const desc = isRtl ? art.descAr : art.descEn;
              const readTime = isRtl ? art.readTimeAr : art.readTimeEn;
              
              return (
                <article
                  key={art.id}
                  className="flex flex-col bg-white dark:bg-card-bg/60 rounded-2xl border border-card-border overflow-hidden shadow-sm hover:shadow-lg transition-all group duration-300"
                >
                  {/* Decorative Thumbnail */}
                  <div className="h-44 bg-gradient-to-br from-emerald-600/20 to-green-600/5 dark:from-emerald-950/40 relative flex items-center justify-center p-6 border-b border-card-border overflow-hidden">
                    <span className="text-6xl opacity-30 select-none group-hover:scale-110 transition-transform duration-500">
                      {art.id % 3 === 0 ? "📝" : art.id % 3 === 1 ? "📚" : "🎓"}
                    </span>
                    <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-card-bg/85 backdrop-blur-sm border border-card-border px-3 py-1 rounded-full text-xs font-semibold text-foreground/75">
                      ⏳ {readTime}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-foreground/70 mb-6 flex-1 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>
                    <button
                      onClick={() => setSelectedArt(art)}
                      className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors cursor-pointer self-start"
                    >
                      {t.readMore} {isRtl ? "←" : "→"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Organizations Map Network */}
      <section id="organizations" className="py-20 bg-white dark:bg-card-bg/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t.orgTitle}
            </h2>
            <p className="mt-2 text-foreground/70">
              {t.orgSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto">
            {mockOrganizations.map((org, idx) => (
              <div
                key={idx}
                className="bg-emerald-50/40 dark:bg-emerald-950/15 border border-card-border text-foreground hover:border-primary/50 hover:bg-emerald-50 hover:text-primary dark:hover:bg-emerald-950/40 px-5 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
              >
                {org}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-us" className="py-20 bg-emerald-50/10 dark:bg-emerald-950/5 border-t border-card-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            {t.aboutUs}
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            {isRtl
              ? "نحن نؤمن بأن الوصول العادل إلى الفرص البيئية هو حجر الأساس لبناء جيل قادر على التكيف ومواجهة التحديات المناخية. منصة فرص خضراء هي صلة الوصل بين الكفاءات الشابة والمشروعات العالمية التي تهدف إلى إنقاذ كوكبنا."
              : "We believe that fair access to environmental opportunities is the cornerstone of building a resilient generation capable of facing climate challenges. Foras Khadra links young talents with global projects saving our planet."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-card-bg border border-card-border rounded-2xl p-6">
              <span className="text-3xl block mb-2">💡</span>
              <h3 className="font-bold text-foreground text-sm mb-1">{isRtl ? "الرؤية" : "Vision"}</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">{isRtl ? "إتاحة المعرفة التخصصية وتأهيل الكفاءات العربية دون حواجز لغوية." : "Providing specialized insights and training Arab competencies without language barriers."}</p>
            </div>
            <div className="bg-white dark:bg-card-bg border border-card-border rounded-2xl p-6">
              <span className="text-3xl block mb-2">🎯</span>
              <h3 className="font-bold text-foreground text-sm mb-1">{isRtl ? "الرسالة" : "Mission"}</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">{isRtl ? "ربط الشباب بفرص حقيقية وتدريب عملي لبناء مسارات خضراء." : "Connecting youth with genuine roles and hands-on training to build green paths."}</p>
            </div>
            <div className="bg-white dark:bg-card-bg border border-card-border rounded-2xl p-6">
              <span className="text-3xl block mb-2">🤝</span>
              <h3 className="font-bold text-foreground text-sm mb-1">{isRtl ? "القيم" : "Values"}</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">{isRtl ? "العدالة، الشفافية، الاستدامة، والمشاركة المجتمعية." : "Equality, transparency, sustainability, and community participation."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-card-bg/20">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {t.contact}
            </h2>
            <p className="mt-2 text-sm text-foreground/60">
              {isRtl ? "أرسل لنا استفسارك أو تعليقك وسيقوم فريقنا بالرد عليك في أقرب وقت." : "Send us your query or feedback, and our team will get back to you shortly."}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(isRtl ? "تم إرسال رسالتك بنجاح! سنقوم بالتواصل معك قريباً." : "Your message has been sent successfully! We will contact you soon.");
              (e.target as HTMLFormElement).reset();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-foreground/75 mb-1.5">{isRtl ? "الاسم الكامل" : "Full Name"}</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/75 mb-1.5">{isRtl ? "البريد الإلكتروني" : "Email Address"}</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/75 mb-1.5">{isRtl ? "موضوع الرسالة" : "Subject"}</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/75 mb-1.5">{isRtl ? "محتوى الرسالة" : "Message Details"}</label>
              <textarea
                rows={4}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isRtl ? "إرسال الرسالة" : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* Opportunity Detail Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card-bg w-full max-w-2xl rounded-2xl border border-card-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-card-border flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-primary dark:text-emerald-400 capitalize mb-2">
                  {selectedOpp.type}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {isRtl ? selectedOpp.titleAr : selectedOpp.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-2 text-foreground/60 hover:text-foreground hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
              <div className="grid grid-cols-2 gap-4 bg-emerald-50/30 dark:bg-emerald-950/10 p-4 rounded-xl">
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

      {/* Article Detail Modal */}
      {selectedArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card-bg w-full max-w-2xl rounded-2xl border border-card-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-card-border flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-primary dark:text-emerald-400 capitalize mb-2">
                  {isRtl ? selectedArt.readTimeAr : selectedArt.readTimeEn}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {isRtl ? selectedArt.titleAr : selectedArt.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArt(null)}
                className="p-2 text-foreground/60 hover:text-foreground hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed text-foreground/80">
              <p className="font-medium text-foreground">
                {isRtl ? selectedArt.descAr : selectedArt.descEn}
              </p>
              
              <div className="space-y-3 pt-2">
                <p>
                  {isRtl ? selectedArt.bodyAr : selectedArt.bodyEn}
                </p>
                <p>
                  {isRtl
                    ? "التقديم للفرص الدولية يتطلب الإعداد المسبق وبناء مهارات الكتابة الفعالة. تأكد من مراجعة متطلبات الجهة المانحة وملاءمة سيرتك الذاتية لها بدقة وتجنب التقديم العشوائي، بل ركز على البرامج التي تدعم اهتماماتك المباشرة."
                    : "Applying for international opportunities requires thorough planning and effective writing skills. Always cross-check the donor's guidelines and map your resume coordinates accordingly, focusing on programs supporting your immediate interests."}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedArt(null)}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-all cursor-pointer"
                >
                  {t.close}
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
