"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Instagram, MessageCircleMore, Minus, Users } from "lucide-react";

const channels = [
  { name: "Instagram", percent: 42, growth: "+8%", tone: "bg-[#f04888]" },
  { name: "Indicacao", percent: 28, growth: "+5%", tone: "bg-[#22c55e]" },
  { name: "Google", percent: 18, growth: "+3%", tone: "bg-[#60a5fa]" },
  { name: "WhatsApp", percent: 7, growth: "+2%", tone: "bg-[#16c964]" },
  { name: "Outros", percent: 5, growth: "+1%", tone: "bg-[#c7cdd8]" },
];

const insights = [
  "Instagram segue como principal porta de entrada da clinica.",
  "Indicacao pessoal mantem a melhor taxa de conversao para atendimento.",
  "Google vem crescendo com busca local e pode ganhar mais destaque.",
];

const iconByName: Record<string, typeof Users> = {
  Instagram,
  Indicacao: Users,
  Google: MessageCircleMore,
  WhatsApp: MessageCircleMore,
  Outros: Minus,
};

function Bar({ value, tone }: { value: number; tone: string }) {
  return (
    <div className="h-2 flex-1 rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${tone}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function CanaisPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-slate-900">
              Origem dos pacientes
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Visao detalhada dos canais que mais trazem pacientes para a clinica.
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

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {channels.map((channel) => {
            const Icon = iconByName[channel.name];

            return (
              <div key={channel.name} className="rounded-[18px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                <div className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${channel.tone} text-white`}>
                    <Icon size={16} />
                  </span>
                  <p className="text-[14px] font-semibold text-slate-900">{channel.name}</p>
                </div>
                <p className="mt-4 text-[28px] font-bold tracking-[-0.04em] text-slate-900">
                  {channel.percent}%
                </p>
                <p className="mt-1 text-[12px] font-medium text-[#159a4a]">{channel.growth} vs mes anterior</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">Ranking por canal</h2>
              <p className="mt-1 text-[14px] text-slate-500">Comparacao visual do volume de pacientes.</p>
            </div>
            <span className="rounded-full bg-[#f2fbf5] px-3 py-1 text-[12px] font-semibold text-[#159a4a]">
              Atualizado hoje
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {channels.map((channel) => (
              <div key={channel.name} className="grid grid-cols-[160px_minmax(0,1fr)_54px] items-center gap-3">
                <span className="text-[14px] font-medium text-slate-900">{channel.name}</span>
                <Bar value={channel.percent} tone={channel.tone} />
                <span className="text-right text-[14px] font-semibold text-slate-700">{channel.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">Insights de canais</h2>
          <div className="mt-5 space-y-3">
            {insights.map((item) => (
              <p key={item} className="rounded-[16px] border border-[#edf1f4] bg-[#fbfcfd] px-4 py-3 text-[14px] leading-6 text-slate-700">
                {item}
              </p>
            ))}
          </div>

          <Link
            href="/dashboards"
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[14px] font-semibold text-[#159a4a] shadow-sm"
          >
            Voltar ao dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
