"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, UserRound, Zap } from "lucide-react";

const recommendations = [
  {
    title: "3 pacientes estao ha mais de 60 dias sem retorno.",
    action: "Ver pacientes",
    detail: "Reative esses contatos com ofertas de retorno e acompanhamento preventivo.",
    icon: Sparkles,
    tone: "text-[#f59e0b]",
  },
  {
    title: "Taxa de no-show acima da media as tercas-feiras.",
    action: "Ver analise",
    detail: "Ajuste confirmacoes e revise os horarios com maior risco de ausencia.",
    icon: Zap,
    tone: "text-[#8f5af7]",
  },
  {
    title: "O horario das 10h as 12h tem alta demanda.",
    action: "Ver horarios",
    detail: "Reserve slots prioritarios e considere ampliar a oferta nesse periodo.",
    icon: CheckCircle2,
    tone: "text-[#159a4a]",
  },
  {
    title: "Campanha de indicacao com alto potencial.",
    action: "Ver campanha",
    detail: "Potencialize indicacoes com mensagens no pos-atendimento e recompensa leve.",
    icon: UserRound,
    tone: "text-[#2f6fed]",
  },
];

export function RecomendacoesPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-slate-900">
              Alertas e oportunidades
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Recomendacoes detalhadas para agir mais rapido nas prioridades da clinica.
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">Recomendacoes completas</h2>
              <p className="mt-1 text-[14px] text-slate-500">Acoes priorizadas por impacto no resultado.</p>
            </div>
            <span className="rounded-full bg-[#f2fbf5] px-3 py-1 text-[12px] font-semibold text-[#159a4a]">
              4 insights
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {recommendations.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-3 rounded-[16px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-white ${item.tone}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] leading-6 text-slate-700">{item.title}</p>
                    <p className="mt-1 text-[13px] text-slate-500">{item.detail}</p>
                    <button className="mt-2 text-[13px] font-semibold text-[#159a4a]">
                      {item.action} <ArrowRight size={14} className="inline" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#159a4a]" />
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">Resumo rapido</h2>
          </div>

          <div className="mt-4 space-y-3">
            <p className="rounded-[16px] bg-[#f7fbf8] px-4 py-3 text-[14px] leading-6 text-slate-700">
              Foque primeiro nos retornos atrasados para reduzir perda de receita.
            </p>
            <p className="rounded-[16px] bg-[#f7fbf8] px-4 py-3 text-[14px] leading-6 text-slate-700">
              Reforcar confirmacao nas tercas pode reduzir faltas em atendimentos de maior valor.
            </p>
          </div>

          <Link
            href="/dashboards"
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[14px] font-semibold text-[#159a4a] shadow-sm"
          >
            Voltar ao dashboard
            <ArrowRight size={16} />
          </Link>
        </aside>
      </section>
    </div>
  );
}
