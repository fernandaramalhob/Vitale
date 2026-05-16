"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleCheckBig, Star, ThumbsUp, Target } from "lucide-react";

const quality = [
  { label: "Reclamacoes", value: "2", delta: "-33% vs mes anterior", icon: CircleCheckBig, accent: "from-[#f1fbf5] to-[#f7fffb] text-[#159a4a]" },
  { label: "Elogios", value: "47", delta: "+18% vs mes anterior", icon: ThumbsUp, accent: "from-[#f2fbf5] to-[#f8fffb] text-[#159a4a]" },
  { label: "Retorno em 90 dias", value: "64%", delta: "+5 p.p. vs mes anterior", icon: ArrowUpRight, accent: "from-[#eff7ff] to-[#f8fbff] text-[#2f6fed]" },
  { label: "Procedimentos recorrentes", value: "36%", delta: "+7 p.p. vs mes anterior", icon: Target, accent: "from-[#f3efff] to-[#faf8ff] text-[#8f5af7]" },
];

const qualityActions = [
  { label: "Revisar reclamacoes", detail: "2 registros foram abertos neste mes.", tone: "text-[#159a4a]" },
  { label: "Aumentar retenção", detail: "64% dos pacientes voltam em ate 90 dias.", tone: "text-[#2f6fed]" },
  { label: "Estimular recorrencia", detail: "36% dos procedimentos se repetem com o mesmo profissional.", tone: "text-[#8f5af7]" },
];

export function QualidadeRelatorioPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-slate-900">
              Indicadores de qualidade
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Visao completa dos sinais de satisfacao e recorrencia.
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
        {quality.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.label} className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white ${item.accent}`}>
                <Icon size={18} />
              </div>
              <p className="mt-3 text-[13px] text-slate-500">{item.label}</p>
              <p className="mt-1 text-[28px] font-bold tracking-[-0.04em] text-slate-900">{item.value}</p>
              <p className="mt-2 text-[12px] font-medium text-[#159a4a]">{item.delta}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">Relatorio detalhado</h2>
              <p className="mt-1 text-[14px] text-slate-500">Resumo dos indicadores e leitura da tendencia.</p>
            </div>
            <span className="rounded-full bg-[#f2fbf5] px-3 py-1 text-[12px] font-semibold text-[#159a4a]">
              +12% no periodo
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {qualityActions.map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                <p className="text-[14px] font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-[13px] leading-6 text-slate-500">{item.detail}</p>
                <p className={`mt-2 text-[12px] font-semibold ${item.tone}`}>Abrir analise</p>
              </div>
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

        <aside className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-[#159a4a]" fill="currentColor" />
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">Leitura executiva</h2>
          </div>

          <div className="mt-4 space-y-3">
            <p className="rounded-[16px] bg-[#f7fbf8] px-4 py-3 text-[14px] leading-6 text-slate-700">
              A satisfacao segue alta e os retornos em 90 dias mostram uma base de pacientes consistente.
            </p>
            <p className="rounded-[16px] bg-[#f7fbf8] px-4 py-3 text-[14px] leading-6 text-slate-700">
              Os procedimentos recorrentes indicam oportunidade de ampliar campanhas de relacionamento.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
