"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  FlaskConical,
  ChevronDown,
  Search,
  Tag,
  LineChart,
  Medal,
  Boxes,
  Package2,
  MoreVertical,
  Star,
  Stethoscope,
  TrendingUp,
  Users,
  Wallet,
  Smile,
  HeartPulse,
  ShieldPlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type MetricCard = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  accent: string;
  points: number[];
};

type ProcedureCard = {
  id: string;
  name: string;
  category: string;
  price: string;
  executions: string;
  rating: string;
  accent: string;
};

type ProcedureSeed = Omit<ProcedureCard, "id">;

type ProcedureFormState = {
  name: string;
  category: string;
  price: string;
  executions: string;
  rating: string;
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

const procedures: ProcedureSeed[] = [
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

const initialProcedures = procedures.map((procedure) => ({
  ...procedure,
  id: procedure.name,
}));

const initialForm: ProcedureFormState = {
  name: "",
  category: "EstÃ©tico",
  price: "",
  executions: "",
  rating: "4,8",
};

const proceduresStorageKey = "vitale-procedures";

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
        className="group flex h-[76px] w-full items-center rounded-[20px] border border-[#dce5ee] bg-white px-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-[#cbd8e5] focus:outline-none focus:ring-4 focus:ring-[#19a14f]/8"
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

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f6f9fc] text-slate-400 transition-colors group-hover:bg-[#effaf3] group-hover:text-[#0f9c68]">
            <ChevronDown size={16} />
          </span>
        </div>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+10px)] z-30 w-full rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
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
                  className={`mx-1 mb-1 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-full px-4 py-3 text-left text-[14px] font-medium transition-colors last:mb-0 ${
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

function accentForCategory(category: string) {
  if (category === "Odontológico") {
    return "from-[#f8d7d3] via-[#feece8] to-[#d8b5a8]";
  }

  if (category === "Terapêutico") {
    return "from-[#e7f7fb] via-[#f4fbfd] to-[#b9e5ef]";
  }

  if (category === "Outros") {
    return "from-[#f4ecff] via-[#faf6ff] to-[#d9c7fb]";
  }

  return "from-[#f3d8c3] via-[#f9e9d9] to-[#f7c49c]";
}

export function ProcedimentosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const [proceduresList, setProceduresList] = useState(initialProcedures);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProcedureFormState>(initialForm);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(proceduresStorageKey);

      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as ProcedureCard[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setProceduresList(parsed);
      }
    } catch {
      localStorage.removeItem(proceduresStorageKey);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(proceduresStorageKey, JSON.stringify(proceduresList));
    } catch {
      // Ignore localStorage failures and keep the page usable.
    }
  }, [proceduresList]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setError("");
      setForm(initialForm);
      setCreateOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setCreateOpen(false);
      }

      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(event.target as Node)) {
        setCategoriesMenuOpen(false);
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
    setForm(initialForm);
    setCreateOpen(true);
    router.push("/procedimentos?new=1");
  }

  function closeCreateModal() {
    setCreateOpen(false);
    setError("");
    setForm(initialForm);
    router.replace("/procedimentos");
  }

  function updateForm<K extends keyof ProcedureFormState>(key: K, value: ProcedureFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function matchesCategory(category: string) {
    if (activeCategory === "Todos") {
      return true;
    }

    const mappedCategory =
      activeCategory === "Estéticos"
        ? "Estético"
        : activeCategory === "Odontológicos"
          ? "Odontológico"
          : activeCategory === "Terapêuticos"
            ? "Terapêutico"
            : activeCategory;

    return category === mappedCategory;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.name.trim()) {
        throw new Error("Preencha o nome do procedimento.");
      }

      const newProcedure: ProcedureCard = {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        category: form.category,
        price: form.price.trim() || "R$ 0,00",
        executions: `${form.executions.trim() || "0"} realizados este mês`,
        rating: form.rating.trim() || "4,8 (0)",
        accent: accentForCategory(form.category),
      };

      setProceduresList((current) => [newProcedure, ...current]);
      closeCreateModal();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  const filteredProcedures = proceduresList.filter((procedure) => matchesCategory(procedure.category));

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

              <div className="relative" ref={categoriesMenuRef}>
                <button
                  type="button"
                  onClick={() => setCategoriesMenuOpen((current) => !current)}
                  className="group w-[210px] rounded-[26px] border border-[#dce5ee] bg-gradient-to-b from-white to-[#fbfdff] px-4 py-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-[#cbd8e5]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Categorias
                      </span>
                      <span className="block truncate text-[14px] font-semibold text-slate-800">
                        {activeCategory}
                      </span>
                    </div>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#f6f9fc] text-slate-400 transition-colors group-hover:bg-[#effaf3] group-hover:text-[#0f9c68]">
                      <ChevronDown size={16} />
                    </span>
                  </div>
                </button>

                {categoriesMenuOpen ? (
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
                            setCategoriesMenuOpen(false);
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
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
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
            {filteredProcedures.map((procedure) => (
              <ProcedureCardView key={procedure.id ?? procedure.name} procedure={procedure} />
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

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <div
            ref={formRef}
            className="max-h-[92vh] w-full max-w-[1120px] overflow-auto rounded-[30px] border border-white/70 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-[34px] font-bold tracking-[-0.04em] text-slate-900">
                  Cadastrar novo procedimento
                </h3>
                <p className="mt-3 text-[18px] leading-7 text-slate-500">
                  Preencha os dados do procedimento para salvar e exibir nos cards e relatórios.
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
                    Nome do procedimento
                  </span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => updateForm("name", event.target.value)}
                      placeholder="Ex.: Bioestimulador de colágeno"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">
                    Categoria
                  </span>
                  <FancySelect
                    label="Categoria"
                    value={form.category}
                    options={["Estético", "Odontológico", "Terapêutico", "Outros"]}
                    onSelect={(value) => updateForm("category", value)}
                    showLabel={false}
                    icon={Tag}
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Preço</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <CircleDollarSign size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.price}
                      onChange={(event) => updateForm("price", event.target.value)}
                      placeholder="R$ 1.290,00"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">
                    Execuções no mês
                  </span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <FlaskConical size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.executions}
                      onChange={(event) => updateForm("executions", event.target.value)}
                      placeholder="42"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">
                    Avaliação
                  </span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Star size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.rating}
                      onChange={(event) => updateForm("rating", event.target.value)}
                      placeholder="4,8"
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
                  {saving ? "Salvando..." : "Salvar procedimento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
