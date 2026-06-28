"use client";

import { useState } from "react";
import { Send, Search } from "lucide-react";

const contacts = [
  { id: 1, name: "Alex Johnson", lastMsg: "Is my order ready?", time: "2m", unread: 2, online: true },
  { id: 2, name: "Maria Garcia", lastMsg: "Thank you so much!", time: "8m", unread: 0, online: true },
  { id: 3, name: "James Lee", lastMsg: "Can I change my order?", time: "15m", unread: 1, online: false },
  { id: 4, name: "Priya Patel", lastMsg: "Great food as always 🔥", time: "32m", unread: 0, online: false },
  { id: 5, name: "Tom Wilson", lastMsg: "What's the wait time?", time: "1h", unread: 0, online: false },
  { id: 6, name: "Zoe Martinez", lastMsg: "Perfect, thank you!", time: "2h", unread: 0, online: false },
];

const initMessages = [
  { from: "customer", text: "Hi! Is my order ready yet?", time: "11:34 AM" },
  { from: "admin", text: "Hey Alex! Your order is being prepared right now, should be ready in about 5 minutes. 🍔", time: "11:35 AM" },
  { from: "customer", text: "Great, thanks! Can I add extra fries?", time: "11:36 AM" },
  { from: "admin", text: "Absolutely, I'll add a large fries to your order. That'll be an extra $5.80.", time: "11:37 AM" },
  { from: "customer", text: "Perfect, go ahead!", time: "11:37 AM" },
  { from: "admin", text: "Done! Your full order: Classic Burger ×2, Fries ×1, Large Fries ×1. Ready in about 3 minutes.", time: "11:38 AM" },
];

export default function ChatPage() {
  const [selected, setSelected] = useState(contacts[0]);
  const [messages, setMessages] = useState(initMessages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "admin", text: input.trim(), time: "Now" }]);
    setInput("");
  };

  return (
    <div className="max-w-300 h-[calc(100vh-10rem)]">
      <div className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden h-full flex">
        {/* Contact list */}
        <div className="w-72 border-r border-white/8 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search chats…"
                className="w-full pl-9 pr-4 py-2 text-sm bg-royal/20 border border-white/8 rounded-lg outline-none focus:border-gold/40 transition-all text-slate-200 placeholder:text-slate-600 tracking-wide"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-white/5 transition-colors text-left ${
                  selected.id === c.id ? "bg-white/5 border-l-2 border-gold pl-3.5" : "hover:bg-royal/20"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-royal/50 border border-white/10 flex items-center justify-center text-slate-300 text-sm font-bold">
                    {c.name[0]}
                  </div>
                  {c.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-ink-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate tracking-wide ${selected.id === c.id ? "text-white" : "text-slate-200"}`}>
                      {c.name}
                    </p>
                    <span className="text-xs text-slate-600 shrink-0 ml-1 tracking-wide">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5 tracking-wide">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-4 h-4 bg-gold text-navy text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-royal/50 border border-white/10 flex items-center justify-center text-slate-300 text-sm font-bold">
                {selected.name[0]}
              </div>
              {selected.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-ink-2" />
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-sm tracking-wide">{selected.name}</p>
              <p className={`text-xs tracking-wide ${selected.online ? "text-emerald-400" : "text-slate-600"}`}>
                {selected.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.from === "admin"
                      ? "bg-royal text-white rounded-br-sm border border-white/10"
                      : "bg-royal/40 text-slate-200 rounded-bl-sm border border-white/8"
                  }`}
                >
                  <p className="leading-relaxed tracking-wide">{m.text}</p>
                  <p className={`text-xs mt-1 tracking-wide ${m.from === "admin" ? "text-slate-400" : "text-slate-600"}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-white/8 flex gap-3">
            <input
              type="text"
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 px-4 py-2.5 text-sm bg-royal/20 border border-white/8 rounded-xl outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-200 placeholder:text-slate-600 tracking-wide"
            />
            <button
              onClick={send}
              className="w-10 h-10 bg-gold hover:bg-gold-light text-navy rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-gold/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
