import Link from 'next/link';
import { ROUTES } from '@/constants';
import { 
  TrendingUp, 
  ShieldCheck, 
  Smartphone, 
  BarChart3, 
  ChevronRight, 
  Package, 
  MapPin, 
  Calculator,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Fuel,
  PieChart,
  ExternalLink,
  Truck
} from 'lucide-react';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect(ROUTES.DASHBOARD);

  return (
    <main className="min-h-screen bg-bg text-white selection:bg-primary/30 overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 mb-10 backdrop-blur-md animate-fade-in">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-bg bg-neutral-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="User" className="w-full h-full object-cover opacity-80" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              Gestão inteligente para quem vive de rota
            </span>
          </div>

          <h1 className="text-6xl md:text-[120px] font-black tracking-tighter uppercase font-display leading-[0.8] mb-10">
            Saiba quanto <br />
            <span className="text-primary brand-glow">você lucra</span> <br />
            por entrega
          </h1>

          <p className="text-lg md:text-2xl text-neutral-400 font-medium max-w-3xl mx-auto mb-14 leading-relaxed">
            Controle rotas, custos, fretes e descubra seu lucro real trabalhando com <span className="text-white font-bold">Shopee</span>, <span className="text-white font-bold">Mercado Livre</span> e entregas autônomas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link 
              href={ROUTES.LOGIN}
              className="group w-full sm:w-auto bg-primary text-white px-14 py-7 rounded-[28px] font-black uppercase tracking-widest hover:bg-primary-light transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 active:scale-95"
            >
              Começar Agora
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href={ROUTES.LOGIN}
              className="w-full sm:w-auto px-14 py-7 rounded-[28px] border border-white/10 font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Já tenho conta
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Plataforma para entregadores
            </div>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Powered by NT Aplicações
            </div>
          </div>
        </div>
      </section>

      {/* Product Explanation Section */}
      <section className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <div className="max-w-2xl">
              <span className="text-primary text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Funcionalidades</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display leading-none">
                O que você faz com o <span className="text-primary">RotaLucro?</span>
              </h2>
            </div>
            <p className="text-neutral-500 font-medium max-w-sm">
              Tudo o que você precisa para profissionalizar sua operação logística em um só lugar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Lucro Real",
                desc: "Descubra quanto sobra no fim da rota depois de combustível e despesas.",
                icon: DollarSign,
                color: "text-emerald-500"
              },
              {
                title: "Calcular Frete",
                desc: "Saiba o valor ideal para cobrar por uma rota ou entrega autônoma.",
                icon: Calculator,
                color: "text-blue-500"
              },
              {
                title: "Controle de Custos",
                desc: "Registre combustível, gastos e acompanhe sua operação diária.",
                icon: Fuel,
                color: "text-amber-500"
              },
              {
                title: "Relatórios",
                desc: "Veja faturamento, lucro por KM, lucro por hora e desempenho.",
                icon: PieChart,
                color: "text-primary"
              }
            ].map((item, i) => (
              <div key={i} className="glass-card p-10 space-y-8 group hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                <div className={`p-5 rounded-3xl bg-white/[0.03] border border-white/5 ${item.color} w-fit group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight uppercase font-display">{item.title}</h3>
                  <p className="text-neutral-500 font-medium leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for Section */}
      <section className="py-40 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-primary text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Público-alvo</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display">Feito para quem <br /><span className="text-primary">trabalha com entregas</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Shopee",
                type: "Entregadores Shopee",
                desc: "Controle suas rotas de coleta e entrega com precisão cirúrgica.",
                icon: Package
              },
              {
                name: "Mercado Livre",
                type: "Entregadores ML",
                desc: "Gerencie seus ganhos nas rotas Flex e Full com facilidade.",
                icon: Truck
              },
              {
                name: "Autônomos",
                type: "Fretes e Carretos",
                desc: "Calcule fretes lucrativos e não perca dinheiro em viagens longas.",
                icon: MapPin
              }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-8 p-8 rounded-[40px] hover:bg-white/[0.02] transition-all duration-500 group">
                <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight uppercase font-display">{item.type}</h3>
                  <p className="text-neutral-500 font-medium leading-relaxed text-sm max-w-[240px] mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <span className="text-primary text-[11px] font-black uppercase tracking-[0.4em] block">Interface Premium</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display leading-[0.9]">
                  Toda sua <span className="text-primary">operação</span> na palma da mão
                </h2>
                <p className="text-xl text-neutral-400 font-medium leading-relaxed">
                  Uma interface limpa, rápida e pensada para quem está na rua. Visualize seus indicadores de performance em segundos.
                </p>
              </div>

              <ul className="space-y-6">
                {[
                  "Ganhos brutos e lucro líquido real",
                  "Cálculo automático de custo por KM",
                  "Simulador de frete inteligente",
                  "Relatórios de performance por período"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-50" />
              <div className="relative glass-card p-4 rounded-[40px] border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700">
                <div className="bg-bg rounded-[32px] overflow-hidden border border-white/5 aspect-[4/5] md:aspect-video flex flex-col">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl" />
                      <div className="space-y-1">
                        <div className="h-2 w-20 bg-white/10 rounded-full" />
                        <div className="h-1.5 w-12 bg-white/5 rounded-full" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5" />
                      <div className="w-8 h-8 rounded-lg bg-white/5" />
                    </div>
                  </div>
                  <div className="p-8 flex-1 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                        <div className="h-1.5 w-12 bg-primary/40 rounded-full" />
                        <div className="h-6 w-24 bg-white/10 rounded-full" />
                      </div>
                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                        <div className="h-1.5 w-12 bg-emerald-500/40 rounded-full" />
                        <div className="h-6 w-24 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col justify-center items-center space-y-4">
                      <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary" />
                      <div className="h-4 w-40 bg-white/10 rounded-full" />
                      <div className="h-2 w-24 bg-white/5 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Ecosystem Section */}
      <section className="py-40 px-6 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-12">
          <div className="space-y-6">
            <span className="text-primary text-[11px] font-black uppercase tracking-[0.4em] block">Ecossistema</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display leading-none">
              Uma plataforma da <br /><span className="text-primary">NT Aplicações</span>
            </h2>
            <p className="text-xl text-neutral-400 font-medium leading-relaxed max-w-3xl mx-auto">
              O RotaLucro faz parte do ecossistema de soluções digitais da NT Aplicações, focado em criar ferramentas modernas para mobilidade, logística e gestão.
            </p>
          </div>

          <a 
            href="https://www.ntaplicacoes.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-12 py-6 rounded-[24px] bg-white/5 border border-white/10 font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
          >
            Conhecer a NT Aplicações
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 px-6 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-12">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase font-display leading-[0.85]">
            Comece agora a <br />
            <span className="text-primary">entender seu lucro</span>
          </h2>
          <p className="text-xl text-neutral-400 font-medium max-w-2xl mx-auto">
            Junte-se a milhares de entregadores que já profissionalizaram sua gestão financeira.
          </p>
          <Link 
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-4 bg-white text-black px-16 py-8 rounded-[32px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl shadow-white/10 active:scale-95 text-lg"
          >
            Criar Minha Conta
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-bg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl" />
              <span className="text-2xl font-black tracking-tighter uppercase font-display">Rota<span className="text-primary">Lucro</span></span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">
              Transformando rotas em resultados.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] font-black uppercase tracking-widest text-neutral-500">
            <Link href={ROUTES.TERMS} className="hover:text-white transition-colors">Termos</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contato</Link>
            <a href="https://www.ntaplicacoes.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">NT Aplicações</a>
          </div>

          <div className="text-center md:text-right space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700">© 2026 RotaLucro. Todos os direitos reservados.</p>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-800">Desenvolvido por NT Aplicações</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
