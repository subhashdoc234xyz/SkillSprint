import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareCode, Send, Sparkles, Bot, User, CornerDownLeft } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import LanguageToggle from '../components/LanguageToggle';

const INITIAL_MESSAGES = {
  English: [
    {
      role: 'assistant',
      content: "Hello! I am your SkillSprint AI Mentor. Ask me anything about engineering concepts, technical career paths, resume tips, or project ideas!",
      timestamp: 'Just now'
    }
  ],
  Tamil: [
    {
      role: 'assistant',
      content: "வணக்கம்! நான் உங்களின் SkillSprint AI வழிகாட்டி (Mentor). பொறியியல் பாடங்கள், நேர்காணல் தயாரிப்பு மற்றும் தொழில்முறை வழிகாட்டுதல் பற்றி என்னிடம் கேளுங்கள்!",
      timestamp: 'Just now'
    }
  ]
};

const ChatPage = ({ language, setLanguage }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES[language] || INITIAL_MESSAGES.English);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Reset initial greeting if switching languages and no conversation exists yet
    if (messages.length <= 1) {
      setMessages(INITIAL_MESSAGES[language] || INITIAL_MESSAGES.English);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query, timestamp: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(query, language, messages);
      const botMsg = {
        role: 'assistant',
        content: response.reply,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        role: 'assistant',
        content: language === 'Tamil'
          ? 'மன்னிக்கவும், ஒரு பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
          : 'I encountered an error connecting to the AI agent. Please try again.',
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = language === 'Tamil' ? [
    "தொழில்நுட்ப நேர்காணலுக்கு எவ்வாறு தயாராவது?",
    "3rd Year மாணவர்களுக்கான சிறந்த பிராஜெக்ட் ஐடியாக்கள்?",
    "Data Structures & Algorithms ஐ எளிதாகக் கற்பது எப்படி?"
  ] : [
    "How do I prepare for technical interviews?",
    "Best capstone project ideas for engineering resume?",
    "What is the roadmap to master Cloud & DevOps?"
  ];

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 h-[calc(100vh-100px)] flex flex-col space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan shadow-glow-cyan text-white">
            <MessageSquareCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>AI Mentor Assistant</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">
                LLaMA 3
              </span>
            </h1>
            <p className="text-xs text-gray-400">Real-time bilingual career mentoring</p>
          </div>
        </div>

        <LanguageToggle language={language} setLanguage={setLanguage} />
      </div>

      {/* Main Chat Conversation Container */}
      <GlassCard className="flex-1 flex flex-col p-6 overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-primary-500/20 border border-primary-500/40 text-primary-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-primary-600 to-accent-cyan text-white shadow-glow-blue rounded-tr-none'
                      : 'bg-dark-900/80 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-500/20 border border-primary-500/40 text-primary-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-dark-900/80 border border-white/10 text-gray-400 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
                <span>AI Mentor is thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2 mb-3 shrink-0">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-dark-900/60 hover:bg-primary-500/10 border border-white/10 hover:border-primary-500/40 text-gray-300 hover:text-primary-300 transition-all text-left"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 shrink-0"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'Tamil' ? 'கேள்வி கேட்கவும்...' : 'Ask your AI mentor a question...'}
              className="w-full py-3 pl-4 pr-10 rounded-xl bg-dark-900/90 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
            <CornerDownLeft className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <GlowButton type="submit" disabled={loading || !input.trim()} icon={Send} className="px-6">
            Send
          </GlowButton>
        </form>
      </GlassCard>
    </div>
  );
};

export default ChatPage;
