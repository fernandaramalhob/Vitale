"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CircleDollarSign,
  CircleSlash2,
  ChevronDown,
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
  List,
  ArrowUpRight,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  id: string;
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

type ProductSeed = Omit<Product, "id">;

type ProductFormState = {
  name: string;
  category: string;
  unit: string;
  stock: string;
  monthly: string;
  ideal: string;
  usage: string;
  progress: string;
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
    label: "Produtos crÃ­ticos",
    value: "12",
    delta: "+8,3%",
    sublabel: "produtos",
    icon: AlertTriangle,
    accent: "from-[#fff3e2] to-[#fff9f1] text-[#f59e0b]",
    points: [11, 10, 9, 9, 10, 9, 8, 10, 9, 8, 9, 7],
  },
  {
    label: "Consumo do mÃªs",
    value: "R$ 18.420",
    delta: "+15,7%",
    icon: LineChart,
    accent: "from-[#e9fbfb] to-[#f4fdfd] text-[#14b8a6]",
    points: [7, 8, 9, 9, 10, 11, 10, 12, 11, 12, 13, 14],
  },
  {
    label: "Produto mais utilizado",
    value: "Toxina BotulÃ­nica",
    delta: "320ml consumidos",
    icon: Sparkles,
    accent: "from-[#f2ecff] to-[#faf7ff] text-[#8f5af7]",
    points: [8, 9, 10, 9, 11, 10, 12, 11, 12, 13, 12, 14],
  },
];

const categories = ["Todos", "InjetÃ¡veis", "EstÃ©ticos", "ConsumÃ­veis", "OdontolÃ³gicos", "Equipamentos"];

const products: ProductSeed[] = [
  {
    name: "Toxina BotulÃ­nica Botox",
    category: "InjetÃ¡veis",
    unit: "500ml disponÃ­veis",
    stock: "Consumo por mÃªs 320ml",
    monthly: "Pacientes possÃ­veis 750",
    ideal: "Validade 08/2026",
    usage: "83%",
    progress: 83,
    status: "high",
    accent: "from-[#f4f1f7] via-[#fbf8fd] to-[#d6d1de]",
  },
  {
    name: "Ãcido HialurÃ´nico Restylane",
    category: "InjetÃ¡veis",
    unit: "120 unidades disponÃ­veis",
    stock: "Consumo por paciente 1 unidade",
    monthly: "Pacientes possÃ­veis 120",
    ideal: "Validade 05/2026",
    usage: "40%",
    progress: 40,
    status: "medium",
    accent: "from-[#e8efff] via-[#f4f7ff] to-[#b8c6f1]",
  },
  {
    name: "Sculptra",
    category: "InjetÃ¡veis",
    unit: "25 frascos disponÃ­veis",
    stock: "Consumo por paciente 1 frasco",
    monthly: "Pacientes possÃ­veis 25",
    ideal: "Validade 07/2026",
    usage: "82%",
    progress: 82,
    status: "high",
    accent: "from-[#eef8f5] via-[#f7fcfa] to-[#d1e8df]",
  },
  {
    name: "JuvÃ©derm",
    category: "InjetÃ¡veis",
    unit: "40 unidades disponÃ­veis",
    stock: "Consumo por paciente 1 unidade",
    monthly: "Pacientes possÃ­veis 40",
    ideal: "Validade 06/2026",
    usage: "80%",
    progress: 80,
    status: "high",
    accent: "from-[#f2e5fb] via-[#fbf6ff] to-[#cba2eb]",
  },
  {
    name: "AnestÃ©sico LidocaÃ­na",
    category: "InjetÃ¡veis",
    unit: "200 unidades disponÃ­veis",
    stock: "Consumo por pacote 1 unidade",
    monthly: "Pacientes possÃ­veis 200",
    ideal: "Validade 03/2026",
    usage: "75%",
    progress: 75,
    status: "medium",
    accent: "from-[#f7f0e7] via-[#fcf8f1] to-[#d9c6af]",
  },
  {
    name: "Seringa DescartÃ¡vel 3ml",
    category: "ConsumÃ­veis",
    unit: "800 unidades disponÃ­veis",
    stock: "Consumo por pacote 1 unidade",
    monthly: "Pacientes possÃ­veis 800",
    ideal: "Validade 12/2028",
    usage: "77%",
    progress: 77,
    status: "medium",
    accent: "from-[#f6f8fa] via-[#ffffff] to-[#d9e1ea]",
  },
  {
    name: "Gaze EstÃ©ril",
    category: "ConsumÃ­veis",
    unit: "120 pacotes disponÃ­veis",
    stock: "Consumo por pacote 1 unidade",
    monthly: "Pacientes possÃ­veis 120",
    ideal: "Validade 11/2027",
    usage: "45%",
    progress: 45,
    status: "low",
    accent: "from-[#f3f9f7] via-[#fbfdfc] to-[#d4ebe5]",
  },
  {
    name: "Profhilo",
    category: "InjetÃ¡veis",
    unit: "30 ampolas disponÃ­veis",
    stock: "Consumo por paciente 1 unidade",
    monthly: "Pacientes possÃ­veis 30",
    ideal: "Validade 09/2026",
    usage: "73%",
    progress: 73,
    status: "high",
    accent: "from-[#f4efe8] via-[#fbf8f4] to-[#d7c7b3]",
  },
];

const stockStorageKey = "vitale-stock-products";

const initialProductForm: ProductFormState = {
  name: "",
  category: "Equipamentos",
  unit: "1 unidade",
  stock: "Novo equipamento cadastrado",
  monthly: "Equipamento disponÃ­vel para uso",
  ideal: "Validade -",
  usage: "0%",
  progress: "0",
};

const insights: Insight[] = [
  {
    icon: ShieldAlert,
    title: "Toxina BotulÃ­nica acabarÃ¡ em aproximadamente 12 dias.",
    description: "Reponha antes do prÃ³ximo pico de atendimento.",
    accent: "text-[#159a4a]",
  },
  {
    icon: AlertTriangle,
    title: "Ãcido HialurÃ´nico Restylane estÃ¡ abaixo do estoque ideal.",
    description: "A compra sugerida cobre o consumo das prÃ³ximas 3 semanas.",
    accent: "text-[#f59e0b]",
  },
  {
    icon: Star,
    title: "3 produtos com validade prÃ³xima nos prÃ³ximos 60 dias.",
    description: "Priorize uso em procedimentos de menor giro.",
    accent: "text-[#f97316]",
  },
  {
    icon: Sparkles,
    title: "Consumo de AnestÃ©sico aumentou 28% este mÃªs.",
    description: "Revise kits por procedimento e o ritmo de reposiÃ§Ã£o.",
    accent: "text-[#14b8a6]",
  },
];

const movements: Movement[] = [
  {
    label: "Procedimento concluÃ­do",
    product: "HarmonizaÃ§Ã£o Facial",
    time: "Hoje, 14:20",
    amount: "- 2ml",
    kind: "out",
    icon: CircleSlash2,
  },
  {
    label: "Procedimento concluÃ­do",
    product: "Toxina BotulÃ­nica",
    time: "Hoje, 13:45",
    amount: "- 1ml",
    kind: "out",
    icon: CircleSlash2,
  },
  {
    label: "Entrada de estoque",
    product: "Seringa DescartÃ¡vel 3ml",
    time: "Hoje, 10:30",
    amount: "+ 200 un.",
    kind: "in",
    icon: CheckCircle2,
  },
  {
    label: "Procedimento concluÃ­do",
    product: "Peeling QuÃ­mico",
    time: "Ontem, 16:10",
    amount: "- 20ml",
    kind: "alert",
    icon: AlertTriangle,
  },
];

const revenueCategories = [
  { name: "InjetÃ¡veis", value: "R$ 11.240", percent: "60,9%", color: "#159a4a" },
  { name: "EstÃ©ticos", value: "R$ 3.560", percent: "19,3%", color: "#f59e0b" },
  { name: "ConsumÃ­veis", value: "R$ 2.780", percent: "15,1%", color: "#14b8a6" },
  { name: "OdontolÃ³gicos", value: "R$ 560", percent: "3,0%", color: "#2f6fed" },
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
        <span className="text-slate-500">vs mÃªs anterior</span>
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

function accentForCategory(category: string) {
  if (category === "Equipamentos") {
    return "from-[#eef2ff] via-[#f8f9ff] to-[#d7def7]";
  }

  if (category === "OdontolÃ³gicos") {
    return "from-[#f8d7d3] via-[#feece8] to-[#d8b5a8]";
  }

  if (category === "ConsumÃ­veis") {
    return "from-[#f3f9f7] via-[#fbfdfc] to-[#d4ebe5]";
  }

  if (category === "EstÃ©ticos") {
    return "from-[#f4efe8] via-[#fbf8f4] to-[#d7c7b3]";
  }

  return "from-[#f4f1f7] via-[#fbf8fd] to-[#d6d1de]";
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

function FancySelect({
  label,
  value,
  options,
  onSelect,
  showLabel = true,
  icon: Icon,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  showLabel?: boolean;
  icon?: LucideIcon;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`group flex h-[76px] w-full items-center rounded-[20px] border bg-white px-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-[#b7d9c2] focus:outline-none focus:ring-4 focus:ring-[#19a14f]/8 ${
          open ? "border-[#19a14f]" : "border-[#dce5ee]"
        }`}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {Icon ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                <Icon size={18} />
              </span>
            ) : null}
            <div className="min-w-0">
            {showLabel ? (
              <>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {label}
                </span>
                <span className="block truncate text-[18px] font-medium text-slate-800">{value}</span>
              </>
            ) : (
              <span className="block truncate text-[18px] font-medium text-slate-800">{value}</span>
            )}
            </div>
          </div>

          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              open
                ? "bg-[#edf8f1] text-[#0f9c68]"
                : "bg-[#f6f9fc] text-slate-400 group-hover:bg-[#effaf3] group-hover:text-[#0f9c68]"
            }`}
          >
            <ChevronDown size={16} />
          </span>
        </div>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+10px)] z-30 w-full rounded-[18px] border border-[#dce5ee] bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
          <p className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Opções
          </p>
          <div className="space-y-1">
            {options.map((option) => {
              const active = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                  className={`mx-1 mb-1 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-[14px] px-4 py-3 text-left text-[14px] font-medium transition-colors last:mb-0 ${
                    active
                      ? "border border-[#bfe8c7] bg-[#f0fbf2] text-[#0f9c68] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{option}</span>
                  {active ? <span className="h-2.5 w-2.5 rounded-full bg-[#0f9c68]" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function EstoquePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>(() =>
    products.map((product) => ({
      ...product,
      id: product.name,
    }))
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProductFormState>(initialProductForm);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(stockStorageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed)) {
        setProductsList(parsed.filter((item) => item && typeof item.id === "string"));
      }
    } catch {
      // Keep seeded products when storage is unavailable or malformed.
    }
  }, []);

  useEffect(() => {
    if (productsList.length) {
      localStorage.setItem(stockStorageKey, JSON.stringify(productsList));
    }
  }, [productsList]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setError("");
      setForm(initialProductForm);
      setCreateOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setCreateOpen(false);
      }

      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCreateOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function openCreateModal() {
    setError("");
    setForm(initialProductForm);
    setCreateOpen(true);
    router.push("/estoque?new=1");
  }

  function closeCreateModal() {
    setCreateOpen(false);
    setError("");
    setForm(initialProductForm);
    router.replace("/estoque");
  }

  function updateForm<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.name.trim()) {
        throw new Error("Preencha o nome do equipamento.");
      }

      const newProduct: Product = {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        category: form.category,
        unit: form.unit.trim() || "1 unidade",
        stock: form.stock.trim() || "Novo equipamento cadastrado",
        monthly: form.monthly.trim() || "Equipamento disponÃ­vel para uso",
        ideal: form.ideal.trim() || "Validade -",
        usage: form.usage.trim() || "0%",
        progress: Math.max(0, Math.min(100, Number(form.progress) || 0)),
        status: "medium",
        accent: accentForCategory(form.category),
      };

      setProductsList((current) => [newProduct, ...current]);
      closeCreateModal();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  const filteredProducts = useMemo(
    () =>
      activeCategory === "Todos"
        ? productsList
        : productsList.filter((product) => product.category === activeCategory),
    [activeCategory, productsList]
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
              <div className="relative" ref={filterMenuRef}>
                <button
                  type="button"
                  onClick={() => setFilterMenuOpen((current) => !current)}
                  className="group w-[210px] rounded-[26px] border border-[#dce5ee] bg-gradient-to-b from-white to-[#fbfdff] px-4 py-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-[#cbd8e5]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Filtros
                      </span>
                      <span className="block truncate text-[14px] font-semibold text-slate-800">
                        {activeCategory}
                      </span>
                    </div>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#f6f9fc] text-slate-400 transition-colors group-hover:bg-[#effaf3] group-hover:text-[#0f9c68]">
                      <Filter size={15} />
                    </span>
                  </div>
                </button>

                {filterMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-72 rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
                    <p className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Categorias
                    </p>
                    <div className="rounded-[22px]">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setActiveCategory(category);
                            setFilterMenuOpen(false);
                          }}
                          className={`mx-1 mb-1 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-full px-4 py-3 text-left text-[14px] font-medium transition-colors last:mb-0 ${
                            category === activeCategory
                              ? "border border-[#bfe8c7] bg-[#f0fbf2] text-[#0f9c68] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span>{category}</span>
                          {category === activeCategory ? <span className="h-2.5 w-2.5 rounded-full bg-[#0f9c68]" /> : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

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
              <ProductCard key={product.id} product={product} />
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
                MovimentaÃ§Ãµes recentes
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
                Este mÃªs
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
            <p className="mt-4 text-[12px] font-medium text-slate-500">â— Quantidade de execuÃ§Ãµes</p>
          </section>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
              Consumo dos Ãºltimos 6 meses
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
              Este mÃªs
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

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <div
            ref={formRef}
            className="max-h-[92vh] w-full max-w-[1120px] overflow-auto rounded-[30px] border border-white/70 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-[34px] font-bold tracking-[-0.04em] text-slate-900">
                  Cadastrar novo item no estoque
                </h3>
                <p className="mt-3 text-[18px] leading-7 text-slate-500">
                  Preencha os dados do item para salvar no estoque automaticamente.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="rounded-full border border-[#dce5ee] p-3 text-[#159a4a] transition-colors hover:bg-[#f4fbf6]"
                aria-label="Fechar cadastro"
              >
                <X size={22} />
              </button>
            </div>

            <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">
                    Nome do equipamento
                  </span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => updateForm("name", event.target.value)}
                      placeholder="Ex.: Aparelho de ultrassom"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Categoria</span>
                  <FancySelect
                    label="Categoria"
                    value={form.category}
                    options={["Equipamentos", "Injetáveis", "Estéticos", "Consumíveis", "Odontológicos"]}
                    onSelect={(value) => updateForm("category", value)}
                    showLabel={false}
                    icon={Filter}
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Unidade</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Package2 size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.unit}
                      onChange={(event) => updateForm("unit", event.target.value)}
                      placeholder="1 unidade"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">
                    Resumo do estoque
                  </span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Boxes size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.stock}
                      onChange={(event) => updateForm("stock", event.target.value)}
                      placeholder="Novo equipamento cadastrado"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">
                    Disponibilidade mensal
                  </span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Sparkles size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.monthly}
                      onChange={(event) => updateForm("monthly", event.target.value)}
                      placeholder="Disponível para uso"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Uso atual</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <CircleDollarSign size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.ideal}
                      onChange={(event) => updateForm("ideal", event.target.value)}
                      placeholder="0%"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Quantidade mínima</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <CircleSlash2 size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.usage}
                      onChange={(event) => updateForm("usage", event.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Progresso</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <LineChart size={18} />
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.progress}
                      onChange={(event) => updateForm("progress", event.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>
              </div>

              {error ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-[18px] border border-[#bfe2c7] bg-white px-6 py-3.5 text-[16px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f4fbf6]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-[18px] bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-6 py-3.5 text-[16px] font-semibold text-white shadow-[0_16px_30px_rgba(16,185,129,0.24)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Salvando..." : "Salvar equipamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
