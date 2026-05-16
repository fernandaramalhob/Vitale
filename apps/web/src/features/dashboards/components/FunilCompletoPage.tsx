"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheckBig, Target, Users, CalendarCheck2 } from "lucide-react";

const steps = [
  { label: "Primeiro contato", count: 512, percent: 100, tone: "bg-[#aee3be]" },
  { label: "Consulta realizada", count: 312, percent: 61, tone: "bg-[#8ddca9]" },
  { label: "Em tratamento", count: 198, percent: 39, tone: "bg-[#76d496]" },
  { label: "Procedimento realizado", count: 156, percent: 31, tone: "bg-[#5fcb87]" },
];

const highlights = [
  { label: "Leads ativos", value: "512", icon: Users },
  { label: "Consultas concluidas", value: "312", icon: CalendarCheck2 },
  { label: "Conversao final", value: "31%", icon: Target },
  { label: "Retencao", value: "64%", icon: CircleCheckBig },
];

function FlowBar({ value, tone }: { value: number; tone: string }) {
  return (
    <div className="h-10 rounded-full bg-[#edf8f1] p-1">
      <div className={`h-8 rounded-full ${tone}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function FunilCompletoPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-slate-900">Funil completo</h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Visualizacao detalhada das etapas desde o primeiro contato ate o procedimento final.
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
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.label} className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2 text-[#159a4a]">
                <Icon size={16} />
                <span className="text-[13px] font-medium text-slate-500">{item.label}</span>
              </div>
              <p className="mt-3 text-[28px] font-bold tracking-[-0.04em] text-slate-900">{item.value}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">Etapas do funil</h2>
            <p className="mt-1 text-[14px] text-slate-500">As labels agora ficam abaixo das barras para leitura mais limpa.</p>
          </div>
          <span className="rounded-full bg-[#f2fbf5] px-3 py-1 text-[12px] font-semibold text-[#159a4a]">
            Atualizado agora
          </span>
        </div>

        <div className="mt-6 space-y-5">
          {steps.map((step) => (
            <div key={step.label} className="space-y-2">
              <div className="grid grid-cols-[minmax(0,1fr)_54px_54px] items-center gap-3">
                <FlowBar value={step.percent} tone={step.tone} />
                <span className="text-right text-[13px] font-medium text-slate-700">{step.count}</span>
                <span className="text-right text-[13px] font-medium text-slate-500">
                  {step.percent === 100 ? "" : `${step.percent}%`}
                </span>
              </div>
              <div className="px-1 text-[13px] text-slate-600">{step.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[18px] bg-[#f7fbf8] p-4 text-[14px] leading-6 text-slate-700">
          O funil mostra queda mais forte entre consulta e tratamento, indicando oportunidade para
          reforcar o acompanhamento pos-consulta e reduzir perda de conversao.
        </div>

      </section>
    </div>
  );
}
