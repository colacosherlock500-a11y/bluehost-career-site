import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../../assets/img/chat/avatar.svg'
import closeLg from '../../assets/img/chat/close-lg.svg'
import closeMd from '../../assets/img/chat/close-md.svg'
import headerBg from '../../assets/img/chat/header-bg.svg'
import sendIdle from '../../assets/img/chat/send.svg'
import sendActive from '../../assets/img/chat/send-active.svg'
import chatIcon from '../../assets/img/common/chat-icon.svg'

interface Message {
  from: 'bot' | 'user'
  text: string
}

const quickActions: { label: string; to: string }[] = [
  { label: 'Find open roles', to: '/jobs' },
  { label: 'Benefits in my country', to: '/around-the-world#countries' },
  { label: 'How to apply', to: '/jobs' },
  { label: 'Meet our teams', to: '/our-teams' },
]

const greeting = "Hi, I'm Blu. I can help you find open roles, learn about our teams, or answer questions about life at Bluehost. What would you like to explore? 😊"

/**
 * INTEGRATION: replace with the real assistant backend (e.g. an API route that
 * calls an LLM / FAQ service). Receives the full history, resolves with the reply.
 */
async function getBotReply(history: Message[]): Promise<string> {
  const last = history[history.length - 1]?.text.toLowerCase() ?? ''
  if (/role|job|position|engineer|apply/.test(last)) return 'Great! You can browse every open role on our job search page — filter by team, country, and work type to narrow it down.'
  if (/benefit/.test(last)) return 'Benefits vary by country. Pick a country on our Around the World page to see what’s offered there.'
  return 'Thanks for your message! A recruiter-reviewed answer is coming soon. In the meantime, try one of the quick links above.'
}

/** Floating "Blu" chat assistant (closed bubble → open panel), per the Chatbot frames in Figma. */
export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: greeting }])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = async (e?: FormEvent) => {
    e?.preventDefault()
    const text = draft.trim()
    if (!text) return
    const history: Message[] = [...messages, { from: 'user', text }]
    setMessages(history)
    setDraft('')
    setTyping(true)
    const reply = await getBotReply(history)
    setTyping(false)
    setMessages(m => [...m, { from: 'bot', text: reply }])
  }

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-4 md:right-[6.5%]">
      {open && (
        <div role="dialog" aria-label="Chat with Blu" className="relative flex h-[385px] w-[333px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[13px] border border-[#e6f4ff] bg-[#f4f9ff] shadow-[0px_0px_24px_0px_rgba(0,20,56,0.17)]">
          <div className="relative flex h-[54.5px] shrink-0 items-center gap-3 px-4" style={{ backgroundImage: `url("${headerBg}")`, backgroundSize: 'cover' }}>
            <span className="relative flex size-[36.6px] items-center justify-center rounded-full border-[1.3px] border-white/20 shadow-[0px_1.3px_2.6px_0px_rgba(0,0,0,0.15)]">
              <img src={avatar} alt="" className="size-[31.4px]" />
              <span className="absolute -bottom-0.5 right-0 size-[9.2px] rounded-full border border-[#2e93ee] bg-[#31ff9f]" />
            </span>
            <div className="flex flex-col gap-0.5 text-white">
              <p className="text-[15px] font-medium leading-[0.9]">Blu</p>
              <p className="text-[8px] leading-[1.5]">Online</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="ml-auto">
              <img src={closeMd} alt="" className="size-[26px]" />
            </button>
          </div>

          <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.map((m, i) =>
              m.from === 'bot' ? (
                <p key={i} className="w-[265px] max-w-[85%] self-start rounded-[16px] rounded-tl-none border-[0.4px] border-night-sky-400 bg-white px-3 py-1.5 text-[13px] leading-[15.6px] tracking-[0.26px] text-bh-blue-1100">
                  {m.text}
                </p>
              ) : (
                <p key={i} className="max-w-[269px] self-end rounded-[16px] rounded-br-none bg-bh-blue px-3 py-3.5 text-sm leading-[17.6px] tracking-[0.26px] text-white">
                  {m.text}
                </p>
              ),
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {quickActions.map(a => (
                  <button
                    key={a.label}
                    onClick={() => {
                      setOpen(false)
                      navigate(a.to)
                    }}
                    className="rounded-[25px] border border-bh-blue px-3 py-[7px] text-[13px] font-medium leading-[1.4] text-bh-blue shadow-[0px_3.3px_6.6px_0px_rgba(0,0,0,0.1)] hover:bg-bh-blue hover:text-white"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
            {typing && <p className="self-start text-xs text-night-sky">Blu is typing…</p>}
          </div>

          <form onSubmit={send} className="mx-4 mb-[18px] flex h-[43.8px] shrink-0 items-center rounded-full border border-bh-light-400 bg-white pl-4 pr-1">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Type your question"
              aria-label="Type your question"
              className="flex-1 bg-transparent text-[13px] tracking-[0.13px] text-bh-blue-1100 outline-none placeholder:text-[#6b7077]"
            />
            <button type="submit" aria-label="Send" disabled={!draft.trim()}>
              <img src={draft.trim() ? sendActive : sendIdle} alt="" className="size-[32.7px]" />
            </button>
          </form>
        </div>
      )}

      {open ? (
        <button onClick={() => setOpen(false)} aria-label="Close chat" className="flex size-[65px] items-center justify-center rounded-[38px] shadow-lg" style={{ backgroundImage: 'linear-gradient(204deg, #196cdf 12%, #0e3b79 91%)' }}>
          <img src={closeLg} alt="" className="size-[27px]" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="flex h-14 w-[50px] flex-col items-center justify-center gap-[5px] rounded-l-[50px] rounded-tr-[50px] bg-bh-blue font-montserrat text-[12px] font-bold text-white drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
        >
          <img src={chatIcon} alt="" className="h-[20.5px] w-[21.4px]" />
          CHAT
        </button>
      )}
    </div>
  )
}
