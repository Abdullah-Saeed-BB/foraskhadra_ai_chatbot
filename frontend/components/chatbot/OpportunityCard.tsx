import React from 'react'
import { DocumentData } from '@/types/chat'

const OpportunityCard = ({doc}: {doc: DocumentData}) => {
  return (
    <a href={doc.application_url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl border border-card-border bg-white dark:bg-card-bg hover:border-primary/50 transition-colors shadow-sm text-start">
        <h4 className="font-bold text-sm text-primary mb-1 line-clamp-1">{doc.title}</h4>
        <p className="text-xs text-foreground/70 mb-2 line-clamp-2">{doc.description}</p>
        <div className="flex justify-between items-center text-[10px] text-foreground/50 gap-2">
            <span className="truncate">{doc.organization}</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">{doc.category}</span>
        </div>
    </a>
  )
}

export default OpportunityCard