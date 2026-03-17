import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, initialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && user) {
      navigate('/dashboard');
    }
  }, [user, initialized, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update auth profile
      await updateProfile(firebaseUser, { displayName: name });

      // Create profile in Firestore
      const profilePath = `users/${firebaseUser.uid}`;
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          name,
          email,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, profilePath);
      }

      navigate('/onboarding');
    } catch (err: any) {
      let message = 'Ocorreu um erro ao criar sua conta.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está em uso.';
      } else if (err.code === 'auth/weak-password') {
        message = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'E-mail inválido.';
      }
      setError(message);
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row overflow-hidden">
      {/* Explanation Block - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50"></div>
        <div className="max-w-md space-y-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <TrendingUp className="text-zinc-950" size={28} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Rota<span className="text-emerald-500">Lucro</span></h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-black text-white leading-tight">Crie sua conta e comece a lucrar</h2>
            <p className="text-zinc-400 text-xl leading-relaxed">
              Junte-se a centenas de entregadores que já profissionalizaram sua gestão financeira.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Gestão de Shopee e Mercado Livre',
              'Cálculo automático de lucro líquido',
              'Simulador de rotas e fretes',
              'Relatórios de desempenho'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-300 font-bold">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-zinc-800">
            <p className="text-zinc-500 text-sm font-medium">
              O RotaLucro é a ferramenta definitiva para quem vive de entregas.
            </p>
          </div>
        </div>
      </div>

      {/* Register Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-zinc-950" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Rota<span className="text-emerald-500">Lucro</span></h1>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center space-y-2">
            <h2 className="text-3xl font-black text-white">Criar Conta</h2>
            <p className="text-zinc-500 font-medium">Comece sua jornada para o lucro real hoje.</p>
          </div>

          <div className="bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Cadastro</h3>
              <p className="text-zinc-500 text-sm font-medium">Preencha os dados abaixo para começar.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="Seu nome"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Criar Minha Conta
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-zinc-800 text-center">
              <p className="text-zinc-500 font-medium">
                Já tem conta?{' '}
                <Link to="/login" className="text-emerald-500 font-black hover:underline">Entre aqui</Link>
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <a 
              href="https://www.ntaplicacoes.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-emerald-500 transition-colors"
            >
              RotaLucro é uma plataforma da NT Aplicações <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

