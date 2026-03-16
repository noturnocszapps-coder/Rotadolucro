'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase-client';
import { Send, ShieldAlert, Info, User, Car } from 'lucide-react';
import { sendMessage } from '@/actions/chat';
import { motion, AnimatePresence } from 'motion/react';
import { ReportModal } from '@/components/ReportModal';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ChatRoomProps {
  connectionId: string;
  currentUserId: string;
  otherPartyId: string;
  otherPartyName: string;
  otherPartyRole: 'passenger' | 'driver';
  initialMessages: Message[];
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ 
  connectionId, 
  currentUserId, 
  otherPartyId,
  otherPartyName,
  otherPartyRole,
  initialMessages 
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 1. Real-time Subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${connectionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `connection_id=eq.${connectionId}`,
        },
        (payload: any) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.find(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [connectionId, supabase]);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(connectionId, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] glass-card overflow-hidden relative">
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/5 bg-white/[0.01] backdrop-blur-xl flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center text-neutral-500 border border-white/5 shadow-xl">
            {otherPartyRole === 'driver' ? <Car className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-black text-white uppercase tracking-tight font-display text-sm">{otherPartyName}</h3>
            <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-black">
              {otherPartyRole === 'driver' ? 'Motorista Verificado' : 'Passageiro'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-roxou/5 text-roxou rounded-xl text-[9px] font-black uppercase tracking-widest border border-roxou/10">
            <span className="w-1.5 h-1.5 bg-roxou rounded-full animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
            Criptografia
          </div>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="p-3 text-neutral-600 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent hover:border-rose-500/10"
            title="Denunciar usuário"
          >
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>

        <ReportModal 
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportedId={otherPartyId}
          reportedName={otherPartyName}
          contextType="chat"
          contextId={connectionId}
        />
      </header>

      {/* Legal Banner */}
      <div className="px-8 py-3 bg-amber-500/5 border-b border-amber-500/10 flex items-center gap-3 relative z-10">
        <Info className="w-4 h-4 text-amber-500/60" />
        <p className="text-[9px] text-amber-500/60 font-black uppercase tracking-widest">
          A Roxou não participa da negociação. Combine valores aqui.
        </p>
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 bg-bg/30 relative z-0 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-6 py-4 rounded-2xl text-sm shadow-2xl relative ${
                  isMe 
                  ? 'bg-roxou text-white rounded-tr-none shadow-roxou/20' 
                  : 'bg-white/[0.03] text-neutral-200 border border-white/5 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed font-bold text-[13px]">{msg.content}</p>
                  <p className={`text-[8px] mt-2 font-black uppercase tracking-widest opacity-40 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <footer className="p-6 bg-white/[0.01] backdrop-blur-2xl border-t border-white/5 relative z-10">
        <form onSubmit={handleSend} className="flex items-center gap-4">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escreva sua mensagem..."
            className="flex-1 px-8 py-4 rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder:text-neutral-700 focus:ring-2 focus:ring-roxou/20 focus:border-roxou outline-none transition-all text-xs font-bold"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center hover:bg-roxou hover:text-white transition-all disabled:opacity-50 shadow-2xl active:scale-95 group"
          >
            <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </form>
      </footer>
    </div>
  );
};
