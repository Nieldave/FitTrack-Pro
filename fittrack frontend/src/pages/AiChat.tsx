import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Dumbbell, Apple, Flame } from 'lucide-react';
import { aiService, ChatMessage } from '../services/aiService';

export const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your AI Fitness & Nutrition Coach. Ask me anything about macronutrient splits, recovery strategies, or training form tips!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    'Calculate macro breakdown for fat loss',
    'High protein post-workout meal ideas',
    'How do I overcome a bench press plateau?',
    'Optimal rest times between heavy sets'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const responseText = await aiService.sendNutritionChatMessage(query);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an issue retrieving that advice. Please try asking again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Interactive Coach
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-400" />
          <span>AI Nutrition & Training Coach</span>
        </h2>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Messages Window */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-4 md:p-6 overflow-y-auto space-y-4 shadow-xl">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20'
                    : 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-orange-500 text-zinc-950 font-medium rounded-tr-none'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                <div>{msg.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right font-mono ${
                    isUser ? 'text-zinc-900/60' : 'text-zinc-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-400 italic">
              Coach is typing response...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about nutrition, macros, or lifting technique..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold transition-all shadow-lg shadow-purple-600/20 shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
