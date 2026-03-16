'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  User, 
  Phone,
  Package,
  Truck,
  MapPin,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { completeOnboarding } from '@/actions/profile';
import { PLATFORMS } from '@/constants/platforms';
import { useRouter } from 'next/navigation';

interface OnboardingContentProps {
  initialName: string;
  initialPhone: string;
}

export const OnboardingContent: React.FC<OnboardingContentProps> = ({ initialName, initialPhone }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: initialName,
    phone: initialPhone,
    selected_platforms: [] as string[]
  });

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      selected_platforms: prev.selected_platforms.includes(platform)
        ? prev.selected_platforms.filter(p => p !== platform)
        : [...prev.selected_platforms, platform]
    }));
  };

  const handleFinish = async () => {
    if (!formData.full_name || !formData.phone) {
      alert('Por favor, preencha seu nome e telefone.');
      setStep(1);
      return;
    }

    if (formData.selected_platforms.length === 0) {
      alert('Por favor, selecione pelo menos uma plataforma.');
      return;
    }

    setLoading(true);
    try {
      await completeOnboarding(formData);
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar configuração');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden relative">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-white/5 flex relative z-10">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.6)]" 
          style={{ width: `${(step / 2) * 100}%` }} 
        />
      </div>

      <div className="p-8 md:p-16 relative z-10">
        <header className="mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Passo {step} de 2</span>
          <h2 className="text-5xl font-black tracking-tighter text-white uppercase font-display leading-none">
            {step === 1 && "Seus Dados"}
            {step === 2 && "Suas Plataformas"}
          </h2>
        </header>

        <form className="space-y-10">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  <User className="w-4 h-4 text-primary" /> Nome Completo
                </label>
                <input 
                  type="text" 
                  placeholder="Seu nome completo"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-neutral-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" /> Telefone / WhatsApp
                </label>
                <input 
                  type="tel" 
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-neutral-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-8">Selecione as plataformas que você utiliza para entregas:</p>
              
              <div className="grid gap-4">
                {[PLATFORMS.SHOPEE, PLATFORMS.MERCADO_LIVRE, PLATFORMS.FRETE].map((platform) => (
                  <div 
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`p-8 rounded-[32px] border-2 transition-all cursor-pointer flex items-center justify-between group ${
                      formData.selected_platforms.includes(platform)
                        ? 'bg-primary/10 border-primary shadow-2xl shadow-primary/10'
                        : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        formData.selected_platforms.includes(platform)
                          ? 'bg-primary text-white'
                          : 'bg-white/5 text-neutral-600 group-hover:bg-white/10'
                      }`}>
                        {platform === PLATFORMS.SHOPEE && <Package className="w-7 h-7" />}
                        {platform === PLATFORMS.MERCADO_LIVRE && <Truck className="w-7 h-7" />}
                        {platform === PLATFORMS.FRETE && <MapPin className="w-7 h-7" />}
                      </div>
                      <div>
                        <p className="font-black text-white uppercase tracking-tight text-lg font-display">{platform}</p>
                        <p className="text-[9px] text-neutral-600 uppercase tracking-[0.2em] font-black">Plataforma Ativa</p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.selected_platforms.includes(platform)
                        ? 'bg-primary border-primary text-white'
                        : 'border-white/10'
                    }`}>
                      {formData.selected_platforms.includes(platform) && <CheckCircle2 className="w-5 h-5" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="pt-12 flex items-center justify-between border-t border-white/5">
            {step > 1 ? (
              <button 
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 hover:text-white transition-all"
              >
                Voltar
              </button>
            ) : <div />}

            <button 
              type="button"
              onClick={() => step < 2 ? setStep(step + 1) : handleFinish()}
              disabled={loading}
              className="bg-white text-black px-12 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-2xl disabled:opacity-50 active:scale-95 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {step === 2 ? "Finalizar Configuração" : "Próximo Passo"} 
                  <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
