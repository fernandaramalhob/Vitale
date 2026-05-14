"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CircleDollarSign,
  CircleSlash2,
  FlaskConical,
  Grid2x2,
  Layers3,
  LineChart,
  Package2,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingUp,
  Wifi,
  CheckCircle2,
  BarChart3,
  MoreVertical,
  Filter,
  ChevronDown,
  List,
  ArrowUpRight,
} from "lucide-react";
import { useMemo, useState } from "react";

type Metric = {
  label: string;
  value: string;
  delta: string;
  sublabel?: string;
  icon: LucideIcon;
  accent: string;
  points: number[];
};

type Product = {
  name: string;
  category: string;
  unit: string;
  stock: string;
  monthly: string;
  ideal: string;
  usage: string;
  progress: number;
  status: "high" | "medium" | "low";
  accent: string;
};

type Insight = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
};

type Movement = {
  label: string;
  product: string;
  time: string;
  amount: string;
  kind: "in" | "out" | "alert";
  icon: LucideIcon;
};

const metrics: Metric[] = [
  {
    label: "Total em estoque",
    value: "1.248",
    delta: "+12,4%",
    sublabel: "itens",
    icon: Package2,
    accent: "from-[#e8faf1] to-[#f6fffb] text-[#159a4a]",
    points: [6, 7, 8, 8, 9, 10, 9, 11, 10, 12, 11, 13],
  },
  {
    label: "Produtos críticos",
    value: "12",
    delta: "+8,3%",
    sublabel: "produtos",
    icon: AlertTriangle,
    accent: "from-[#fff3e2] to-[#fff9f1] text-[#f59e0b]",
    points: [11, 10, 9, 9, 10, 9, 8, 10, 9, 8, 9, 7],
  },
  {
    label: "Consumo do mês",
    value: "R$ 18.420",
    delta: "+15,7%",
    icon: LineChart,
    accent: "from-[#e9fbfb] to-[#f4fdfd] text-[#14b8a6]",
    points: [7, 8, 9, 9, 10, 11, 10, 12, 11, 12, 13, 14],
  },
  {
    label: "Produto mais utilizado",
    value: "Toxina Botulínica",
    delta: "320ml consumidos",
    icon: Sparkles,
    accent: "from-[#f2ecff] to-[#faf7ff] text-[#8f5af7]",
    points: [8, 9, 10, 9, 11, 10, 12, 11, 12, 13, 12, 14],
  },
];

const categories = ["Todos", "Injetáveis", "Estéticos", "Consumíveis", "Odontológicos", "Equipamentos"];

const products: Product[] = [
  {
    name: "Toxina Botulínica Botox",
    category: "Injetáveis",
    unit: "500ml disponíveis",
    stock: "Consumo por mês 320ml",
    monthly: "Pacientes possíveis 750",
    ideal: "Validade 08/2026",
    usage: "83%",
    progress: 83,
    status: "high",
    accent: "from-[#f4f1f7] via-[#fbf8fd] to-[#d6d1de]",
  },
  {
    name: "Ácido Hialurônico Restylane",
    category: "Injetáveis",
    unit: "120 unidades disponíveis",
    stock: "Consumo por paciente 1 unidade",
    monthly: "Pacientes possíveis 120",
    ideal: "Validade 05/2026",
    usage: "40%",
    progress: 40,
    status: "medium",
    accent: "from-[#e8efff] via-[#f4f7ff] to-[#b8c6f1]",
  },
  {
    name: "Sculptra",
    category: "Injetáveis",
    unit: "25 frascos disponíveis",
    stock: "Consumo por paciente 1 frasco",
    monthly: "Pacientes possíveis 25",
    ideal: "Validade 07/2026",
    usage: "82%",
    progress: 82,
    status: "high",
    accent: "from-[#eef8f5] via-[#f7fcfa] to-[#d1e8df]",
  },
  {
    name: "Juvéderm",
    category: "Injetáveis",
    unit: "40 unidades disponíveis",
    stock: "Consumo por paciente 1 unidade",
    monthly: "Pacientes possíveis 40",
    ideal: "Validade 06/2026",
    usage: "80%",
    progress: 80,
    status: "high",
    accent: "from-[#f2e5fb] via-[#fbf6ff] to-[#cba2eb]",
  },
  {
    name: "Anestésico Lidocaína",
    category: "Injetáveis",
    unit: "200 unidades disponíveis",
    stock: "Consumo por pacote 1 unidade",
    monthly: "Pacientes possíveis 200",
    ideal: "Validade 03/2026",
    usage: "75%",
    progress: 75,
    status: "medium",
    accent: "from-[#f7f0e7] via-[#fcf8f1] to-[#d9c6af]",
  },
  {
    name: "Seringa Descartável 3ml",
    category: "Consumíveis",
    unit: "800 unidades disponíveis",
    stock: "Consumo por pacote 1 unidade",
    monthly: "Pacientes possíveis 800",
    ideal: "Validade 12/2028",
    usage: "77%",
    progress: 77,
    status: "medium",
    accent: "from-[#f6f8fa] via-[#ffffff] to-[#d9e1ea]",
  },
  {
    name: "Gaze Estéril",
    category: "Consumíveis",
    unit: "120 pacotes disponíveis",
    stock: "Consumo por pacote 1 unidade",
    monthly: "Pacientes possíveis 120",
    ideal: "Validade 11/2027",
    usage: "45%",
    progress: 45,
    status: "low",
    accent: "from-[#f3f9f7] via-[#fbfdfc] to-[#d4ebe5]",
  },
  {
    name: "Profhilo",
    category: "Injetáveis",
    unit: "30 ampolas disponíveis",
    stock: "Consumo por paciente 1 unidade",
    monthly: "Pacientes possíveis 30",
    ideal: "Validade 09/2026",
    usage: "73%",
    progress: 73,
    status: "high",
    accent: "from-[#f4efe8] via-[#fbf8f4] to-[#d7c7b3]",
  },
];

const insights: Insight[] = [
  {
    icon: ShieldAlert,
    title: "Toxina Botulínica acabará em aproximadamente 12 dias.",
    description: "Reponha antes do próximo pico de atendimento.",
    accent: "text-[#159a4a]",
  },
  {
    icon: AlertTriangle,
    title: "Ácido Hialurônico Restylane está abaixo do estoque ideal.",
    description: "A compra sugerida cobre o consumo das próximas 3 semanas.",
    accent: "text-[#f59e0b]",
  },
  {
    icon: Star,
    title: "3 produtos com validade próxima nos próximos 60 dias.",
    description: "Priorize uso em procedimentos de menor giro.",
    accent: "text-[#f97316]",
  },
  {
    icon: Sparkles,
    title: "Consumo de Anestésico aumentou 28% este mês.",
    description: "Revise kits por procedimento e o ritmo de reposição.",
    accent: "text-[#14b8a6]",
  },
];

const movements: Movement[] = [
  {
    label: "Procedimento concluído",
    product: "Harmonização Facial",
    time: "Hoje, 14:20",
    amount: "- 2ml",
    kind: "out",
    icon: CircleSlash2,
  },
  {
    label: "Procedimento concluído",
    product: "Toxina Botulínica",
    time: "Hoje, 13:45",
    amount: "- 1ml",
    kind: "out",
    icon: CircleSlash2,
  },
  {
    label: "Entrada de estoque",
    product: "Seringa Descartável 3ml",
    time: "Hoje, 10:30",
    amount: "+ 200 un.",
    kind: "in",
    icon: CheckCircle2,
  },
  {
    label: "Procedimento concluído",
    product: "Peeling Químico",
    time: "Ontem, 16:10",
    amount: "- 20ml",
    kind: "alert",
    icon: AlertTriangle,
  },
];

const revenueCategories = [
  { name: "Injetáveis", value: "R$ 11.240", percent: "60,9%", color: "#159a4a" },
  { name: "Estéticos", value: "R$ 3.560", percent: "19,3%", color: "#f59e0b" },
  { name: "Consumíveis", value: "R$ 2.780", percent: "15,1%", color: "#14b8a6" },
  { name: "Odontológicos", value: "R$ 560", percent: "3,0%", color: "#2f6fed" },
  { name: "Equipamentos", value: "R$ 280", percent: "1,5%", color: "#8f5af7" },
];

const revenuePoints = [10, 14, 16, 15, 18, 16];
const quantityPoints = [13, 12, 15, 17, 12, 8];

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
      <path d={sparkPath(points)} fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <article className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${metric.accent}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="mt-4 text-[14px] font-medium text-slate-700">{metric.label}</p>
      <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900">
        {metric.value}
        {metric.sublabel ? <span className="ml-2 text-[14px] font-medium text-slate-500">{metric.sublabel}</span> : null}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
        <span className="font-semibold text-[#159a4a]">{metric.delta}</span>
        <span className="text-slate-500">vs mês anterior</span>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 px-2 py-2">
        <Sparkline
          points={metric.points}
          color={metric.accent.includes("159a4a") ? "#18a44e" : metric.accent.includes("f59e0b") ? "#f59e0b" : metric.accent.includes("14b8a6") ? "#14b8a6" : "#8f5af7"}
        />
      </div>
    </article>
  );
}

function ProductIllustration({ accent }: { accent: string }) {
  return (
    <div className={`relative aspect-[16/9] overflow-hidden rounded-[16px] bg-gradient-to-br ${accent}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_26%,rgba(255,255,255,0.7),transparent_24%),radial-gradient(circle_at_74%_68%,rgba(255,255,255,0.35),transparent_26%)]" />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/10 to-transparent" />
      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/75 text-slate-500 shadow-sm">
        <MoreVertical size={18} />
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const progressColor =
    product.status === "high" ? "bg-[#159a4a]" : product.status === "medium" ? "bg-[#f4b400]" : "bg-[#1ea9c0]";

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#e5ebf0] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="relative p-3">
        <ProductIllustration accent={product.accent} />
        {product.status === "high" ? (
          <span className="absolute left-6 top-5 rounded-full bg-[#dff7e6] px-2.5 py-1 text-[11px] font-semibold text-[#159a4a]">
            Mais utilizado
          </span>
        ) : null}
      </div>

      <div className="px-3 pb-3">
        <h3 className="text-[14px] font-bold tracking-[-0.02em] text-[#13306a]">{product.name}</h3>
        <span className="mt-2 inline-flex rounded-full bg-[#eef9ff] px-2.5 py-1 text-[11px] font-semibold text-[#2f6fed]">
          {product.category}
        </span>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 text-[12px] text-slate-500">
          <div>
            <p className="text-[14px] font-bold text-slate-900">{product.unit}</p>
            <p className="mt-1">{product.stock}</p>
          </div>
          <div>
            <p className="text-[14px] font-bold text-slate-900">{product.monthly}</p>
            <p className="mt-1">{product.ideal}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[12px] text-slate-500">
            <span>Consumo mensal</span>
            <span>Validade {product.ideal.replace("Validade ", "")}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${product.progress}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-end text-[12px] font-semibold text-slate-500">
            {product.usage}
          </div>
        </div>
      </div>
    </article>
  );
}

function CornerChart() {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { stroke: "#159a4a", value: 0.609 },
    { stroke: "#14b8a6", value: 0.151 },
    { stroke: "#f59e0b", value: 0.193 },
    { stroke: "#2f6fed", value: 0.03 },
    { stroke: "#8f5af7", value: 0.015 },
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
        R$ 18.420
      </text>
      <text x="70" y="86" textAnchor="middle" className="fill-slate-500 text-[10px] font-medium">
        Total
      </text>
    </svg>
  );
}

function BottomChart() {
  const revenuePath = sparkPath(revenuePoints, 420, 132);
  const qtyPath = sparkPath(quantityPoints, 420, 132);

  return (
    <svg viewBox="0 0 420 168" className="h-[168px] w-full">
      <path d={revenuePath} fill="none" stroke="#159a4a" strokeWidth="2.5" strokeLinecap="round" />
      <path d={qtyPath} fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />
      {revenuePoints.map((point, index) => {
        const min = Math.min(...revenuePoints);
        const max = Math.max(...revenuePoints);
        const range = Math.max(max - min, 1);
        const x = (index / Math.max(revenuePoints.length - 1, 1)) * 420;
        const y = 132 - ((point - min) / range) * 132;

        return <circle key={`rev-${index}`} cx={x} cy={y} r="3.8" fill="#159a4a" />;
      })}
      {quantityPoints.map((point, index) => {
        const min = Math.min(...quantityPoints);
        const max = Math.max(...quantityPoints);
        const range = Math.max(max - min, 1);
        const x = (index / Math.max(quantityPoints.length - 1, 1)) * 420;
        const y = 132 - ((point - min) / range) * 132;

        return <circle key={`qty-${index}`} cx={x} cy={y} r="3.8" fill="#14b8a6" />;
      })}
    </svg>
  );
}

export function EstoquePage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const filteredProducts = useMemo(
    () =>
      activeCategory === "Todos"
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <aside className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f2fbf5] text-[#159a4a]">
                <Wifi size={18} />
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
                  <div className="min-w-0">
                    <p className="text-[14px] leading-6 text-slate-700">{item.title}</p>
                    <p className="mt-1 text-[12px] text-slate-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="mt-4 flex h-11 w-full items-center justify-center rounded-2xl border border-[#d7e6dc] bg-white text-[14px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f7fffa]">
            Ver todos os insights
          </button>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Produtos cadastrados
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[14px] font-semibold text-slate-700 shadow-sm">
                Ordenar por: <span className="text-slate-500">Mais utilizados</span>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm">
                <Grid2x2 size={16} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm">
                <List size={16} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                  category === activeCategory
                    ? "border-[#bfe8c7] bg-[#f1fbf4] text-[#159a4a]"
                    : "border-[#dfe6ef] bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>

          <Link
            href="/estoque"
            className="mt-4 flex items-center justify-center gap-2 text-[14px] font-semibold text-[#159a4a]"
          >
            Ver todo o estoque
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Movimentações recentes
              </h2>
              <button className="text-[14px] font-semibold text-[#159a4a]">Ver todas</button>
            </div>

            <div className="mt-5 space-y-4">
              {movements.map((movement) => {
                const Icon = movement.icon;

                return (
                  <div key={`${movement.product}-${movement.time}`} className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        movement.kind === "in"
                          ? "bg-[#f2fbf5] text-[#159a4a]"
                          : movement.kind === "alert"
                            ? "bg-[#fff3f3] text-[#ef4444]"
                            : "bg-[#eef6ff] text-[#2f6fed]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] text-slate-500">{movement.label}</p>
                      <p className="text-[14px] font-semibold text-slate-900">{movement.product}</p>
                      <p className="text-[12px] text-slate-500">{movement.time}</p>
                    </div>
                    <span className={`text-[13px] font-semibold ${movement.kind === "in" ? "text-[#159a4a]" : movement.kind === "alert" ? "text-[#ef4444]" : "text-slate-700"}`}>
                      {movement.amount}
                    </span>
                  </div>
                );
              })}
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
              {products.slice(0, 8).map((product) => (
                <div key={product.name} className="flex items-center gap-3 text-[13px] text-slate-700">
                  <span className="w-[150px] shrink-0 truncate">{product.name}</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${product.status === "high" ? "bg-[#159a4a]" : product.status === "medium" ? "bg-[#f59e0b]" : "bg-[#14b8a6]"}`}
                      style={{ width: `${product.progress}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-500">{product.progress}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] font-medium text-slate-500">● Quantidade de execuções</p>
          </section>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
              Consumo dos últimos 6 meses
            </h2>
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#159a4a]" /> Consumo (R$)</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#14b8a6]" /> Quantidade</span>
            </div>
          </div>
          <div className="mt-4 rounded-[18px] bg-white">
            <BottomChart />
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
              Categorias com maior consumo
            </h2>
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 shadow-sm">
              Este mês
            </button>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[180px_minmax(0,1fr)] xl:items-center">
            <div>
              <CornerChart />
            </div>
            <div className="space-y-3">
              {revenueCategories.map((item) => (
                <div key={item.name} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 text-[13px]">
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
      </section>
    </div>
  );
}
