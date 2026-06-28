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
    <div className="max-w-[1200px] h-[calc(100vh-10rem)]">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex">
        {/* Contact list */}
        <div className="w-72 border-r border-slate-100 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search chats…"
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-300 transition-all text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left ${
                  selected.id === c.id ? "bg-emerald-50" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-sm font-bold">
                    {c.name[0]}
                  </div>
                  {c.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate ${selected.id === c.id ? "text-emerald-700" : "text-slate-800"}`}>
                      {c.name}
                    </p>
                    <span className="text-xs text-slate-400 flex-shrink-0 ml-1">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-sm font-bold">
                {selected.name[0]}
              </div>
              {selected.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{selected.name}</p>
              <p className="text-xs text-slate-400">{selected.online ? "Online" : "Offline"}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.from === "admin"
                      ? "bg-emerald-600 text-white rounded-br-sm"
                      : "bg-slate-100 text-slate-800 rounded-bl-sm"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <p className={`text-xs mt-1 ${m.from === "admin" ? "text-emerald-200" : "text-slate-400"}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
            <input
              type="text"
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 transition-all text-slate-700 placeholder:text-slate-400"
            />
            <button
              onClick={send}
              className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
