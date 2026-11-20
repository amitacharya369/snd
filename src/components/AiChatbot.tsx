'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowRight,
  Building2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface MessageAuthor {
  id: 'sandra';
  name: string;
  shortName: string;
  role: string;
  avatar: string;
  badgeColor: 'amber';
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  author?: MessageAuthor;
  hasEscalationAction?: boolean;
}

const SANDRA_PROFILE: MessageAuthor = {
  id: 'sandra',
  name: 'Sandra',
  shortName: 'Sandra',
  role: 'Project Coordinator',
  avatar: '/images/team/sandra.png',
  badgeColor: 'amber',
};

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      author: SANDRA_PROFILE,
      content:
        "Hi! I'm Sandra from Signs & Decal Corp. (SND). How can I help you today? Whether you're looking for architectural signage, specialty metals, engineering specs, billing info, or an estimating takeoff, I've got you covered!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [contactData, setContactData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    projectLocation: '',
    timeline: '',
    budget: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading, isTyping, scrollToBottom]);

  // Clean up speech synthesis & speech recognition on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  // Sandra Voice Text-to-Speech
  const speakSandra = useCallback(
    (text: string) => {
      if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      window.speechSynthesis.cancel();

      // Strip markdown symbols and URLs for clean speech
      const plainText = text
        .replace(/[*_#`~\[\]]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/^[•\-]\s+/gm, '')
        .replace(/\n+/g, ' ')
        .trim();

      if (!plainText) return;

      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = 'en-US';
      utterance.rate = 1.02;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = voices.filter((v) => v.lang.startsWith('en-US'));

      const sandraVoice =
        preferredVoices.find(
          (v) =>
            v.name.includes('Samantha') ||
            v.name.includes('Jenny') ||
            v.name.includes('Victoria') ||
            v.name.includes('Google US English') ||
            v.name.toLowerCase().includes('female')
        ) ||
        preferredVoices[0] ||
        voices[0];

      if (sandraVoice) utterance.voice = sandraVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled]
  );

  // Toggle voice readout
  const toggleVoice = () => {
    if (voiceEnabled) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
      speakSandra('Voice responses enabled.');
    }
  };

  // Speech-to-Text Microphone Handler
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Stream typing effect word-by-word
  const streamTyping = (
    fullText: string,
    hasEscalation?: boolean,
    onComplete?: () => void
  ) => {
    const msgId = `bot-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Initialize blank message bubble
    setMessages((prev) => [
      ...prev,
      {
        id: msgId,
        role: 'assistant',
        author: SANDRA_PROFILE,
        content: '',
        timestamp,
        hasEscalationAction: false,
      },
    ]);

    setIsTyping(true);

    const words = fullText.split(' ');
    let currentIndex = 0;
    let accumulated = '';

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        accumulated += (currentIndex === 0 ? '' : ' ') + words[currentIndex];
        currentIndex++;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  content: accumulated,
                  hasEscalationAction: currentIndex >= words.length ? Boolean(hasEscalation) : false,
                }
              : m
          )
        );
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, 28);
  };

  // Send message to Sandra API
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const queryToSend = (customText || input).trim();
    if (!queryToSend || isLoading || isTyping) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setInput('');

    const newMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newThread = [...messages, newMsg];
    setMessages(newThread);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newThread.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      
      // Brief thinking delay for realism
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsLoading(false);

      if (data.reply) {
        streamTyping(data.reply, Boolean(data.suggestEscalation), () => {
          speakSandra(data.reply);
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      setIsLoading(false);
      const fallbackReply =
        "I'm experiencing a brief connection glitch, but you can always reach our plant directly at **salesteam@signsanddecal.com** or call us at **(718) 486-6400**!";
      streamTyping(fallbackReply, false, () => speakSandra(fallbackReply));
    }
  };

  // Handle Project Escalation to Estimators
  const handleEscalationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.email && !contactData.phone) {
      alert('Please provide an email or phone number so our team can follow up with your estimate.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          isEscalation: true,
          contactInfo: contactData,
        }),
      });

      const data = await res.json();
      
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsLoading(false);
      setShowEscalationModal(false);

      if (data.reply) {
        streamTyping(data.reply, false, () => {
          speakSandra(data.reply);
        });
      }
    } catch (err) {
      console.error('Escalation error:', err);
      setIsLoading(false);
      setShowEscalationModal(false);
    }
  };

  const handleQuickTopic = (topicQuery: string) => {
    handleSendMessage(undefined, topicQuery);
  };

  return (
    <>
      {/* Floating Toggle Button - Confined to Sandra with Crisp White Text */}
      <div className="fixed bottom-14 right-3 sm:right-4 z-40 select-none">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && voiceEnabled) {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.getVoices();
              }
            }
          }}
          aria-label="Chat with Sandra"
          className="group relative flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-gradient-to-r from-[#0f2b48] via-[#153e68] to-[#1e3a8a] text-white shadow-2xl hover:shadow-amber-500/30 border-2 border-amber-400 hover:border-amber-300 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {/* Sandra Avatar with Active Online Status */}
          <div className="relative">
            <img
              src="/images/team/sandra.png"
              alt="Sandra"
              className="w-8 h-8 rounded-full object-cover border-2 border-amber-400 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f2b48] animate-pulse" />
          </div>

          <div className="text-left">
            <div className="font-heading font-bold text-xs tracking-wide uppercase flex items-center gap-1.5 leading-tight text-white">
              <span className="text-white font-extrabold" style={{ color: '#ffffff' }}>
                Chat with Sandra
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-amber-300 font-medium">Project Coordinator • SND</div>
          </div>

          {isOpen ? (
            <X className="w-4 h-4 text-slate-300 group-hover:text-white ml-1" />
          ) : (
            <MessageSquare className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform ml-1" />
          )}
        </button>
      </div>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat with Sandra"
          className="fixed bottom-28 right-3 sm:right-6 w-[94vw] sm:w-[450px] max-h-[82vh] h-[660px] bg-white rounded-xl shadow-2xl border-2 border-[#0f2b48] z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Window Header with Sandra's Profile */}
          <div className="bg-[#0f2b48] text-white p-3 flex items-center justify-between border-b-2 border-amber-500">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="/images/team/sandra.png"
                  alt="Sandra"
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow ring-2 ring-amber-500/50"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0f2b48] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3
                    className="font-heading font-bold text-base tracking-wide uppercase text-white leading-tight"
                    style={{ color: '#ffffff' }}
                  >
                    Sandra
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-amber-400/20 text-amber-300 border-amber-400/40">
                    Project Coordinator
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Signs &amp; Decal Corp. • Brooklyn, NY</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Readout Audio Toggle */}
              <button
                onClick={toggleVoice}
                title={voiceEnabled ? "Voice Audio: Enabled (Click to Mute)" : "Voice Audio: Muted (Click to Enable)"}
                className={`p-1.5 rounded transition-colors ${
                  voiceEnabled
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
                aria-label="Toggle Voice Readout"
              >
                {voiceEnabled ? (
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-amber-300' : ''}`} />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              {/* Direct Request Bid Button */}
              <button
                onClick={() => setShowEscalationModal(true)}
                title="Direct Request Quote / Briefing"
                className="px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
              >
                Request Bid
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeaking(false);
                }}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Topic Chips Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold text-[#0f2b48] no-scrollbar">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0">Topics:</span>
            <button
              onClick={() => handleQuickTopic('what are your services')}
              className="px-2.5 py-1 rounded-full border text-xs whitespace-nowrap bg-white text-slate-700 hover:bg-amber-50 border-slate-300 hover:border-amber-400 transition-all"
            >
              Services &amp; Trades
            </button>
            <button
              onClick={() => handleQuickTopic('what materials and specialty metals do you fabricate')}
              className="px-2.5 py-1 rounded-full border text-xs whitespace-nowrap bg-white text-slate-700 hover:bg-amber-50 border-slate-300 hover:border-amber-400 transition-all"
            >
              Specialty Metals &amp; Cladding
            </button>
            <button
              onClick={() => handleQuickTopic('what are your engineering and wind load specifications')}
              className="px-2.5 py-1 rounded-full border text-xs whitespace-nowrap bg-white text-slate-700 hover:bg-amber-50 border-slate-300 hover:border-amber-400 transition-all"
            >
              Engineering &amp; Wind Loads
            </button>
            <button
              onClick={() => handleQuickTopic('how do you handle aia g702 billing and certified payroll')}
              className="px-2.5 py-1 rounded-full border text-xs whitespace-nowrap bg-white text-slate-700 hover:bg-amber-50 border-slate-300 hover:border-amber-400 transition-all"
            >
              AIA Billing &amp; Compliance
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-slate-800 text-sm">
            {messages.map((m) => {
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${
                    m.role === 'user' ? 'justify-end' : 'justify-start items-start'
                  }`}
                >
                  {/* Sandra Avatar on Assistant Messages */}
                  {m.role === 'assistant' && (
                    <img
                      src="/images/team/sandra.png"
                      alt="Sandra"
                      aria-hidden="true"
                      className="w-7 h-7 rounded-full object-cover border border-amber-400 mt-1 shrink-0 shadow-xs"
                    />
                  )}

                  <div
                    className={`flex flex-col ${
                      m.role === 'user' ? 'items-end' : 'items-start'
                    } max-w-[84%]`}
                  >
                    {/* Sandra Header Tag above assistant bubble */}
                    {m.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="font-bold text-xs text-[#0f2b48]">Sandra</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border bg-amber-50 text-amber-800 border-amber-200">
                          Project Coordinator
                        </span>
                      </div>
                    )}

                    <div
                      className={`rounded-lg p-3 leading-relaxed shadow-xs ${
                        m.role === 'user'
                          ? 'bg-[#0f2b48] text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}
                    >
                      {m.content ? (
                        <div
                          className="prose prose-sm max-w-none text-inherit prose-strong:text-inherit"
                          dangerouslySetInnerHTML={{
                            __html: formatMarkdown(m.content),
                          }}
                        />
                      ) : (
                        /* Live Typing Dots */
                        <div className="flex items-center gap-1.5 py-1 px-1">
                          <span className="w-2 h-2 rounded-full animate-bounce bg-amber-500" />
                          <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.2s] bg-amber-500" />
                          <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.4s] bg-amber-500" />
                        </div>
                      )}
                    </div>

                    {m.hasEscalationAction && (
                      <button
                        onClick={() => setShowEscalationModal(true)}
                        className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-xs transition-all animate-in fade-in"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Drop Contact Details / Request Call</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {m.role === 'assistant' ? 'Sandra • ' : ''}
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Thinking / Writing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5 text-slate-600 text-xs italic p-2 bg-white rounded-lg border border-slate-200 w-fit">
                <img
                  src="/images/team/sandra.png"
                  alt="Sandra"
                  className="w-5 h-5 rounded-full object-cover border border-amber-400"
                />
                <div className="flex items-center gap-1.5">
                  <span>Sandra is writing a reply</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-amber-500" />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.15s] bg-amber-500" />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.3s] bg-amber-500" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Project Estimating Briefing Modal Overlay */}
          {showEscalationModal && (
            <div className="absolute inset-x-2 bottom-16 top-16 bg-white/98 backdrop-blur-md border-2 border-amber-500 rounded-lg p-4 shadow-2xl z-30 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2 text-[#0f2b48] font-heading font-bold text-base uppercase">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Send Project Brief to Estimating</span>
                  </div>
                  <button
                    onClick={() => setShowEscalationModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Provide your contact details so Carlos Colon and our senior estimating team can review
                  your project specifications and follow up with an itemized proposal.
                </p>

                <form id="escalation-form" onSubmit={handleEscalationSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactData.fullName}
                        onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                        placeholder="John Miller"
                        className="w-full text-xs p-2 rounded border border-slate-300 focus:border-[#0f2b48] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Company / Agency
                      </label>
                      <input
                        type="text"
                        value={contactData.company}
                        onChange={(e) => setContactData({ ...contactData, company: e.target.value })}
                        placeholder="Turner / Skanska / MTA"
                        className="w-full text-xs p-2 rounded border border-slate-300 focus:border-[#0f2b48] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full text-xs p-2 rounded border border-slate-300 focus:border-[#0f2b48] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        placeholder="(212) 555-0199"
                        className="w-full text-xs p-2 rounded border border-slate-300 focus:border-[#0f2b48] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Project Location
                      </label>
                      <input
                        type="text"
                        value={contactData.projectLocation}
                        onChange={(e) => setContactData({ ...contactData, projectLocation: e.target.value })}
                        placeholder="NYC / JFK / Jersey City"
                        className="w-full text-xs p-2 rounded border border-slate-300 focus:border-[#0f2b48] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Target Schedule
                      </label>
                      <input
                        type="text"
                        value={contactData.timeline}
                        onChange={(e) => setContactData({ ...contactData, timeline: e.target.value })}
                        placeholder="Q3 2026 / Immediate"
                        className="w-full text-xs p-2 rounded border border-slate-300 focus:border-[#0f2b48] outline-none"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEscalationModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="escalation-form"
                  disabled={isLoading}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 rounded shadow-xs"
                >
                  {isLoading ? 'Transmitting...' : 'Submit to Estimating Desk'}
                </button>
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            {/* Microphone Voice Input */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Listening... click to stop' : 'Click to speak with microphone'}
              className={`p-2.5 rounded-lg transition-all ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse shadow-md ring-2 ring-red-400'
                  : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-[#0f2b48]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? 'Listening... speak now'
                  : 'Ask Sandra about signage, metals, engineering, billing, bids...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#0f2b48] focus:ring-1 focus:ring-[#0f2b48] outline-none"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading || isTyping}
              aria-label="Send message"
              className="p-2.5 rounded-lg bg-[#0f2b48] hover:bg-[#1e3a8a] disabled:opacity-40 text-white transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// Minimal safe markdown formatter for bolding, bullet points, and links
function formatMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Bullet items starting with • or -
  html = html.replace(/^[•\-]\s+(.*)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');

  return html;
}
