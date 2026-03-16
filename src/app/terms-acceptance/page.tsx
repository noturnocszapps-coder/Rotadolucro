'use client';

import React, { useState } from 'react';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { acceptTerms } from '@/actions/profile';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function TermsAcceptancePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptTerms();
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error accepting terms:', error);
      alert('Erro ao aceitar termos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-roxou/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-roxou/5 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full glass-card p-12 relative z-10"
      >
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 bg-roxou/10 rounded-[24px] flex items-center justify-center text-roxou border border-roxou/20 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight font-display">Termos e Condições</h1>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">Para continuar, precisamos que você aceite nossos termos.</p>
          </div>
        </div>

        <div className="space-y-8 mb-12">
          <div className="text-neutral-400 text-xs leading-relaxed max-h-64 overflow-y-auto p-8 bg-white/[0.02] rounded-[32px] border border-white/5 font-bold uppercase tracking-wider scrollbar-thin scrollbar-thumb-white/10">
            <div className="space-y-6">
              <section>
                <h3 className="text-white font-black mb-3 text-[10px] tracking-[0.2em]">01. NATUREZA DO SERVIÇO</h3>
                <p className="opacity-60">O Roxou Transporte é uma plataforma de intermediação. Não somos uma empresa de transporte e não possuímos frota própria.</p>
              </section>
              
              <section>
                <h3 className="text-white font-black mb-3 text-[10px] tracking-[0.2em]">02. RESPONSABILIDADE</h3>
                <p className="opacity-60">Toda e qualquer negociação de valores, horários e locais é de responsabilidade exclusiva entre o passageiro e o motorista.</p>
              </section>
              
              <section>
                <h3 className="text-white font-black mb-3 text-[10px] tracking-[0.2em]">03. SEGURANÇA</h3>
                <p className="opacity-60">Recomendamos que passageiros verifiquem a identidade do motorista e as condições do veículo antes de iniciar qualquer viagem.</p>
              </section>
            </div>
          </div>

          <div className="px-4">
            <LegalDisclaimer variant="compact" />
          </div>
        </div>

        <button
          onClick={handleAccept}
          disabled={loading}
          className="w-full bg-white text-black py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-roxou hover:text-white transition-all disabled:opacity-50 shadow-2xl group active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Aceitar e Continuar 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
