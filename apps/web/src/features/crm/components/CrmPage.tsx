import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  DollarSign,
  FileText,
  HeartPulse,
  Mail,
  MessageSquareMore,
  MoreVertical,
  PhoneCall,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StatCard = {
  label: string;
  value: string;
  delta: string;
  accent: string;
  icon: LucideIcon;
  points: number[];
};

type PatientRow = {
  name: string;
  role: string;
  motive: string;
  lastInteraction: string;
  priority: "Alta" | "Média" | "Baixa";
  action: string;
  accent: string;
};

type ActivityRow = {
  name: string;
  action: string;
  time: string;
  avatar: string;
};

const stats: StatCard[] = [
  {
    label: "Pacientes ativos",
    value: "892",
    delta: "+12,5%",
    accent: "text-[#159a4a]",
    icon: Users,
    points: [8, 10, 11, 13, 12, 14, 16, 13, 12, 14, 17, 20],
  },
  {
    label: "Consultas realizadas",
    value: "1.245",
    delta: "+8,3%",
    accent: "text-[#2967d6]",
    icon: CalendarDays,
    points: [7, 9, 10, 11, 13, 12, 10, 12, 14, 13, 15, 16],
  },
  {
    label: "Taxa de retorno",
    value: "68,4%",
    delta: "+6,1 p.p.",
    accent: "text-[#8f5af7]",
    icon: TrendingUp,
    points: [8, 7, 8, 9, 10, 12, 13, 10, 11, 12, 10, 14],
  },
  {
    label: "Faturamento",
    value: "R$ 186.430,00",
    delta: "+15,7%",
    accent: "text-[#1ea9c0]",
    icon: DollarSign,
    points: [10, 11, 10, 12, 13, 11, 14, 13, 14, 16, 15, 18],
  },
];

const journey = [
  { label: "Novo contato", value: "238 pacientes", accent: "text-[#159a4a]", bg: "bg-[#f2fbf5]" },
  { label: "Primeira consulta", value: "172 pacientes", accent: "text-[#2563eb]", bg: "bg-[#f3f7ff]" },
  { label: "Em tratamento", value: "328 pacientes", accent: "text-[#8f5af7]", bg: "bg-[#faf6ff]" },
  { label: "Manutenção", value: "96 pacientes", accent: "text-[#0ea5b7]", bg: "bg-[#f2fbfc]" },
  { label: "Inativos", value: "58 pacientes", accent: "text-slate-500", bg: "bg-slate-50" },
];

const attentionPatients: PatientRow[] = [
  {
    name: "Mariana Oliveira",
    role: "Harmonização facial",
    motive: "Retorno atrasado",
    lastInteraction: "15/05/2025",
    priority: "Alta",
    action: "Retorno em atraso",
    accent: "bg-[#f2fbf5] text-[#159a4a]",
  },
  {
    name: "Lucas Martins",
    role: "Implante dentário",
    motive: "Necessita revisão",
    lastInteraction: "10/05/2025",
    priority: "Alta",
    action: "Agendar retorno",
    accent: "bg-[#fff4f4] text-[#ef4444]",
  },
  {
    name: "Juliana Santos",
    role: "Tratamento ortodôntico",
    motive: "Follow-up",
    lastInteraction: "05/05/2025",
    priority: "Média",
    action: "Enviar lembrete",
    accent: "bg-[#fff8ed] text-[#f59e0b]",
  },
  {
    name: "Carlos Eduardo",
    role: "Clareamento dental",
    motive: "Avaliar evolução",
    lastInteraction: "02/05/2025",
    priority: "Média",
    action: "Avaliar evolução",
    accent: "bg-[#fff8ed] text-[#f59e0b]",
  },
  {
    name: "Beatriz Lima",
    role: "Toxina botulínica",
    motive: "Acompanhamento",
    lastInteraction: "28/04/2025",
    priority: "Baixa",
    action: "Follow-up",
    accent: "bg-[#f2fbf5] text-[#159a4a]",
  },
];

const insights = [
  {
    icon: MessageSquareMore,
    accent: "text-[#14b8a6]",
    title: "23 pacientes estão há mais de 90 dias sem retorno.",
  },
  {
    icon: Sparkles,
    accent: "text-[#22c55e]",
    title: "12 pacientes têm perfil para novos procedimentos.",
  },
  {
    icon: PhoneCall,
    accent: "text-[#ef4444]",
    title: "8 pacientes apresentaram alta taxa de faltas.",
  },
  {
    icon: TrendingUp,
    accent: "text-[#159a4a]",
    title: "A taxa de retorno de harmonização aumentou 6,1% este mês.",
  },
];

const activities: ActivityRow[] = [
  {
    name: "Juliana Pereira",
    action: "realizou check-in para consulta hoje às 14:00",
    time: "Há 20 min",
    avatar: "JP",
  },
  {
    name: "Carlos Eduardo",
    action: "reagendou sua consulta",
    time: "Há 1 h",
    avatar: "CE",
  },
  {
    name: "Mariana Oliveira",
    action: "avaliou o tratamento com 5 estrelas",
    time: "Há 2 h",
    avatar: "MO",
  },
  {
    name: "Lucas Martins",
    action: "recebeu orçamento de clareamento",
    time: "Há 3 h",
    avatar: "LM",
  },
  {
    name: "Beatriz Lima",
    action: "confirmou retorno para 25/05",
    time: "Há 4 h",
    avatar: "BL",
  },
];

const specialties = [
  { name: "Harmonização Facial", value: "R$ 58.230", accent: "text-[#159a4a]", icon: HeartPulse, delta: "+18,2%" },
  { name: "Implantodontia", value: "R$ 46.120", accent: "text-[#2563eb]", icon: Stethoscope, delta: "+12,7%" },
  { name: "Odontologia Estética", value: "R$ 32.840", accent: "text-[#8f5af7]", icon: FileText, delta: "+9,3%" },
  { name: "Dermatologia", value: "R$ 28.450", accent: "text-[#0ea5b7]", icon: Activity, delta: "+14,1%" },
  { name: "Ortodontia", value: "R$ 20.790", accent: "text-[#a855f7]", icon: CircleUserRound, delta: "+7,8%" },
];

function sparkPath(points: number[], width = 200, height = 58) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);
  const step = width / Math.max(points.length - 1, 1);

  return points
    .map((point, index) => {
      const x = index * step;
      const normalized = (point - min) / range;
      const y = height - normalized * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const d = sparkPath(points);

  return (
    <svg viewBox="0 0 200 58" className="h-[58px] w-full">
      <path d={d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      {points.map((point, index) => {
        const min = Math.min(...points);
        const max = Math.max(...points);
        const range = Math.max(max - min, 1);
        const x = (index / Math.max(points.length - 1, 1)) * 200;
        const y = 58 - ((point - min) / range) * 58;
        return <circle key={`${point}-${index}`} cx={x} cy={y} r="2.3" fill={color} />;
      })}
    </svg>
  );
}

function StatCard({ stat }: { stat: StatCard }) {
  const Icon = stat.icon;

  return (
    <div className="rounded-[18px] border border-[#e6edf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 ${stat.accent}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-[15px] font-medium text-slate-700">{stat.label}</p>
      <p className="mt-3 text-[28px] font-bold tracking-[-0.04em] text-slate-900">{stat.value}</p>
      <div className="mt-2 flex items-center gap-2 text-[13px]">
        <span className="font-semibold text-[#159a4a]">{stat.delta}</span>
        <span className="text-slate-500">vs mês anterior</span>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 px-2 py-2">
        <Sparkline points={stat.points} color={stat.accent.includes("159a4a") ? "#18a44e" : stat.accent.includes("2563eb") ? "#2f6fed" : stat.accent.includes("8f5af7") ? "#8f5af7" : "#1ea9c0"} />
      </div>
    </div>
  );
}

export function CrmPage() {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <aside className="rounded-[18px] border border-[#e6edf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f2fbf5] text-[#159a4a]">
                <Sparkles size={18} />
              </div>
              <h2 className="text-[16px] font-bold tracking-[-0.02em] text-slate-900">
                Insights da IA
              </h2>
            </div>
            <span className="rounded-full bg-[#f2fbf5] px-2.5 py-1 text-[12px] font-semibold text-[#159a4a]">
              IA
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {insights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex gap-3 rounded-[18px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white ${item.accent}`}>
                    <Icon size={20} />
                  </div>
                  <p className="pt-0.5 text-[14px] leading-6 text-slate-700">{item.title}</p>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboards/recomendacoes"
            className="mt-4 flex h-11 w-full items-center justify-center rounded-2xl border border-[#d7e6dc] bg-white text-[14px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f7fffa]"
          >
            Ver todos os insights
          </Link>
        </aside>
      </section>

      <section className="rounded-[18px] border border-[#e6edf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Jornada do paciente
              </h2>
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 text-[11px] text-slate-500">
                i
              </span>
            </div>
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] font-semibold text-slate-700 shadow-sm">
            Este mês
            <ArrowRight size={16} className="rotate-90 text-slate-400" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-5">
          {journey.map((item, index) => (
            <div key={item.label} className={`rounded-[18px] border border-[#edf1f4] ${item.bg} p-4`}>
              <div className={`text-[13px] font-semibold ${item.accent}`}>{item.label}</div>
              <p className="mt-4 text-[24px] font-bold tracking-[-0.04em] text-slate-900">
                {item.value.split(" ")[0]}
              </p>
              <p className="mt-1 text-[13px] text-slate-500">pacientes</p>
              {index < journey.length - 1 ? (
                <div className="absolute" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center gap-3 text-[14px] text-slate-600">
            <span className="font-medium">Taxa de conversão geral: 71,2%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100">
            <div className="h-3 w-[71%] rounded-full bg-gradient-to-r from-[#159a4a] to-[#1ca282]" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.95fr)_330px]">
        <div className="rounded-[18px] border border-[#e6edf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Pacientes que precisam de atenção
              </h2>
              <span className="rounded-full bg-[#f2fbf5] px-2.5 py-1 text-[12px] font-semibold text-[#159a4a]">
                IA
              </span>
            </div>
            <MoreVertical size={18} className="text-slate-400" />
          </div>

          <div className="mt-5 overflow-hidden rounded-[16px] border border-[#edf1f4]">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-4 py-3">Paciente</th>
                  <th className="px-4 py-3">Motivo</th>
                  <th className="px-4 py-3">Última interação</th>
                  <th className="px-4 py-3">Prioridade</th>
                  <th className="px-4 py-3">Ação sugerida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1f4] bg-white">
                {attentionPatients.map((patient, index) => (
                  <tr key={patient.name} className="text-[14px] text-slate-700">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${index % 2 === 0 ? "bg-[#f2fbf5] text-[#159a4a]" : "bg-[#f3f7ff] text-[#2563eb]"}`}>
                          {patient.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <span className="font-semibold text-slate-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">{patient.role}</td>
                    <td className="px-4 py-4">{patient.lastInteraction}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
                          patient.priority === "Alta"
                            ? "bg-red-50 text-red-500"
                            : patient.priority === "Média"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {patient.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button className="inline-flex items-center rounded-full border border-[#b8e5c5] px-3 py-1.5 text-[13px] font-semibold text-[#159a4a]">
                        {patient.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link
            href="/pacientes"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d7e6dc] bg-white px-4 py-3 text-[14px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f7fffa]"
          >
            Ver todos os pacientes que precisam de atenção
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="rounded-[18px] border border-[#e6edf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
              Sugestões da IA
            </h2>
            <span className="rounded-full bg-[#f2fbf5] px-2.5 py-1 text-[12px] font-semibold text-[#159a4a]">
              IA
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {insights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-3 rounded-[18px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#159a4a]">
                    <Icon size={20} />
                  </div>
                  <p className="pt-0.5 text-[14px] leading-6 text-slate-700">{item.title}</p>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboards/recomendacoes"
            className="mt-4 flex h-11 w-full items-center justify-center rounded-2xl border border-[#d7e6dc] bg-white text-[14px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f7fffa]"
          >
            Ver todas as sugestões
          </Link>
        </div>

        <div className="rounded-[18px] border border-[#e6edf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
            Atividades recentes
          </h2>

          <div className="mt-5 space-y-4">
            {activities.map((activity) => (
              <div key={activity.name} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[12px] font-bold text-white">
                  {activity.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] leading-6 text-slate-700">
                    <span className="font-semibold text-slate-900">{activity.name}</span>{" "}
                    {activity.action}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>

          <Link
            href="/configuracoes#atividades-recentes"
            className="mt-4 flex h-11 w-full items-center justify-center rounded-2xl border border-[#d7e6dc] bg-white text-[14px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f7fffa]"
          >
            Ver todas as atividades
          </Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.85fr)]">
        <div className="rounded-[18px] border border-[#e6edf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
              Desempenho por especialidade
            </h2>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] font-semibold text-slate-700 shadow-sm">
              Este mês
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {specialties.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="rounded-[16px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${index === 0 ? "bg-[#f2fbf5]" : "bg-white"} ${item.accent}`}>
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 text-[13px] font-semibold text-slate-700">{item.name}</p>
                  <p className="mt-2 text-[18px] font-bold tracking-[-0.03em] text-slate-900">{item.value}</p>
                  <p className="mt-2 text-[12px] font-semibold text-[#159a4a]">{item.delta}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-[#e6f2e9] bg-[linear-gradient(135deg,#f6fffa_0%,#eefcf1_45%,#ffffff_100%)] p-6 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <h2 className="text-[18px] font-bold tracking-[-0.03em] text-[#115e35]">
            Potencialize seus resultados
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-7 text-slate-600">
            A IA da Vitale analisa dados e entrega recomendações para você focar no que realmente importa: seus pacientes.
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex-1 rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-[0_12px_30px_rgba(21,130,79,0.08)] backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2fbf5] text-[#159a4a]">
                <CheckCircle2 size={28} />
              </div>
            </div>

            <div className="hidden h-36 w-36 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.28),rgba(34,197,94,0.05)_55%,rgba(255,255,255,0)_70%)] md:block" />
          </div>
        </div>
      </section>
    </div>
  );
}
