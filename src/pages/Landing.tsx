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

      {/* Premium Content Hub - Consolidated Section */}
      <section className="py-24 px-4 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Tudo o que você precisa para <span className="text-emerald-500">lucrar mais</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              Ferramentas desenvolvidas especificamente para a realidade de quem trabalha nas ruas, unindo gestão, inteligência e resultados.
            </p>
          </div>

          {/* Features & Dashboard Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: <TrendingUp size={24} />, title: "Lucro Real", desc: "Descubra quanto sobra no final da rota depois de combustível e despesas." },
                  { icon: <Calculator size={24} />, title: "Calcular Frete", desc: "Saiba o valor ideal para cobrar por uma rota ou entrega autônoma." },
                  { icon: <ClipboardList size={24} />, title: "Controle de Custos", desc: "Registre combustível, gastos e acompanhe sua operação diária." },
                  { icon: <BarChart3 size={24} />, title: "Relatórios Inteligentes", desc: "Acompanhe faturamento, lucro por KM e desempenho por plataforma." }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 transition-all group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500" size={24} />
                  Feito para quem trabalha com entregas
                </h3>
                <div className="space-y-3">
                  {[
                    "Entregadores Shopee e Mercado Livre",
                    "Motoristas de fretes e carretos",
                    "Trabalhadores autônomos e logística"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-400 text-sm">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative p-2 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-50"></div>
                <div className="relative bg-zinc-950 rounded-[2rem] border border-zinc-800 p-6 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Painel de Controle</div>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                      <div className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Lucro Líquido</div>
                      <div className="text-xl font-black text-emerald-500">R$ 2.840</div>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                      <div className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Eficiência</div>
                      <div className="text-xl font-black text-white">R$ 2,45/km</div>
                    </div>
                  </div>

                  <div className="h-32 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex items-end justify-between p-4 gap-1">
                    {[30, 50, 40, 80, 45, 60, 70, 55, 90, 65].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-md" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950">
                        <TrendingUp size={16} />
                      </div>
                      <div className="text-xs font-bold text-white">Meta Diária</div>
                    </div>
                    <div className="text-xs font-black text-emerald-500">85% Atingida</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patch Notes Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Atualizações da Plataforma</h2>
              <p className="text-zinc-500 font-medium">Acompanhe as últimas melhorias e novidades do RotaLucro.</p>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-xs font-bold border border-emerald-500/20">
              Versão Atual: v2.0.4
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                version: "v2.0",
                title: "Nova Experiência RotaLucro",
                description: "Novo dashboard premium com visual mais moderno. Foco total em Shopee, Mercado Livre e Frete. Melhorias na performance mobile.",
                type: "NEW",
                color: "bg-emerald-500"
              },
              {
                version: "v1.9",
                title: "Cálculo Inteligente de Frete",
                description: "Novo sistema de cálculo de frete. Sugestão de valor ideal por rota. Cálculo de lucro por KM e por hora.",
                type: "IMPROVED",
                color: "bg-blue-500"
              },
              {
                version: "v1.8",
                title: "Relatórios Avançados",
                description: "Novos gráficos e métricas. Melhor leitura de desempenho. Comparação entre plataformas.",
                type: "IMPROVED",
                color: "bg-blue-500"
              }
            ].map((note, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 space-y-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-500 font-black text-lg">{note.version}</span>
                  <span className={`${note.color} text-zinc-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest`}>
                    {note.type}
                  </span>
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-xl font-bold text-white">{note.title}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{note.description}</p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                  <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
                  Changelog Oficial
                </div>
              </div>
            ))}
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
            <div className="text-center md:text-right space-y-1">
              <div className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
                © 2026 RotaLucro • Todos os direitos reservados
              </div>
              <a 
                href="https://www.ntaplicacoes.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-zinc-500 text-[10px] uppercase tracking-[0.1em] font-medium hover:text-emerald-500 transition-colors"
              >
                Plataforma desenvolvida por NT Aplicações
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

