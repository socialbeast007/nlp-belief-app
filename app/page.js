'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome. Tell me a belief or thought that has been holding you back lately."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...updatedMessages, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Connection error. Please check your API key and try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-slate-950 text-slate-100 font-sans">
      <header className="py-4 border-b border-slate-800 text-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          NLP Belief Reframer
        </h1>
        <p className="text-xs text-slate-400 mt-1">Socratic questioning for cognitive restructuring</p>
      </header>

      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-bl-none text-xs text-slate-400 animate-pulse">
              Analyzing language structure...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 'I can never succeed at running my own business...'"
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 text-slate-100 placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-semibold px-5 py-3 rounded-xl text-sm transition"
        >
          Send
        </button>
      </form>
    </main>
  );
}
