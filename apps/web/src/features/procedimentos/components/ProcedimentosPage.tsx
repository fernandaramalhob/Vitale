"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  FlaskConical,
  LineChart,
  Medal,
  MoreVertical,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  Users,
  Wallet,
  Boxes,
  Smile,
  HeartPulse,
  ShieldPlus,
} from "lucide-react";

type MetricCard = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  accent: string;
  points: number[];
};

type ProcedureCard = {
  name: string;
  category: string;
  price: string;
  executions: string;
  rating: string;
  accent: string;
};

type TopProcedure = {
  rank: number;
  name: string;
  rating: string;
  reviews: string;
  accent: string;
};

type Performance = {
  name: string;
  count: number;
  accent: string;
};

type RevenueCategory = {
  name: string;
  value: string;
  percent: string;
  color: string;
};

const metrics: MetricCard[] = [
  {
    label: "Total de procedimentos",
    value: "128",
    delta: "+14,2%",
    icon: Boxes,
    accent: "from-[#e8f8ea] to-[#f3fcf4] text-[#15a34a]",
    points: [6, 7, 8, 8, 9, 8, 10, 11, 10, 12, 11, 13],
  },
  {
    label: "Faturamento total",
    value: "R$ 186.430,00",
    delta: "+18,7%",
    icon: CircleDollarSign,
    accent: "from-[#edf5ff] to-[#f5f9ff] text-[#2f6fed]",
    points: [8, 9, 10, 11, 10, 12, 13, 12, 14, 13, 15, 16],
  },
  {
    label: "Avaliação média",
    value: "4,8",
    delta: "+0,3",
    icon: Star,
    accent: "from-[#f4ecff] to-[#faf6ff] text-[#8f5af7]",
    points: [7, 8, 7, 9, 8, 10, 11, 10, 11, 10, 12, 13],
  },
  {
    label: "Procedimento mais realizado",
    value: "Harmonização Facial",
    delta: "42 execuções este mês",
    icon: TrendingUp,
    accent: "from-[#e7f7fb] to-[#f4fbfd] text-[#1ea9c0]",
    points: [5, 6, 7, 8, 7, 8, 9, 8, 9, 10, 9, 11],
  },
];

const categories = ["Todos", "Estéticos", "Odontológicos", "Terapêuticos", "Outros"];

const procedures: ProcedureCard[] = [
  {
    name: "Harmonização Facial",
    category: "Estético",
    price: "R$ 1.890,00",
    executions: "42 realizados este mês",
    rating: "4,9 (126)",
    accent: "from-[#f3d8c3] via-[#f9e9d9] to-[#f7c49c]",
  },
  {
    name: "Clareamento Dental",
    category: "Odontológico",
    price: "R$ 890,00",
    executions: "35 realizados este mês",
    rating: "4,8 (98)",
    accent: "from-[#f8d7d3] via-[#feece8] to-[#d8b5a8]",
  },
  {
    name: "Laser Lavieen",
    category: "Estético",
    price: "R$ 1.450,00",
    executions: "28 realizados este mês",
    rating: "4,8 (87)",
    accent: "from-[#efe7df] via-[#f9f4ef] to-[#d8c9bb]",
  },
  {
    name: "Implante Dentário",
    category: "Odontológico",
    price: "R$ 3.250,00",
    executions: "24 realizados este mês",
    rating: "4,8 (74)",
    accent: "from-[#f2ddd1] via-[#f9ece4] to-[#d6b3a0]",
  },
  {
    name: "Toxina Botulínica",
    category: "Estético",
    price: "R$ 890,00",
    executions: "22 realizados este mês",
    rating: "4,9 (64)",
    accent: "from-[#edd4c8] via-[#faeadf] to-[#d2a78d]",
  },
  {
    name: "Preenchimento Labial",
    category: "Estético",
    price: "R$ 1.290,00",
    executions: "18 realizados este mês",
    rating: "4,8 (53)",
    accent: "from-[#f0d0cb] via-[#f9ece6] to-[#d39b8f]",
  },
  {
    name: "Peeling Químico",
    category: "Estético",
    price: "R$ 690,00",
    executions: "15 realizados este mês",
    rating: "4,7 (42)",
    accent: "from-[#f0ddd2] via-[#fbf1ea] to-[#d7b59f]",
  },
  {
    name: "Ortodontia Alinhadores",
    category: "Odontológico",
    price: "R$ 4.250,00",
    executions: "12 realizados este mês",
    rating: "4,9 (37)",
    accent: "from-[#f1e6db] via-[#fbf5ef] to-[#d7c1a8]",
  },
];

const topProcedures: TopProcedure[] = [
  { rank: 1, name: "Harmonização Facial", rating: "4,9", reviews: "(126 avaliações)", accent: "bg-[#f3d8c3]" },
  { rank: 2, name: "Laser Lavieen", rating: "4,9", reviews: "(87 avaliações)", accent: "bg-[#efe7df]" },
  { rank: 3, name: "Toxina Botulínica", rating: "4,9", reviews: "(64 avaliações)", accent: "bg-[#edd4c8]" },
  { rank: 4, name: "Ortodontia Alinhadores", rating: "4,9", reviews: "(37 avaliações)", accent: "bg-[#f1e6db]" },
  { rank: 5, name: "Clareamento Dental", rating: "4,8", reviews: "(98 avaliações)", accent: "bg-[#f8d7d3]" },
];

const performance: Performance[] = [
  { name: "Harmonização Facial", count: 42, accent: "bg-[#159a4a]" },
  { name: "Clareamento Dental", count: 35, accent: "bg-[#1ea9c0]" },
  { name: "Laser Lavieen", count: 28, accent: "bg-[#8f5af7]" },
  { name: "Implante Dentário", count: 24, accent: "bg-[#159a4a]" },
  { name: "Toxina Botulínica", count: 22, accent: "bg-[#1ea9c0]" },
  { name: "Preenchimento Labial", count: 18, accent: "bg-[#159a4a]" },
  { name: "Peeling Químico", count: 15, accent: "bg-[#8f5af7]" },
  { name: "Ortodontia Alinhadores", count: 12, accent: "bg-[#159a4a]" },
];

const revenueCategories: RevenueCategory[] = [
  { name: "Estéticos", value: "R$ 98.230", percent: "52,7%", color: "#159a4a" },
  { name: "Odontológicos", value: "R$ 63.450", percent: "34,0%", color: "#8f5af7" },
  { name: "Terapêuticos", value: "R$ 16.750", percent: "9,0%", color: "#2f6fed" },
  { name: "Outros", value: "R$ 8.000", percent: "4,3%", color: "#1ea9c0" },
];

const revenuePoints = [110, 150, 145, 175, 150, 180];

function sparkPath(points: number[], width = 240, height = 68) {
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
    <svg viewBox="0 0 240 68" className="h-[68px] w-full">
      <path d={sparkPath(points)} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function TrendCard({ metric }: { metric: MetricCard }) {
  const Icon = metric.icon;

  return (
    <article className="rounded-[22px] border border-[#e4ebf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${metric.accent}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="mt-4 text-[14px] font-medium text-slate-700">{metric.label}</p>
      <p className="mt-2 text-[29px] font-bold tracking-[-0.04em] text-slate-900">{metric.value}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
        <span className="font-semibold text-[#159a4a]">{metric.delta}</span>
        <span className="text-slate-500">vs mês anterior</span>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 px-2 py-2">
        <Sparkline
          points={metric.points}
          color={metric.accent.includes("159a4a") ? "#18a44e" : metric.accent.includes("2f6fed") ? "#2f6fed" : metric.accent.includes("8f5af7") ? "#8f5af7" : "#1ea9c0"}
        />
      </div>
    </article>
  );
}

function ProcedureBanner({ accent }: { accent: string }) {
  return (
    <div
      className={`relative aspect-[1.45] overflow-hidden rounded-[16px] bg-gradient-to-br ${accent}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.5),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.35),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/8 to-transparent" />
      <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/75 text-slate-600 shadow-sm">
        <Smile size={24} />
      </div>
      <div className="absolute bottom-4 left-4 h-12 w-12 rounded-full bg-white/45 blur-2xl" />
      <div className="absolute bottom-6 left-6 h-5 w-28 rounded-full bg-white/55 blur-md" />
    </div>
  );
}

function CircleChart() {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { stroke: "#159a4a", value: 0.527 },
    { stroke: "#8f5af7", value: 0.34 },
    { stroke: "#2f6fed", value: 0.09 },
    { stroke: "#1ea9c0", value: 0.043 },
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
      <text x="70" y="67" textAnchor="middle" className="fill-slate-900 text-[18px] font-bold">
        R$186.430
      </text>
      <text x="70" y="86" textAnchor="middle" className="fill-slate-500 text-[10px] font-medium">
        Total
      </text>
    </svg>
  );
}

function RevenueChart() {
  const path = sparkPath(revenuePoints, 400, 140);

  return (
    <svg viewBox="0 0 400 170" className="h-[170px] w-full">
      <line x1="0" y1="140" x2="400" y2="140" stroke="#e8eef3" strokeWidth="1" />
      <path d={path} fill="none" stroke="#159a4a" strokeWidth="2.6" strokeLinecap="round" />
      {revenuePoints.map((point, index) => {
        const min = Math.min(...revenuePoints);
        const max = Math.max(...revenuePoints);
        const range = Math.max(max - min, 1);
        const x = (index / Math.max(revenuePoints.length - 1, 1)) * 400;
        const y = 140 - ((point - min) / range) * 140;

        return (
          <g key={`${point}-${index}`}>
            <circle cx={x} cy={y} r="5" fill="#159a4a" opacity="0.15" />
            <circle cx={x} cy={y} r="3" fill="#159a4a" />
          </g>
        );
      })}
    </svg>
  );
}

function ProcedureCardView({ procedure }: { procedure: ProcedureCard }) {
  return (
    <article className="overflow-hidden rounded-[18px] border border-[#e5eaf0] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <ProcedureBanner accent={procedure.accent} />
      <div className="p-3">
        <h3 className="text-[14px] font-bold tracking-[-0.02em] text-[#13306a]">
          {procedure.name}
        </h3>
        <span className="mt-2 inline-flex rounded-full bg-[#f2fbf5] px-2.5 py-1 text-[11px] font-semibold text-[#159a4a]">
          {procedure.category}
        </span>
        <p className="mt-3 text-[16px] font-bold tracking-[-0.03em] text-slate-900">
          {procedure.price}
        </p>
        <div className="mt-2 flex items-center justify-between text-[12px] text-slate-500">
          <span>{procedure.executions}</span>
          <span className="flex items-center gap-1 text-amber-500">
            <Star size={13} fill="currentColor" />
            {procedure.rating}
          </span>
        </div>
      </div>
    </article>
  );
}

export function ProcedimentosPage() {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-4">
        {metrics.map((metric) => (
          <TrendCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Procedimentos cadastrados
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[14px] font-semibold text-slate-700 shadow-sm">
                Ordenar por: <span className="text-slate-500">Mais realizados</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                  index === 0
                    ? "border-[#bfe8c7] bg-[#f1fbf4] text-[#159a4a]"
                    : "border-[#dfe6ef] bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {procedures.map((procedure) => (
              <ProcedureCardView key={procedure.name} procedure={procedure} />
            ))}
          </div>

          <Link
            href="/procedimentos"
            className="mt-4 flex items-center justify-center gap-2 text-[14px] font-semibold text-[#159a4a]"
          >
            Ver todos os procedimentos
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Procedimentos mais bem avaliados
              </h2>
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 shadow-sm">
                Ver todos
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {topProcedures.map((item) => (
                <div key={item.rank} className="flex items-center gap-3">
                  <span className="w-4 text-[18px] font-semibold text-[#13306a]">{item.rank}</span>
                  <div className={`h-11 w-11 rounded-xl ${item.accent}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-[12px] text-slate-500 flex items-center gap-1">
                      <Star size={12} className="text-amber-500" fill="currentColor" />
                      {item.rating} {item.reviews}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Desempenho por procedimento
              </h2>
              <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 shadow-sm">
                Este mês
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {performance.map((item) => (
                <div key={item.name} className="flex items-center gap-3 text-[13px] text-slate-700">
                  <span className="w-[152px] shrink-0 truncate">{item.name}</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${item.accent}`}
                      style={{ width: `${Math.max((item.count / 42) * 100, 18)}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-slate-500">{item.count}</span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[12px] font-medium text-slate-500">● Quantidade de execuções</p>
          </section>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
            Faturamento por categoria
          </h2>

          <div className="mt-5 flex flex-col items-center gap-4">
            <CircleChart />
            <div className="w-full space-y-3">
              {revenueCategories.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-slate-500">{item.value}</span>
                  <span className="text-slate-500">{item.percent}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
              Faturamento dos últimos 6 meses
            </h2>
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 shadow-sm">
              Este mês
            </button>
          </div>

          <div className="mt-5 rounded-[18px] bg-white">
            <RevenueChart />
          </div>
        </section>
      </section>
    </div>
  );
}
