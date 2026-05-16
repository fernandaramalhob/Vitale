"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Target,
  TrendingUp,
  Users,
  Clock3,
} from "lucide-react";

type TeamMember = {
  name: string;
  specialty: string;
  procedures: number;
  satisfaction: string;
  accent: string;
  trend: string;
};

const team: TeamMember[] = [
  { name: "Dra. Juliana Silva", specialty: "Harmonizacao Facial", procedures: 48, satisfaction: "4,9", accent: "bg-[#f2fbf5] text-[#159a4a]", trend: "+12%" },
  { name: "Dr. Pedro Costa", specialty: "Implantodontia", procedures: 35, satisfaction: "4,8", accent: "bg-[#eef6ff] text-[#2f6fed]", trend: "+8%" },
  { name: "Dra. Ana Oliveira", specialty: "Dermatologia", procedures: 29, satisfaction: "4,9", accent: "bg-[#f7f2ff] text-[#8f5af7]", trend: "+10%" },
  { name: "Dra. Carla Mendes", specialty: "Odontologia", procedures: 26, satisfaction: "4,7", accent: "bg-[#fff7e8] text-[#f59e0b]", trend: "+4%" },
  { name: "Dr. Lucas Martins", specialty: "Clareamento", procedures: 22, satisfaction: "4,8", accent: "bg-[#fff0f6] text-[#ff4d7d]", trend: "+6%" },
];

const summary = [
  { label: "Procedimentos totais", value: "160", icon: Users },
  { label: "Satisfacao media", value: "4,9", icon: Star },
  { label: "Crescimento", value: "+11,2%", icon: TrendingUp },
];

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 flex-1 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-[#22c55e]" style={{ width: `${value}%` }} />
    </div>
  );
}

export function DesempenhoEquipePage() {
  return (
    <div className="space-y-4">
      <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-slate-900">
              Desempenho da equipe
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Visualizacao completa da produtividade por profissional.
            </p>
          </div>

          <Link
            href="/dashboards"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {summary.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[18px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Icon size={16} />
                  <span className="text-[13px]">{item.label}</span>
                </div>
                <p className="mt-3 text-[26px] font-bold tracking-[-0.04em] text-slate-900">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
              Ranking completo
            </h2>
            <p className="mt-1 text-[14px] text-slate-500">
              Desempenho consolidado da equipe no periodo.
            </p>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 shadow-sm">
            Atualizado em tempo real
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {team.map((member, index) => (
            <div key={member.name} className="grid grid-cols-[28px_minmax(0,1fr)_220px_100px] items-center gap-4 rounded-[18px] border border-[#edf1f4] bg-[#fbfcfd] px-4 py-4">
              <span className="text-[16px] font-bold text-slate-400">{index + 1}</span>
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${member.accent} text-[12px] font-bold`}>
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
                <Bar value={Math.max((member.procedures / 50) * 100, 18)} />
              </div>

              <div className="flex items-center justify-end gap-2">
                <span className="text-[14px] font-semibold text-[#159a4a]">{member.satisfaction}</span>
                <Star size={13} className="text-[#159a4a]" fill="currentColor" />
                <span className="ml-2 rounded-full bg-[#f2fbf5] px-2.5 py-1 text-[12px] font-semibold text-[#159a4a]">
                  {member.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-[18px] bg-[#f7fbf8] px-4 py-4">
          <div>
            <p className="text-[14px] font-semibold text-slate-900">Quer explorar outros indicadores?</p>
            <p className="mt-1 text-[13px] text-slate-500">Volte para a visao geral dos dashboards quando quiser.</p>
          </div>
          <Link
            href="/dashboards"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-4 py-2 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95"
          >
            <Target size={16} />
            Abrir dashboards
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
