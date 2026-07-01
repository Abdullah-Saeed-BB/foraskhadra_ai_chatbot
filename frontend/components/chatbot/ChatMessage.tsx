import React from 'react'
import { Message } from "@/types/chat";
import OpportunityCard from './OpportunityCard';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

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
          <BotMessage msg={msg} isRtl={isRtl}/>
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

const BotMessage = ({msg, isRtl}: {msg: Message, isRtl: boolean}) => {
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
                <OpportunityCard key={idx + "_oppo"} doc={doc} isRtl={isRtl}/>
              ))
            }
          </div>;
        }
        return <div key={index} className='text-sm whitespace-pre-wrap leading-relaxed text-foreground py-2'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {item}
          </ReactMarkdown>
        </div>;
      })}
      <hr/>
      <code>
        {JSON.stringify(msg, null, 2)}
      </code>
    </div>
  )
}

export default ChatMessage