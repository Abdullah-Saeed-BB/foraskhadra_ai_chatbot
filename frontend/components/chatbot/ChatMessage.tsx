import React from 'react'
import { Message } from "@/types/chat";
import OpportunityCard from './OpportunityCard';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const ChatMessage = ({msg, isRtl, setInputValue}: {msg: Message, isRtl: boolean, setInputValue: (input: string) => void}) => {
  const isBot = msg.sender === "bot";
  const content = msg.language === "ar" && msg.ar_text ? msg.ar_text: msg.en_text 
  
  return (
    <div
      key={msg.id}
      className="flex justify-start w-full"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className={`flex flex-col gap-2 ${isBot ? 'w-full' : 'max-w-[85%]'}`}>
        {isBot ? (
          <BotMessage msg={msg} isRtl={isRtl} setInputValue={setInputValue}/>
        ) : (
          <HumanMessage content={content} />
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

const BotMessage = ({msg, isRtl, setInputValue}: {msg: Message, isRtl: boolean, setInputValue: (input: string) => void}) => {
  const content = msg.language === "ar" && msg.ar_text ? msg.ar_text: msg.en_text 
  console.log(
    "Content: ", content, "\nmsg: ", msg
  )
  let splittedContent = content.split("<|DATA|>")
  splittedContent = splittedContent.flatMap((element, index) => 
      index === 0 ? element : ["<|DATA|>", element]
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {splittedContent.map((item, index) => {
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
      {msg.suggestions && msg.suggestions.length > 0 && 
        <div className="mt-4 mb-10">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-foreground/70">{isRtl ? "اقتراحات:" : "Suggestions:"}</span>
            {msg.suggestions.map((suggestion, idx) => (
              <button key={idx} onClick={() => setInputValue(suggestion)} className="text-sm text-slate-50 py-1 px-3 w-fit rounded-2xl shadow-sm bg-primary/80 hover:bg-primary/70">{suggestion}</button>
            ))}
          </div>
        </div>
      }
      {/* <hr/>
      <code>
        {JSON.stringify(msg, null, 2)}
      </code> */}
    </div>
  )
}

export default ChatMessage