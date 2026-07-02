import React from 'react'
import { DocumentData } from '@/types/chat'

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


const OpportunityCard = ({doc, isRtl}: {doc: DocumentData, isRtl: boolean}) => {
  // Simple helper to format dates cleanly
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Split tags if they are comma-separated string
  const tagsArray = doc.tags ? doc.tags.split(',').map(t => t.trim()) : [];

  return (
    <div className="block p-3 rounded-xl border border-card-border bg-white dark:bg-card-bg hover:border-primary/50 transition-colors shadow-sm text-start">
        <a href={`/opportunities/${doc.id}`} target="_blank" rel="noopener noreferrer">
          <h4 className="font-bold text-md text-primary mb-2 line-clamp-1">{doc.title}</h4>
          <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{doc.description}</p>
        
          {/* --- Added: Hidden/Extra details mapped out compactly --- */}
          <div className="text-sm space-y-1 mb-3 text-foreground/80 border-t border-dashed border-card-border/60 pt-2">
            {doc.location && (
              <div className="truncate">
                <span className="font-semibold text-foreground/50">{isRtl ? '📌 الموقع: ' : '📌 Location: '}</span>
                {doc.location}
              </div>
            )}
            {doc.requirements && (
              <div className="line-clamp-1">
                <span className="font-semibold text-foreground/50">{isRtl ? '📋 المتطلبات: ' : '📋 Requirements: '}</span>
                {doc.requirements}
              </div>
            )}
            {doc.benefits && (
              <div className="line-clamp-1">
                <span className="font-semibold text-foreground/50">{isRtl ? '🎁 المزايا: ' : '🎁 Benefits: '}</span>
                {doc.benefits}
              </div>
            )}
            
            {/* Dates Section */}
            <div className="my-4 flex flex-wrap gap-x-3 text-sm text-foreground/50 pt-0.5">
              <span>{isRtl ? '📅 نُشر: ' : '📅 Published: '} {formatDate(doc.published_at)}</span>
              {doc.expires_at && (
                <span className="text-destructive/80">
                  {isRtl ? '⌛ ينتهي: ' : '⌛ Expires: '} {formatDate(doc.expires_at)}
                </span>
              )}
            </div>

            {/* Tags Section */}
            {tagsArray.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {tagsArray.map((tag, idx) => (
                  <span key={idx} className="bg-foreground/5 text-foreground/70 text-xs px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* -------------------------------------------------------- */}
        </a>

        <div className="flex justify-between items-center text-xs text-foreground/50 gap-2 border-t border-card-border/40 pt-2">
              <span className="truncate font-medium">{doc.organization}</span>
            <div className="flex gap-2 items-center">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                {isRtl && CATEGORIES[doc.category] ? CATEGORIES[doc.category] : doc.category}
              </span>
              <a href={doc.application_url} target="_blank" className="bg-green-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap">{isRtl ? "التقديم" : "Apply"}</a>
            </div>
        </div>
    </div>
  )
}

export default OpportunityCard