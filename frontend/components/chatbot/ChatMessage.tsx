import React from 'react'
import { Message } from "@/types/chat";
import OpportunityCard from './OpportunityCard';

const ChatMessage = ({msg, isRtl}: {msg: Message, isRtl: boolean}) => {
  const isBot = msg.sender === "bot";
  
  return (
    <div
      key={msg.id}
      className="flex justify-start w-full"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className={`flex flex-col gap-2 ${isBot ? 'w-full' : 'max-w-[85%]'}`}>
        {isBot ? (
          <BotMessage msg={msg}/>
        ) : (
          <HumanMessage content={msg.text} />
        )}
      </div>
    </div>
  )
}

const HumanMessage = ({content}: {content: string}) => {
  return (
    <div className="flex flex-col gap-2 max-w-full">
      <div className="rounded-2xl px-5 py-4 text-sm shadow-sm whitespace-pre-wrap leading-relaxed bg-primary text-white">
        {content}
      </div>
    </div>
  )
}

const BotMessage = ({msg}: {msg: Message}) => {
  let content = msg.text.split("<|DATA|>")
  content = content.flatMap((element, index) => 
      index === 0 ? element : ["<|DATA|>", element]
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {content.map((item, index) => {
        if (item === "<|DATA|>") {
          return <div key={index + "_card"} className="my-2 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {
              msg.ragData && msg.ragData.length > 0 && msg.ragData.map((doc, idx) => (
                <OpportunityCard key={idx + "_oppo"} doc={doc} />
              ))
            }
          </div>;
        }
        return <p key={index} className='text-sm whitespace-pre-wrap leading-relaxed text-foreground py-2'>
            {item}
        </p>;
      })}
      
      
      {/* <div className="text-sm whitespace-pre-wrap leading-relaxed text-foreground py-2">
        {msg.text}
      </div>
      {msg.ragData && msg.ragData.length > 0 && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {msg.ragData.map((doc: any, idx: number) => (
            <a key={idx} href={doc.application_url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl border border-card-border bg-white dark:bg-card-bg hover:border-primary/50 transition-colors shadow-sm text-start">
              <h4 className="font-bold text-sm text-primary mb-1 line-clamp-1">{doc.title}</h4>
              <p className="text-xs text-foreground/70 mb-2 line-clamp-2">{doc.description}</p>
              <div className="flex justify-between items-center text-[10px] text-foreground/50 gap-2">
                <span className="truncate">{doc.organization}</span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">{doc.category}</span>
              </div>
            </a>
          ))}
        </div>
      )} */}
      <hr/>
      <code>
        {JSON.stringify(msg, null, 2)}
      </code>
    </div>
  )
}

export default ChatMessage