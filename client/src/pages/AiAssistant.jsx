import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { assistantPrompts } from "../data/demoData.js";
import { financeService } from "../services/financeService.js";

export default function AiAssistant() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Ask me about overspending, savings plans, monthly summaries, or category trends." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    financeService.aiHistory().then((response) => {
      if (response.data.length) setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text = input) {
    if (!text.trim()) return;
    const userMessage = { role: "user", content: text };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await financeService.askAi(text);
      setMessages((current) => [...current, { role: "assistant", content: data.content }]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.38fr]">
      <section className="panel flex min-h-[72vh] flex-col">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 dark:border-white/10"><span className="grid size-11 place-items-center rounded-xl bg-sky-100 text-sky-700"><Bot size={20} /></span><div><h2 className="text-xl font-bold">AI Financial Assistant</h2><p className="text-sm text-zinc-500">Gemini-powered analysis with private backend context.</p></div></div>
        <div className="flex-1 space-y-4 overflow-y-auto py-5">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-zinc-100 dark:bg-white/10"><Bot size={18} /></span>}
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-ink text-white dark:bg-white dark:text-ink" : "bg-zinc-100 dark:bg-white/10"}`}>{message.content}</div>
              {message.role === "user" && <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-zinc-100 dark:bg-white/10"><UserRound size={18} /></span>}
            </div>
          ))}
          {loading && <div className="text-sm font-semibold text-zinc-500">Thinking through your money patterns...</div>}
          <div ref={endRef} />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 border-t border-zinc-100 pt-4 dark:border-white/10">
          <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask where you are overspending..." />
          <button className="btn-primary px-3" disabled={loading}><Send size={18} /></button>
        </form>
      </section>
      <aside className="panel h-max">
        <div className="flex items-center gap-2"><Sparkles className="text-gold" /><h3 className="font-bold">Prompt library</h3></div>
        <div className="mt-4 grid gap-2">{assistantPrompts.map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-xl bg-zinc-50 p-3 text-left text-sm font-semibold transition hover:bg-zinc-100 dark:bg-white/10 dark:hover:bg-white/15">{prompt}</button>)}</div>
      </aside>
    </div>
  );
}
