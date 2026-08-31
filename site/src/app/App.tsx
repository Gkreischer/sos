import { useState, useEffect, useRef } from "react";
import {
  ClipboardList,
  BarChart3,
  Bell,
  QrCode,
  Users,
  Monitor,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Clock,
  Database,
  Layers,
  Zap,
  Shield,
  Smartphone,
  Globe,
  Package,
  Wrench,
  TrendingUp,
  Search,
} from "lucide-react";

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}

function StatCard({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1800, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="font-['Barlow_Condensed'] text-5xl font-bold text-white tracking-tight">
        {count.toLocaleString("pt-BR")}
        {suffix}
      </div>
      <div className="mt-1 text-sm font-['Figtree'] text-blue-200 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

const features = [
  {
    icon: ClipboardList,
    title: "Ordens de Serviço",
    desc: "Criação, acompanhamento e encerramento de OS com código de barras integrado para rastreamento ágil no chão de oficina.",
  },
  {
    icon: QrCode,
    title: "Código de Barras",
    desc: "Cada ordem gera um código de barras único para leitura rápida, eliminando erros manuais e acelerando o fluxo de trabalho.",
  },
  {
    icon: BarChart3,
    title: "Métricas e Dashboards",
    desc: "Painéis com indicadores de desempenho em tempo real: volume de OS, SLA, produtividade por técnico e receita.",
  },
  {
    icon: Bell,
    title: "Notificações em Tempo Real",
    desc: "Alertas instantâneos via Reverb/Pusher para clientes e técnicos sobre mudanças de status e conclusão de serviços.",
  },
  {
    icon: Users,
    title: "Histórico de Clientes",
    desc: "Ficha completa de cada cliente com equipamentos cadastrados, ordens anteriores e interações registradas.",
  },
  {
    icon: Monitor,
    title: "Painel Externo",
    desc: "Portal público para clientes consultarem o status da OS com atualização automática.",
  },
];

const stack = [
  { name: "Laravel", role: "Backend API REST", color: "#ff2d20", icon: "🔴" },
  {
    name: "Ionic + Angular",
    role: "Frontend Mobile-First",
    color: "#3880ff",
    icon: "🔷",
  },
  {
    name: "Docker Compose",
    role: "Infraestrutura & Deploy",
    color: "#2496ed",
    icon: "🐳",
  },
  { name: "PostgreSQL", role: "Banco de Dados", color: "#336791", icon: "🐘" },
  {
    name: "Reverb / Pusher",
    role: "WebSockets em Tempo Real",
    color: "#300d4f",
    icon: "⚡",
  },
];

const steps = [
  {
    num: "01",
    title: "Abertura da OS",
    desc: "Técnico registra equipamento, cliente e defeito relatado. Sistema gera código de barras automaticamente.",
  },
  {
    num: "02",
    title: "Diagnóstico",
    desc: "Laudo técnico inserido com orçamento. Cliente é notificado via app ou painel externo.",
  },
  {
    num: "03",
    title: "Execução",
    desc: "Peças e horas de trabalho são lançadas. Status atualizado em tempo real para todas as partes.",
  },
  {
    num: "04",
    title: "Encerramento",
    desc: "OS fechada com assinatura digital opcional. Histórico e métricas atualizados no dashboard.",
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-['Figtree'] bg-background text-foreground overflow-x-hidden">
      {/* ─── NAV ─── */}
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(15,40,84,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(73,136,196,0.2)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: "#4988c4" }}
            >
              <Wrench size={16} className="text-white" />
            </div>
            <span className="font-['Barlow_Condensed'] font-bold text-xl text-white tracking-wider">
              SOS
            </span>
            <span className="hidden sm:block text-xs text-blue-300 font-['Figtree'] font-normal border-l border-blue-700 pl-3">
              Sistema de Ordem de Serviço
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Funcionalidades", "Como Funciona", "Tecnologia", "Contato"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm text-blue-200 hover:text-white transition-colors font-['Barlow'] font-medium tracking-wide"
                >
                  {item}
                </a>
              ),
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contato"
              className="px-4 py-2 text-sm text-white border border-blue-500 rounded hover:bg-blue-500 transition-colors font-medium"
            >
              Entrar em contato
            </a>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div
            className="md:hidden"
            style={{
              background: "rgba(15,40,84,0.98)",
              borderTop: "1px solid rgba(73,136,196,0.2)",
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {[
                "Funcionalidades",
                "Como Funciona",
                "Tecnologia",
                "Contato",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-blue-200 hover:text-white transition-colors font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <a
                href="#contato"
                className="mt-2 px-4 py-2 text-center text-sm text-white rounded font-medium"
                style={{ background: "#4988c4" }}
              >
                Solicitar Demo
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          background:
            "linear-gradient(135deg, #0f2854 0%, #1c4d8d 60%, #0f2854 100%)",
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          className="absolute right-0 top-0 h-full w-px opacity-20"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #4988c4, transparent)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/40 text-blue-300 text-xs font-['Barlow'] uppercase tracking-widest mb-8"
              style={{ background: "rgba(73,136,196,0.12)" }}
            >
              <Zap size={12} className="text-blue-400" />
              Gestão de Oficina Inteligente
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 ms-3 rounded-full border border-blue-500/40 text-blue-300 text-xs font-['Barlow'] uppercase tracking-widest mb-8"
              style={{ background: "rgba(196, 73, 116, 0.12)" }}
            >
              <Zap size={12} className="text-blue-400" />
              Totalmente gratuito
            </div>

            <h1
              className="font-['Barlow_Condensed'] font-bold text-white leading-none mb-6"
              style={{
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                letterSpacing: "-0.01em",
              }}
            >
              CONTROLE TOTAL
              <br />
              <span style={{ color: "#4988c4" }}>DAS SUAS</span>
              <br />
              ORDENS DE SERVIÇO
            </h1>

            <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-md font-light">
              Do diagnóstico ao encerramento — gerencie OS com código de barras,
              notificações em tempo real e dashboards completos para oficinas e
              assistências técnicas.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-white transition-all"
                style={{ background: "#4988c4" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5a9fd4";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#4988c4";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Ver como funciona <ArrowRight size={16} />
              </a>
              <a
                href="#contato"
                className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-white border border-white/20 hover:border-white/50 transition-all"
              >
                Solicitar demonstração
              </a>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                "Código de barras integrado",
                "Notificações instantâneas",
                "Painel para clientes",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-blue-200"
                >
                  <CheckCircle size={14} className="text-blue-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Mock OS Card */}
          <div>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/mWjkY7IZWWk?si=JRqKnKtc7ym8o9BQ"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="funcionalidades" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-px flex-1 max-w-12"
                style={{ background: "#4988c4" }}
              />
              <span
                className="text-xs font-['Barlow'] uppercase tracking-widest font-semibold"
                style={{ color: "#4988c4" }}
              >
                Funcionalidades
              </span>
            </div>
            <h2
              className="font-['Barlow_Condensed'] font-bold text-foreground leading-tight"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              TUDO QUE SUA OFICINA PRECISA EM UM SÓ SISTEMA
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Do cadastro ao relatório — o SOS cobre cada etapa do ciclo de vida
              de uma ordem de serviço com fluxos pensados para equipes técnicas
              reais.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-card rounded-xl p-6 border border-border hover:border-accent transition-all duration-300 hover:shadow-lg cursor-default"
                style={
                  {
                    "--tw-shadow-color": "rgba(73,136,196,0.15)",
                  } as React.CSSProperties
                }
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors"
                  style={{ background: "#dce8f5" }}
                >
                  <f.icon size={20} style={{ color: "#1c4d8d" }} />
                </div>
                <h3 className="font-['Barlow_Condensed'] font-bold text-lg text-foreground mb-2 tracking-wide">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Saiba mais <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="como-funciona"
        className="py-24"
        style={{ background: "#0f2854" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-px flex-1 max-w-12"
                style={{ background: "#4988c4" }}
              />
              <span
                className="text-xs font-['Barlow'] uppercase tracking-widest font-semibold"
                style={{ color: "#4988c4" }}
              >
                Fluxo de Trabalho
              </span>
            </div>
            <h2
              className="font-['Barlow_Condensed'] font-bold text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              COMO FUNCIONA O SOS
            </h2>
            <p className="mt-4 text-blue-300 leading-relaxed">
              Quatro etapas claras do início ao fim de cada ordem — sem papel,
              sem confusão, sem OS perdida.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="relative z-10 p-6">
                  <div
                    className="font-['Barlow_Condensed'] font-bold text-5xl mb-4 leading-none"
                    style={{ color: "rgba(73,136,196,0.25)" }}
                  >
                    {step.num}
                  </div>
                  <div
                    className="w-14 h-1 mb-4"
                    style={{ background: "#4988c4" }}
                  />
                  <h3 className="font-['Barlow_Condensed'] font-bold text-lg text-white mb-2 tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-blue-300 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* External portal callout */}
          <div
            className="mt-16 rounded-xl p-8 border border-blue-500/20 flex flex-col md:flex-row items-center gap-6"
            style={{ background: "rgba(73,136,196,0.08)" }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(73,136,196,0.2)" }}
            >
              <Globe size={28} style={{ color: "#4988c4" }} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-['Barlow_Condensed'] font-bold text-xl text-white mb-1">
                Painel Externo para Clientes
              </h3>
              <p className="text-blue-300 text-sm">
                Portal de clientes — seu cliente acompanha a OS sem precisar
                ligar para a oficina.
              </p>
            </div>
            <a
              href="#contato"
              className="shrink-0 px-5 py-2.5 rounded text-sm font-semibold text-white whitespace-nowrap"
              style={{ background: "#4988c4" }}
            >
              Ver demo
            </a>
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEW ─── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-px flex-1 max-w-12"
                  style={{ background: "#4988c4" }}
                />
                <span
                  className="text-xs font-['Barlow'] uppercase tracking-widest font-semibold"
                  style={{ color: "#4988c4" }}
                >
                  Dashboard
                </span>
              </div>
              <h2
                className="font-['Barlow_Condensed'] font-bold text-foreground leading-tight mb-6"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                MÉTRICAS QUE IMPORTAM NA PALMA DA MÃO
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: TrendingUp,
                    title: "Volume de OS por período",
                    desc: "Veja picos de demanda, sazonalidade e compare meses side-by-side.",
                  },
                  {
                    icon: Clock,
                    title: "Tempo médio de atendimento",
                    desc: "Identifique gargalos por etapa e otimize o tempo de resposta da equipe.",
                  },
                  {
                    icon: Search,
                    title: "Histórico por equipamento",
                    desc: "Rastreie cada equipamento — quantas vezes entrou, quais defeitos, quais peças.",
                  },
                  {
                    icon: Package,
                    title: "Controle de peças e insumos",
                    desc: "Vincule peças às ordens e acompanhe o consumo de estoque automaticamente.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "#dce8f5" }}
                    >
                      <item.icon size={16} style={{ color: "#1c4d8d" }} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm mb-0.5">
                        {item.title}
                      </div>
                      <div className="text-muted-foreground text-sm leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock dashboard panel */}
            <div className="rounded-xl border border-border overflow-hidden shadow-xl bg-card">
              {/* Topbar */}
              <div
                className="px-5 py-3 border-b border-border flex items-center justify-between"
                style={{ background: "#0f2854" }}
              >
                <div className="flex items-center gap-2">
                  <Wrench size={14} className="text-blue-300" />
                  <span className="text-white text-sm font-['Barlow_Condensed'] font-bold tracking-wider">
                    SOS Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-300 text-xs">Ao vivo</span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* KPI row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "OS Abertas", value: "24", delta: "+3 hoje" },
                    { label: "Concluídas", value: "18", delta: "+5 hoje" },
                    { label: "Aguardando", value: "6", delta: "−2 hoje" },
                  ].map((k) => (
                    <div
                      key={k.label}
                      className="rounded-lg p-3 border border-border bg-background"
                    >
                      <div className="text-muted-foreground text-xs mb-1">
                        {k.label}
                      </div>
                      <div className="font-['Barlow_Condensed'] font-bold text-2xl text-foreground">
                        {k.value}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "#4988c4" }}
                      >
                        {k.delta}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini chart bars */}
                <div className="rounded-lg p-4 border border-border bg-background">
                  <div className="text-xs text-muted-foreground mb-3 font-['Barlow'] uppercase tracking-wider">
                    OS por dia — última semana
                  </div>
                  <div className="flex items-end gap-2 h-20">
                    {[65, 80, 45, 90, 70, 85, 60].map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm transition-all"
                        style={{
                          height: `${v}%`,
                          background: i === 5 ? "#4988c4" : "#dce8f5",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                      (d) => (
                        <span
                          key={d}
                          className="text-xs text-muted-foreground flex-1 text-center"
                        >
                          {d}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* OS list */}
                <div className="space-y-2">
                  {[
                    {
                      id: "#0849",
                      client: "Ana Paula Silva",
                      status: "Em execução",
                      color: "#4988c4",
                    },
                    {
                      id: "#0848",
                      client: "Roberto Mendes",
                      status: "Aguardando peça",
                      color: "#f59e0b",
                    },
                    {
                      id: "#0847",
                      client: "Marco Rodrigues",
                      status: "Concluído",
                      color: "#10b981",
                    },
                  ].map((os) => (
                    <div
                      key={os.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-background"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-['JetBrains_Mono'] text-muted-foreground">
                          {os.id}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {os.client}
                        </span>
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border font-medium"
                        style={{
                          color: os.color,
                          borderColor: `${os.color}40`,
                          background: `${os.color}10`,
                        }}
                      >
                        {os.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section
        id="tecnologia"
        className="py-24 border-t border-border bg-background"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12" style={{ background: "#4988c4" }} />
              <span
                className="text-xs font-['Barlow'] uppercase tracking-widest font-semibold"
                style={{ color: "#4988c4" }}
              >
                Arquitetura
              </span>
              <div className="h-px w-12" style={{ background: "#4988c4" }} />
            </div>
            <h2
              className="font-['Barlow_Condensed'] font-bold text-foreground leading-tight"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              STACK MODERNO, ROBUSTO E ESCALÁVEL
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Tecnologias comprovadas em produção, integradas via Docker Compose
              para deploy simples e infraestrutura previsível.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stack.map((tech) => (
              <div
                key={tech.name}
                className="bg-card border border-border rounded-xl p-5 text-center hover:border-accent transition-colors group"
              >
                <div className="text-3xl mb-3">{tech.icon}</div>
                <div className="font-['Barlow_Condensed'] font-bold text-foreground text-lg tracking-wide mb-1">
                  {tech.name}
                </div>
                <div className="text-muted-foreground text-xs leading-snug">
                  {tech.role}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Seguro por padrão",
                desc: "Autenticação robusta, roles e permissões granulares, dados isolados por tenant.",
              },
              {
                icon: Smartphone,
                title: "Mobile-first",
                desc: "Interface Ionic / Angular otimizada para técnicos em campo com qualquer dispositivo.",
              },
              {
                icon: Layers,
                title: "API REST completa",
                desc: "Backend Laravel expõe endpoints documentados para integrações com ERPs e sistemas externos.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-xl p-6 flex items-start gap-4"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "#dce8f5" }}
                >
                  <item.icon size={18} style={{ color: "#1c4d8d" }} />
                </div>
                <div>
                  <div className="font-['Barlow_Condensed'] font-bold text-foreground text-lg mb-1">
                    {item.title}
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        id="contato"
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f2854 0%, #1c4d8d 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="font-['Barlow_Condensed'] font-bold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            IMPLANTOU E PRECISA DE SUPORTE?
          </h2>
          <p className="text-blue-200 text-lg mb-10 leading-relaxed">
            Entre em contato para descobrir como o suporte pode lhe ajudar na
            sua oficina — sem papel, sem atraso, sem OS perdida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <input
              type="email"
              placeholder="Seu nome completo"
              className="px-5 py-3 rounded text-sm text-white flex-1 max-w-xs border border-blue-500/40 outline-none focus:border-blue-400 placeholder:text-blue-400 font-['Figtree']"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <button
              className="px-6 py-3 rounded font-semibold text-sm text-white whitespace-nowrap transition-all"
              style={{ background: "#4988c4", cursor: "pointer" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#5a9fd4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#4988c4";
              }}
              onClick={() =>
                window.open("https://wa.me/" + "5522992085464", "_blank")
              }
            >
              Entrar em contato <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-blue-300 text-sm">
            {["Sem custo"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="border-t"
        style={{ background: "#070e1f", borderColor: "rgba(73,136,196,0.15)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ background: "#4988c4" }}
              >
                <Wrench size={16} className="text-white" />
              </div>
              <span className="font-['Barlow_Condensed'] font-bold text-xl text-white tracking-wider">
                SOS
              </span>
            </div>
            <p className="text-blue-400 text-sm leading-relaxed max-w-xs mb-4">
              Sistema de Ordem de Serviço para oficinas mecânicas, assistências
              técnicas e centros de reparos. Do laudo à entrega, tudo sob
              controle.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-500 font-['JetBrains_Mono']">
              <Database size={12} />
              PostgreSQL · Laravel · Ionic · Docker
            </div>
          </div>

          <div>
            <div className="text-xs font-['Barlow'] uppercase tracking-widest text-blue-500 mb-4">
              Sistema
            </div>
            <ul className="space-y-2">
              {[
                "Funcionalidades",
                "Como Funciona",
                "Dashboard",
                "Painel Externo",
                "API",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-['Barlow'] uppercase tracking-widest text-blue-500 mb-4">
              Contato
            </div>
            <ul className="space-y-2">
              {[
                "Solicitar Demo",
                "Suporte Técnico",
                "Documentação",
                "Status do Sistema",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="border-t max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: "rgba(73,136,196,0.1)" }}
        >
          <span className="text-blue-600 text-xs">
            © 2026 SOS · GK. Todos os direitos reservados.
          </span>
        </div>
      </footer>
    </div>
  );
}
