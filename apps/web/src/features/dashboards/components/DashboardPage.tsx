"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  Heart,
  Instagram,
  MessageCircleMore,
  Minus,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  Users,
  UserRound,
  Zap,
} from "lucide-react";

type Metric = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  accent: string;
  points: number[];
};

type TeamMember = {
  name: string;
  specialty: string;
  procedures: number;
  satisfaction: string;
  accent: string;
};

type SourceRow = {
  name: string;
  percent: number;
  accent: string;
  icon: LucideIcon;
};

type StepRow = {
  label: string;
  count: number;
  percent: number;
};

type QualityCard = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  accent: string;
};

type AlertItem = {
  title: string;
  action: string;
  icon: LucideIcon;
  accent: string;
};

const metrics: Metric[] = [
  {
    label: "Novos pacientes",
    value: "156",
    delta: "+12,4%",
    icon: Users,
    accent: "from-[#eaf8ef] to-[#f6fff9] text-[#159a4a]",
    points: [7, 8, 10, 9, 11, 9, 8, 9, 10, 9, 11, 13],
  },
  {
    label: "Taxa de fidelizacao",
    value: "68,6%",
    delta: "+4,2 p.p.",
    icon: Star,
    accent: "from-[#f3efff] to-[#faf7ff] text-[#8f5af7]",
    points: [8, 9, 10, 11, 9, 8, 8, 10, 9, 11, 9, 10],
  },
  {
    label: "Taxa de comparecimento",
    value: "78,4%",
    delta: "+6,1 p.p.",
    icon: CalendarCheck2,
    accent: "from-[#ecfbfb] to-[#f7fefe] text-[#14b8a6]",
    points: [8, 9, 8, 11, 10, 9, 8, 9, 10, 11, 9, 8],
  },
  {
    label: "Tempo medio de atendimento",
    value: "68 min",
    delta: "- 8 min",
    icon: Clock3,
    accent: "from-[#fff5e7] to-[#fffaf1] text-[#f59e0b]",
    points: [10, 9, 8, 11, 9, 8, 9, 10, 9, 8, 9, 10],
  },
  {
    label: "Indice de satisfacao",
    value: "4,9 / 5",
    delta: "+0,2",
    icon: Heart,
    accent: "from-[#fff0f6] to-[#fff7fb] text-[#ff4d7d]",
    points: [8, 9, 9, 10, 8, 8, 9, 10, 9, 10, 11, 10],
  },
];

const team: TeamMember[] = [
  { name: "Dra. Juliana Silva", specialty: "Harmonizacao Facial", procedures: 48, satisfaction: "4,9", accent: "bg-[#f2fbf5] text-[#159a4a]" },
  { name: "Dr. Pedro Costa", specialty: "Implantodontia", procedures: 35, satisfaction: "4,8", accent: "bg-[#eef6ff] text-[#2f6fed]" },
  { name: "Dra. Ana Oliveira", specialty: "Dermatologia", procedures: 29, satisfaction: "4,9", accent: "bg-[#f7f2ff] text-[#8f5af7]" },
  { name: "Dra. Carla Mendes", specialty: "Odontologia", procedures: 26, satisfaction: "4,7", accent: "bg-[#fff7e8] text-[#f59e0b]" },
  { name: "Dr. Lucas Martins", specialty: "Clareamento", procedures: 22, satisfaction: "4,8", accent: "bg-[#fff0f6] text-[#ff4d7d]" },
];

const sources: SourceRow[] = [
  { name: "Instagram", percent: 42, accent: "bg-[#f04888]", icon: Instagram },
  { name: "Indicação", percent: 28, accent: "bg-[#22c55e]", icon: Users },
  { name: "Google", percent: 18, accent: "bg-[#60a5fa]", icon: MessageCircleMore },
  { name: "WhatsApp", percent: 7, accent: "bg-[#16c964]", icon: MessageCircleMore },
  { name: "Outros", percent: 5, accent: "bg-[#c7cdd8]", icon: Minus },
];

const steps: StepRow[] = [
  { label: "Primeiro contato", count: 512, percent: 100 },
  { label: "Consulta realizada", count: 312, percent: 61 },
  { label: "Em tratamento", count: 198, percent: 39 },
  { label: "Procedimento realizado", count: 156, percent: 31 },
];

const quality: QualityCard[] = [
  { label: "Reclamacoes", value: "2", delta: "-33% vs mes anterior", icon: CircleCheckBig, accent: "from-[#f1fbf5] to-[#f7fffb] text-[#159a4a]" },
  { label: "Elogios", value: "47", delta: "+18% vs mes anterior", icon: ThumbsUp, accent: "from-[#f2fbf5] to-[#f8fffb] text-[#159a4a]" },
  { label: "Retorno em 90 dias", value: "64%", delta: "+5 p.p. vs mes anterior", icon: ArrowUpRight, accent: "from-[#eff7ff] to-[#f8fbff] text-[#2f6fed]" },
  { label: "Procedimentos recorrentes", value: "36%", delta: "+7 p.p. vs mes anterior", icon: Target, accent: "from-[#f3efff] to-[#faf8ff] text-[#8f5af7]" },
];

const alerts: AlertItem[] = [
  {
    title: "3 pacientes estao ha mais de 60 dias sem retorno.",
    action: "Ver pacientes",
    icon: Sparkles,
    accent: "text-[#f59e0b]",
  },
  {
    title: "Taxa de no-show acima da media as tercas-feiras.",
    action: "Ver analise",
    icon: Zap,
    accent: "text-[#8f5af7]",
  },
  {
    title: "O horario das 10h as 12h tem alta demanda.",
    action: "Ver horarios",
    icon: CheckCircle2,
    accent: "text-[#159a4a]",
  },
  {
    title: "Campanha de indicacao com alto potencial.",
    action: "Ver campanha",
    icon: UserRound,
    accent: "text-[#2f6fed]",
  },
];

function sparkPath(points: number[], width = 220, height = 58) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);
  const step = width / Math.max(points.length - 1, 1);

  return points
    .map((point, index) => {
      const x = index * step;
      const y = height - ((point - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  return (
    <svg viewBox="0 0 220 58" className="h-[58px] w-full">
      <path d={sparkPath(points)} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  const color =
    metric.accent.includes("159a4a")
      ? "#159a4a"
      : metric.accent.includes("8f5af7")
        ? "#8f5af7"
        : metric.accent.includes("14b8a6")
          ? "#14b8a6"
          : metric.accent.includes("f59e0b")
            ? "#f59e0b"
            : "#ff4d7d";

  return (
    <article className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${metric.accent}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="mt-4 text-[14px] font-medium text-slate-700">{metric.label}</p>
      <p className="mt-2 text-[29px] font-bold tracking-[-0.04em] text-slate-900">{metric.value}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
        <span className="font-semibold text-[#159a4a]">{metric.delta}</span>
        <span className="text-slate-500">vs mes anterior</span>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 px-2 py-2">
        <Sparkline points={metric.points} color={color} />
      </div>
    </article>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 flex-1 rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function Donut() {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { stroke: "#159a4a", value: 0.82 },
    { stroke: "#14b8a6", value: 0.18 },
  ];

  let offset = 0;

  return (
    <svg viewBox="0 0 140 140" className="mx-auto h-[140px] w-[140px]">
      <circle cx="70" cy="70" r={radius} fill="none" stroke="#edf2f7" strokeWidth="14" />
      {segments.map((segment) => {
        const dash = circumference * segment.value;
        const circle = (
          <circle
            key={segment.stroke}
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={segment.stroke}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 70 70)"
          />
        );
        offset += dash;
        return circle;
      })}
      <text x="70" y="66" textAnchor="middle" className="fill-slate-900 text-[18px] font-bold">
        82%
      </text>
      <text x="70" y="86" textAnchor="middle" className="fill-slate-500 text-[10px] font-medium">
        Taxa de ocupacao
      </text>
    </svg>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-[14px] text-slate-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function DashboardPage() {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)_minmax(0,0.95fr)]">
        <SectionCard
          title="Performance da equipe"
          subtitle="Produtividade por profissional"
          action={<div />}
        >
          <div className="space-y-4">
            {team.map((member) => (
              <div key={member.name} className="grid grid-cols-[minmax(0,1fr)_180px_64px] items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${member.accent} text-[12px] font-bold`}>
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-slate-900">{member.name}</p>
                    <p className="truncate text-[12px] text-slate-500">{member.specialty}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-slate-500">Procedimentos</span>
                  <Bar value={Math.max((member.procedures / 50) * 100, 18)} color="bg-[#22c55e]" />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <span className="text-[12px] text-slate-500">Satisfacao</span>
                  <span className="text-[14px] font-semibold text-[#159a4a]">{member.satisfaction}</span>
                  <Star size={13} className="text-[#159a4a]" fill="currentColor" />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboards/desempenho"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[14px] font-semibold text-[#159a4a] shadow-sm"
          >
            Ver desempenho completo
            <ArrowRight size={16} />
          </Link>
        </SectionCard>

        <SectionCard
          title="Ocupacao da agenda"
          subtitle="Media de ocupacao dos horarios"
          action={<div />}
        >
          <div className="grid items-center gap-5 md:grid-cols-[220px_1fr]">
            <Donut />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
                <span className="text-[13px] text-slate-500">Agendados</span>
                <span className="ml-auto text-[13px] font-semibold text-slate-700">82%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#14b8a6]" />
                <span className="text-[13px] text-slate-500">Disponiveis</span>
                <span className="ml-auto text-[13px] font-semibold text-slate-700">18%</span>
              </div>
            </div>
          </div>

          <Link
            href="/agenda"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[14px] font-semibold text-[#159a4a] shadow-sm"
          >
            Ver agenda completa
            <ArrowRight size={16} />
          </Link>
        </SectionCard>

        <SectionCard
          title="Origem dos pacientes"
          subtitle="Canais que mais trazem pacientes"
          action={<div />}
        >
          <div className="space-y-5">
            {sources.map((source) => {
              const Icon = source.icon;
              return (
                <div key={source.name} className="grid grid-cols-[24px_minmax(0,1fr)_46px] items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
                    <Icon size={16} className={source.accent.replace("bg-", "text-")} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-medium text-slate-900">{source.name}</span>
                    <Bar value={source.percent} color={source.accent} />
                  </div>
                  <span className="text-right text-[14px] font-semibold text-slate-700">{source.percent}%</span>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboards/canais"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[14px] font-semibold text-[#159a4a] shadow-sm"
          >
            Ver todos os canais
            <ArrowRight size={16} />
          </Link>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,1.05fr)]">
        <SectionCard
          title="Taxa de conversao por etapa"
          subtitle="Funil desde o primeiro contato ate o procedimento"
          action={<div />}
        >
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.label} className="space-y-2">
                <div className="grid grid-cols-[minmax(0,1fr)_54px_54px] items-center gap-3">
                  <div className="h-9 rounded-full bg-[#edf8f1] p-1">
                    <div
                      className="h-7 rounded-full bg-[#aee3be]"
                      style={{ width: `${step.percent}%` }}
                    />
                  </div>
                  <span className="text-right text-[13px] font-medium text-slate-700">{step.count}</span>
                  <span className="text-right text-[13px] font-medium text-slate-500">
                    {step.percent === 100 ? "" : `${step.percent}%`}
                  </span>
                </div>
                <div className="px-1 text-[13px] text-slate-600">{step.label}</div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboards/funil"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[14px] font-semibold text-[#159a4a] shadow-sm"
          >
            Ver funil completo
            <ArrowRight size={16} />
          </Link>
        </SectionCard>

        <SectionCard title="Indicadores de qualidade" subtitle="" action={<div />}>
          <div className="grid gap-4 md:grid-cols-2">
            {quality.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[18px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white ${item.accent}`}>
                    <Icon size={18} />
                  </div>
                  <p className="mt-3 text-[13px] text-slate-500">{item.label}</p>
                  <p className="mt-1 text-[26px] font-bold tracking-[-0.04em] text-slate-900">{item.value}</p>
                  <p className="mt-2 text-[12px] font-medium text-[#159a4a]">{item.delta}</p>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboards/qualidade"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[14px] font-semibold text-[#159a4a] shadow-sm"
          >
            Ver relatorio completo
            <ArrowRight size={16} />
          </Link>
        </SectionCard>

        <SectionCard title="Alertas e oportunidades" subtitle="" action={<div />}>
          <div className="space-y-4">
            {alerts.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-3 rounded-[16px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-white ${item.accent}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] leading-6 text-slate-700">{item.title}</p>
                    <button className="mt-1 text-[13px] font-semibold text-[#159a4a]">
                      {item.action} <ArrowRight size={14} className="inline" />
                    </button>
                  </div>
                  <ChevronRight size={16} className="mt-1 text-slate-300" />
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboards/recomendacoes"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[14px] font-semibold text-[#159a4a] shadow-sm"
          >
            Ver todas as recomendacoes
            <ArrowRight size={16} />
          </Link>
        </SectionCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
    </div>
  );
}
