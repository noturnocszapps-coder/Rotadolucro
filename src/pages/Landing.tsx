import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Calculator, 
  ClipboardList, 
  BarChart3, 
  ChevronRight, 
  CheckCircle2,
  Truck,
  Package,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingUp className="text-zinc-950" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Rota<span className="text-emerald-500">Lucro</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-semibold text-zinc-400 hover:text-emerald-500 transition-colors hidden sm:block">Já tenho conta</Link>
            <Link to="/register" className="bg-emerald-500 text-zinc-950 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 active:scale-95">
              Começar Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10 opacity-50"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-10 relative">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Inteligência Logística para Entregadores</span>
          </div>

          <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
            Saiba exatamente quanto você <span className="text-emerald-500">lucra por entrega.</span>
          </h2>
          
          <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Controle rotas, custos, fretes e descubra seu lucro real trabalhando com Shopee, Mercado Livre e entregas autônomas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/register" className="w-full sm:w-auto bg-emerald-500 text-zinc-950 px-10 py-5 rounded-2xl text-xl font-black hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 active:scale-95">
              Começar Agora <ChevronRight size={24} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-zinc-800 transition-all active:scale-95">
              Já tenho conta
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-zinc-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm font-medium">Plataforma criada para entregadores</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm font-medium">Gestão inteligente para quem vive de rota</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-emerald-500" />
              <span className="text-sm font-medium">Powered by NT Aplicações</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative p-2 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-50"></div>
            <div className="relative bg-zinc-950 rounded-[2rem] border border-zinc-800 p-6 md:p-10 space-y-10">
              {/* Mock Dashboard Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Visão Geral</div>
                  <div className="text-3xl font-bold text-white">Painel de Controle</div>
                </div>
                <div className="flex gap-3">
                  <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-emerald-500">Shopee</div>
                  <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400">Mercado Livre</div>
                </div>
              </div>

              {/* Mock Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-2">
                  <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Ganhos Brutos</div>
                  <div className="text-2xl font-black text-white">R$ 4.250,00</div>
                  <div className="text-emerald-500 text-[10px] font-bold">+12% este mês</div>
                </div>
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl space-y-2">
                  <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Lucro Líquido</div>
                  <div className="text-2xl font-black text-white">R$ 2.840,00</div>
                  <div className="text-emerald-500 text-[10px] font-bold">Livre de despesas</div>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-2">
                  <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Despesas</div>
                  <div className="text-2xl font-black text-red-400">R$ 1.410,00</div>
                  <div className="text-zinc-500 text-[10px] font-bold">Combustível e Manutenção</div>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-2">
                  <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Eficiência</div>
                  <div className="text-2xl font-black text-white">R$ 2,45/km</div>
                  <div className="text-emerald-500 text-[10px] font-bold">Acima da média</div>
                </div>
              </div>

              {/* Mock Chart Area */}
              <div className="h-64 bg-zinc-900/30 border border-zinc-800 rounded-3xl flex items-end justify-between p-6 gap-2">
                {[40, 65, 45, 90, 55, 75, 85, 60, 95, 70, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-lg relative group/bar" style={{ height: `${h}%` }}>
                    <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-t-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Explanation Section */}
      <section className="py-24 px-4 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">Tudo o que você precisa para lucrar mais</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Ferramentas desenvolvidas especificamente para a realidade de quem trabalha nas ruas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 space-y-6 hover:border-emerald-500/50 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <TrendingUp size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Lucro Real</h3>
                <p className="text-zinc-400 leading-relaxed">Descubra quanto sobra no final da rota depois de combustível e despesas.</p>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 space-y-6 hover:border-emerald-500/50 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Calculator size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Calcular Frete</h3>
                <p className="text-zinc-400 leading-relaxed">Saiba o valor ideal para cobrar por uma rota ou entrega autônoma.</p>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 space-y-6 hover:border-emerald-500/50 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <ClipboardList size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Controle de Custos</h3>
                <p className="text-zinc-400 leading-relaxed">Registre combustível, gastos e acompanhe sua operação diária.</p>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 space-y-6 hover:border-emerald-500/50 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Relatórios Inteligentes</h3>
                <p className="text-zinc-400 leading-relaxed">Acompanhe faturamento, lucro por KM e desempenho por plataforma.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">Feito para quem trabalha com entregas</h2>
            <p className="text-zinc-400 text-xl leading-relaxed">
              Não importa se você faz entregas leves ou fretes pesados, o RotaLucro se adapta à sua rotina.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Package className="text-emerald-500" />, title: "Entregadores da Shopee", desc: "Controle suas rotas de coleta e entrega." },
                { icon: <Truck className="text-emerald-500" />, title: "Entregadores do Mercado Livre", desc: "Gestão completa para motoristas de ML." },
                { icon: <ShieldCheck className="text-emerald-500" />, title: "Trabalhadores autônomos", desc: "Ideal para fretes, carretos e rotas particulares." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-900 transition-colors">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-zinc-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000" 
                alt="Logistics" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl space-y-2">
                <div className="text-emerald-500 font-black text-2xl">R$ 2,85 / km</div>
                <div className="text-zinc-300 text-sm font-medium">Média de lucro líquido em rotas otimizadas pelo RotaLucro.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NT Aplicações Ecosystem Section */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto">
            <Zap size={40} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Uma plataforma da NT Aplicações</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              RotaLucro faz parte do ecossistema de soluções digitais da NT Aplicações, focado em criar ferramentas modernas para mobilidade, logística e gestão.
            </p>
          </div>
          <div className="pt-4">
            <a 
              href="https://www.ntaplicacoes.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-500 font-bold text-lg hover:underline group"
            >
              Conhecer a NT Aplicações <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 -z-10"></div>
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white">Comece agora a entender o lucro real das suas entregas.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto bg-emerald-500 text-zinc-950 px-12 py-6 rounded-2xl text-2xl font-black hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95">
              Criar Minha Conta
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-zinc-800 transition-all active:scale-95">
              Entrar
            </Link>
          </div>
          <p className="text-zinc-500 font-medium">Junte-se a centenas de entregadores que já profissionalizaram sua gestão.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-zinc-950" size={18} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Rota<span className="text-emerald-500">Lucro</span></h1>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto md:mx-0">
              A ferramenta definitiva para o entregador moderno. Lucro real, gestão simplificada.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-6 text-sm font-bold text-zinc-400">
              <Link to="/login" className="hover:text-emerald-500 transition-colors">Entrar</Link>
              <Link to="/register" className="hover:text-emerald-500 transition-colors">Cadastrar</Link>
              <a href="https://www.ntaplicacoes.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">NT Aplicações</a>
            </div>
            <div className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
              © 2026 RotaLucro • Uma solução NT Aplicações
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

