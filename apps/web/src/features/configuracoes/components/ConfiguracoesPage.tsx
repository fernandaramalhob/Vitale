"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Database,
  Download,
  Bell,
  Filter,
  Globe2,
  History,
  LockKeyhole,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium,
  ToggleLeft,
  Users,
  Zap,
} from "lucide-react";

type Metric = {
  label: string;
  value: string;
  delta: string;
  tone: "green" | "amber" | "red";
  icon: LucideIcon;
  accent: string;
  points: number[];
};

type RecentConfig = {
  date: string;
  description: string;
  category: string;
  type: string;
  status: string;
  owner: string;
  statusTone: "green" | "amber" | "red";
};

type SummaryItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
};

type Integration = {
  name: string;
  description: string;
  status: string;
  icon: LucideIcon;
  accent: string;
};

const metrics: Metric[] = [
  {
    label: "Perfis ativos",
    value: "18",
    delta: "+2 este mês",
    tone: "green",
    icon: Users,
    accent: "from-[#eaf8ef] to-[#f6fff9] text-[#159a4a]",
    points: [6, 7, 8, 8, 9, 8, 9, 10, 10, 11, 11, 12],
  },
  {
    label: "Integrações",
    value: "7",
    delta: "5 conectadas",
    tone: "amber",
    icon: Globe2,
    accent: "from-[#eff7ff] to-[#f8fbff] text-[#2f6fed]",
    points: [7, 7, 8, 9, 8, 9, 10, 9, 10, 11, 10, 11],
  },
  {
    label: "Segurança",
    value: "94%",
    delta: "+3 p.p.",
    tone: "green",
    icon: ShieldCheck,
    accent: "from-[#f3efff] to-[#faf8ff] text-[#8f5af7]",
    points: [7, 8, 8, 9, 10, 10, 11, 10, 11, 12, 12, 13],
  },
  {
    label: "Automações",
    value: "24",
    delta: "+8 ativas",
    tone: "green",
    icon: Bot,
    accent: "from-[#fff5e7] to-[#fffaf1] text-[#f59e0b]",
    points: [8, 9, 9, 10, 10, 11, 11, 12, 11, 12, 12, 13],
  },
];

const recentConfigs: RecentConfig[] = [
  {
    date: "14/05/2026",
    description: "Identidade visual atualizada",
    category: "Marca",
    type: "Preferência",
    status: "Salva",
    owner: "Juliana Silva",
    statusTone: "green",
  },
  {
    date: "13/05/2026",
    description: "Permissões da recepção revisadas",
    category: "Acesso",
    type: "Segurança",
    status: "Em revisão",
    owner: "Carlos Eduardo",
    statusTone: "amber",
  },
  {
    date: "12/05/2026",
    description: "Integração WhatsApp validada",
    category: "Integrações",
    type: "Automação",
    status: "Ativa",
    owner: "Sistema",
    statusTone: "green",
  },
  {
    date: "10/05/2026",
    description: "Agenda padrão da clínica ajustada",
    category: "Operação",
    type: "Fluxo",
    status: "Pendente",
    owner: "Ana Oliveira",
    statusTone: "red",
  },
  {
    date: "08/05/2026",
    description: "Backup diário confirmado",
    category: "Segurança",
    type: "Rotina",
    status: "Salva",
    owner: "Sistema",
    statusTone: "green",
  },
];

const summaryItems: SummaryItem[] = [
  {
    label: "Última alteração",
    value: "Hoje, 08:15",
    icon: History,
    tone: "text-[#159a4a]",
  },
  {
    label: "Alertas pendentes",
    value: "2 itens",
    icon: Bell,
    tone: "text-[#ef4444]",
  },
  {
    label: "Backup diário",
    value: "Executado",
    icon: Database,
    tone: "text-[#2f6fed]",
  },
  {
    label: "Ambiente",
    value: "Online",
    icon: CheckCircle2,
    tone: "text-[#159a4a]",
  },
];

const integrations: Integration[] = [
  {
    name: "WhatsApp",
    description: "Mensagens automáticas e lembretes.",
    status: "Ativo",
    icon: Bot,
    accent: "bg-[#f2fbf5] text-[#159a4a]",
  },
  {
    name: "Google Calendar",
    description: "Sincronização de agenda e eventos.",
    status: "Ativo",
    icon: Clock3,
    accent: "bg-[#eef6ff] text-[#2f6fed]",
  },
  {
    name: "Pagamentos",
    description: "Cartão, PIX e links de cobrança.",
    status: "Conectado",
    icon: CreditCard,
    accent: "bg-[#fff7e8] text-[#f59e0b]",
  },
  {
    name: "Backup",
    description: "Cópia de segurança diária.",
    status: "Automático",
    icon: Database,
    accent: "bg-[#f3efff] text-[#8f5af7]",
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
  const color = metric.tone === "green" ? "#159a4a" : metric.tone === "amber" ? "#f59e0b" : "#ef4444";

  return (
    <article className="rounded-[22px] border border-[#e4ebf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${metric.accent}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="mt-4 text-[14px] font-medium text-slate-700">{metric.label}</p>
      <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900">{metric.value}</p>
      <div className="mt-2 flex items-center gap-2 text-[13px]">
        <span className="font-semibold" style={{ color }}>
          {metric.delta}
        </span>
        <span className="text-slate-500">vs mês anterior</span>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 px-2 py-2">
        <Sparkline points={metric.points} color={color} />
      </div>
    </article>
  );
}

function StatusPill({ tone, children }: { tone: "green" | "amber" | "red"; children: ReactNode }) {
  const classes =
    tone === "green"
      ? "bg-[#f2fbf5] text-[#159a4a]"
      : tone === "amber"
        ? "bg-[#fff7e8] text-[#f59e0b]"
        : "bg-[#fff1f1] text-[#ef4444]";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${classes}`}>{children}</span>;
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
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

function DonutChart() {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { stroke: "#159a4a", value: 0.54 },
    { stroke: "#2f6fed", value: 0.26 },
    { stroke: "#f59e0b", value: 0.14 },
    { stroke: "#8f5af7", value: 0.06 },
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
        94%
      </text>
      <text x="70" y="86" textAnchor="middle" className="fill-slate-500 text-[10px] font-medium">
        cobertura
      </text>
    </svg>
  );
}

export function ConfiguracoesPage() {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <SectionCard
          title="Configurações recentes"
          subtitle="Movimentações e ajustes da clínica"
          action={
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 shadow-sm">
                <Download size={14} className="mr-2 inline-block" />
                Exportar
              </button>
              <button className="text-[13px] font-semibold text-[#159a4a]">Ver todos</button>
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-[#dfe6ef] bg-white px-2 py-2">
            {["Todas", "Marca", "Acesso", "Integrações", "Segurança"].map((item, index) => (
              <button
                key={item}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  index === 0 ? "bg-[#f1fbf4] text-[#159a4a]" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-[16px] border border-[#edf1f4]">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1f4] bg-white">
                {recentConfigs.map((item) => (
                  <tr key={`${item.date}-${item.description}`} className="text-[13px] text-slate-700">
                    <td className="px-4 py-4 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{item.description}</td>
                    <td className="px-4 py-4">{item.category}</td>
                    <td className="px-4 py-4">{item.type}</td>
                    <td className="px-4 py-4">
                      <StatusPill tone={item.statusTone}>{item.status}</StatusPill>
                    </td>
                    <td className="px-4 py-4">{item.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <aside className="space-y-4">
          <SectionCard
            title="Resumo do ambiente"
            subtitle="Visão rápida das configurações"
            action={<span className="rounded-full bg-[#f2fbf5] px-2.5 py-1 text-[12px] font-semibold text-[#159a4a]">Online</span>}
          >
            <div className="space-y-4">
              {summaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 ${item.tone}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-slate-500">{item.label}</p>
                      <p className="mt-1 text-[14px] font-semibold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#d7e6dc] bg-white text-[14px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f7fffa]">
              Ver painel completo
              <ArrowRight size={16} />
            </button>
          </SectionCard>

          <SectionCard
            title="Integrações conectadas"
            subtitle="Serviços e ferramentas vinculados"
            action={<button className="text-[13px] font-semibold text-[#159a4a]">Ver todas</button>}
          >
            <div className="space-y-3">
              {integrations.map((integration) => {
                const Icon = integration.icon;
                return (
                  <div key={integration.name} className="flex items-center gap-3 rounded-[16px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${integration.accent}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-slate-900">{integration.name}</p>
                      <p className="text-[13px] text-slate-500">{integration.description}</p>
                    </div>
                    <StatusPill tone="green">{integration.status}</StatusPill>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <SectionCard
          title="Pendências de revisão"
          subtitle="Itens que precisam de atenção da equipe"
          action={<button className="text-[13px] font-semibold text-[#159a4a]">Ver todos</button>}
        >
          <div className="overflow-hidden rounded-[16px] border border-[#edf1f4]">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Última ação</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1f4] bg-white">
                {[
                  ["Permissões da recepção", "Acesso", "Hoje, 08:10", "Em revisão", "amber"],
                  ["Agenda padrão", "Operação", "Hoje, 07:32", "Pendente", "red"],
                  ["Backup diário", "Segurança", "Ontem, 23:15", "Salvo", "green"],
                ].map(([item, category, action, status, tone]) => (
                  <tr key={item} className="text-[13px] text-slate-700">
                    <td className="px-4 py-4 font-medium text-slate-900">{item}</td>
                    <td className="px-4 py-4">{category}</td>
                    <td className="px-4 py-4">{action}</td>
                    <td className="px-4 py-4">
                      <StatusPill tone={tone as "green" | "amber" | "red"}>{status}</StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#d7e6dc] bg-white text-[14px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f7fffa]">
            Ver fluxo completo
            <ArrowRight size={16} />
          </button>
        </SectionCard>

        <SectionCard
          title="Cobertura de segurança"
          subtitle="Resumo do nível de proteção"
          action={<button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 shadow-sm">Este mês</button>}
        >
          <div className="flex items-center justify-center">
            <DonutChart />
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["Permissões", "98%", "#159a4a"],
              ["Backups", "94%", "#2f6fed"],
              ["Automações", "86%", "#f59e0b"],
              ["Alertas", "72%", "#8f5af7"],
            ].map(([label, value, color]) => (
              <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-slate-700">{label}</span>
                </div>
                <span className="font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <SectionCard
          title="Atividades recentes"
          subtitle="Acompanhe alterações e acessos"
          action={<div />}
        >
          <div className="space-y-3">
            {[
              ["Juliana Silva", "alterou permissões da recepção", "Há 20 min"],
              ["Sistema", "sincronizou integrações da agenda", "Há 1 h"],
              ["Carlos Eduardo", "ativou alerta de retorno", "Há 2 h"],
              ["Ana Oliveira", "atualizou identidade visual", "Há 4 h"],
            ].map(([actor, action, time]) => (
              <div key={`${actor}-${time}`} className="rounded-[16px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                <p className="text-[14px] font-semibold text-slate-900">{actor}</p>
                <p className="mt-1 text-[13px] text-slate-500">{action}</p>
                <p className="mt-2 text-[12px] text-slate-400">{time}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Ações rápidas"
          subtitle="Ajustes que a equipe usa com frequência"
          action={<div />}
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Tema escuro", icon: MoonStar },
              { label: "Tema claro", icon: SunMedium },
              { label: "Integrações", icon: Zap },
              { label: "Segurança", icon: LockKeyhole },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="flex min-h-[84px] flex-col items-start justify-between rounded-[18px] border border-[#edf1f4] bg-[#fbfcfd] p-4 text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#159a4a]">
                    <Icon size={18} />
                  </div>
                  <p className="text-[13px] font-semibold text-slate-900">{item.label}</p>
                </button>
              );
            })}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
