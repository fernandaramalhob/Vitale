"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Banknote,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  Landmark,
  LineChart,
  ReceiptText,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  XCircle,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Metric = {
  label: string;
  value: string;
  delta: string;
  deltaTone: "green" | "red" | "amber";
  icon: LucideIcon;
  accent: string;
  points: number[];
};

type Movement = {
  id: string;
  date: string;
  description: string;
  category: string;
  type: string;
  value: string;
  status: string;
  payment: string;
  statusTone: "green" | "red" | "amber";
};

type MovementSeed = Omit<Movement, "id">;

type MovementFormState = {
  date: string;
  description: string;
  category: string;
  type: "Receita" | "Despesa";
  amount: string;
  status: "Recebido" | "Pago" | "Pendente";
  payment: string;
};

type PendingRevenue = {
  patient: string;
  description: string;
  due: string;
  value: string;
  tone: "amber" | "green";
};

type ExpenseItem = {
  name: string;
  value: string;
  percent: string;
  color: string;
};

type Account = {
  name: string;
  bank: string;
  balance: string;
  color: string;
  icon: LucideIcon;
};

type MonthlySummary = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
};

const metrics: Metric[] = [
  {
    label: "Receitas",
    value: "R$ 186.430,00",
    delta: "+18,7%",
    deltaTone: "green",
    icon: CircleDollarSign,
    accent: "from-[#e9fbef] to-[#f6fffa] text-[#159a4a]",
    points: [8, 9, 10, 11, 10, 12, 14, 13, 15, 14, 16, 18],
  },
  {
    label: "Despesas",
    value: "R$ 63.780,00",
    delta: "+9,8%",
    deltaTone: "red",
    icon: TrendingDown,
    accent: "from-[#fff0f0] to-[#fff8f8] text-[#ef4444]",
    points: [7, 8, 8, 9, 10, 9, 11, 10, 10, 11, 12, 12],
  },
  {
    label: "Lucro líquido",
    value: "R$ 122.650,00",
    delta: "+22,3%",
    deltaTone: "green",
    icon: Wallet,
    accent: "from-[#f3efff] to-[#faf8ff] text-[#8f5af7]",
    points: [7, 8, 8, 9, 10, 11, 10, 12, 13, 12, 14, 15],
  },
  {
    label: "Recebíveis pendentes",
    value: "R$ 28.180,00",
    delta: "12 títulos",
    deltaTone: "amber",
    icon: Bell,
    accent: "from-[#fff5e7] to-[#fffaf1] text-[#f59e0b]",
    points: [12, 11, 12, 13, 12, 14, 13, 14, 15, 14, 15, 16],
  },
];

const filters = ["Todos", "Receitas", "Despesas", "Recebíveis", "Pagamentos"];

const movements: MovementSeed[] = [
  {
    date: "28/05/2025",
    description: "Harmonização Facial - Juliana Silva",
    category: "Procedimentos",
    type: "Receita",
    value: "R$ 2.800,00",
    status: "Recebido",
    payment: "Cartão de Crédito",
    statusTone: "green",
  },
  {
    date: "28/05/2025",
    description: "Toxina Botulínica - Pedro Costa",
    category: "Procedimentos",
    type: "Receita",
    value: "R$ 1.200,00",
    status: "Recebido",
    payment: "PIX",
    statusTone: "green",
  },
  {
    date: "27/05/2025",
    description: "Aluguel da clínica",
    category: "Despesa Fixa",
    type: "Despesa",
    value: "- R$ 4.500,00",
    status: "Pago",
    payment: "Débito em Conta",
    statusTone: "green",
  },
  {
    date: "27/05/2025",
    description: "Material de consumo",
    category: "Despesa Variável",
    type: "Despesa",
    value: "- R$ 1.250,00",
    status: "Pendente",
    payment: "PIX",
    statusTone: "amber",
  },
  {
    date: "26/05/2025",
    description: "Peeling Químico - Ana Oliveira",
    category: "Procedimentos",
    type: "Receita",
    value: "R$ 680,00",
    status: "Pago",
    payment: "Boleto",
    statusTone: "green",
  },
  {
    date: "25/05/2025",
    description: "Salário Equipe",
    category: "Despesa Fixa",
    type: "Despesa",
    value: "- R$ 9.750,00",
    status: "Pago",
    payment: "Débito em Conta",
    statusTone: "green",
  },
  {
    date: "25/05/2025",
    description: "Preenchimento Labial - Carla Mendes",
    category: "Procedimentos",
    type: "Receita",
    value: "R$ 1.900,00",
    status: "Recebido",
    payment: "Cartão de Crédito",
    statusTone: "green",
  },
  {
    date: "24/05/2025",
    description: "Internet e telefone",
    category: "Despesa Fixa",
    type: "Despesa",
    value: "- R$ 320,00",
    status: "Pago",
    payment: "Débito em Conta",
    statusTone: "green",
  },
];

const financeStorageKey = "vitale-finance-movements";

const initialMovementForm: MovementFormState = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  category: "Procedimentos",
  type: "Receita",
  amount: "",
  status: "Recebido",
  payment: "PIX",
};

const pendingRevenue: PendingRevenue[] = [
  {
    patient: "Juliana Silva",
    description: "Harmonização Facial",
    due: "01/06/2025",
    value: "R$ 2.890,00",
    tone: "amber",
  },
  {
    patient: "Carla Mendes",
    description: "Preenchimento Labial",
    due: "03/06/2025",
    value: "R$ 1.900,00",
    tone: "amber",
  },
  {
    patient: "Fernanda Lima",
    description: "Toxina Botulínica",
    due: "10/06/2025",
    value: "R$ 1.200,00",
    tone: "green",
  },
];

const expenseItems: ExpenseItem[] = [
  { name: "Despesas Fixas", value: "R$ 15.440,00", percent: "48%", color: "#159a4a" },
  { name: "Despesas Variáveis", value: "R$ 8.760,00", percent: "27%", color: "#14b8a6" },
  { name: "Material e insumos", value: "R$ 7.120,00", percent: "22%", color: "#f59e0b" },
  { name: "Outros", value: "R$ 1.070,00", percent: "3%", color: "#8f5af7" },
];

const accounts: Account[] = [
  { name: "Conta Principal", bank: "Banco Nubank", balance: "R$ 85.430,00", color: "bg-[#f2fbf5] text-[#159a4a]", icon: Landmark },
  { name: "Conta Reserva", bank: "Banco Itaú", balance: "R$ 32.860,00", color: "bg-[#eef6ff] text-[#2f6fed]", icon: Wallet },
  { name: "Caixa", bank: "Dinheiro em caixa", balance: "R$ 1.250,00", color: "bg-[#fff5e7] text-[#f59e0b]", icon: Banknote },
];

const monthlySummary: MonthlySummary[] = [
  { label: "Maior receita do mês", value: "Harmonização Facial", icon: TrendingUp, tone: "text-[#159a4a]" },
  { label: "Maior despesa do mês", value: "Salário Equipe", icon: TrendingDown, tone: "text-[#ef4444]" },
  { label: "Ticket médio", value: "R$ 1.280,40", icon: CircleDollarSign, tone: "text-[#8f5af7]" },
  { label: "Procedimentos faturados", value: "146", icon: ReceiptText, tone: "text-[#14b8a6]" },
];

function sparkPath(points: number[], width = 220, height = 60) {
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
    <svg viewBox="0 0 220 60" className="h-[60px] w-full">
      <path d={sparkPath(points)} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <article className="rounded-[22px] border border-[#e4ebf1] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${metric.accent}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="mt-4 text-[14px] font-medium text-slate-700">{metric.label}</p>
      <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900">{metric.value}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
        <span className={`font-semibold ${metric.deltaTone === "red" ? "text-[#ef4444]" : metric.deltaTone === "amber" ? "text-[#f59e0b]" : "text-[#159a4a]"}`}>
          {metric.delta}
        </span>
        <span className="text-slate-500">vs mês anterior</span>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 px-2 py-2">
        <Sparkline
          points={metric.points}
          color={metric.deltaTone === "red" ? "#ef4444" : metric.accent.includes("8f5af7") ? "#8f5af7" : metric.accent.includes("14b8a6") ? "#14b8a6" : metric.accent.includes("f59e0b") ? "#f59e0b" : "#159a4a"}
        />
      </div>
    </article>
  );
}

function StatusPill({ tone, children }: { tone: "green" | "red" | "amber"; children: React.ReactNode }) {
  const classes =
    tone === "green"
      ? "bg-[#f2fbf5] text-[#159a4a]"
      : tone === "amber"
        ? "bg-[#fff7e8] text-[#f59e0b]"
        : "bg-[#fff1f1] text-[#ef4444]";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${classes}`}>{children}</span>;
}

function DonutChart() {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { stroke: "#159a4a", value: 0.48 },
    { stroke: "#14b8a6", value: 0.27 },
    { stroke: "#f59e0b", value: 0.22 },
    { stroke: "#8f5af7", value: 0.03 },
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
      <text x="70" y="66" textAnchor="middle" className="fill-slate-900 text-[18px] font-bold">
        R$18.420
      </text>
      <text x="70" y="86" textAnchor="middle" className="fill-slate-500 text-[10px] font-medium">
        Total
      </text>
    </svg>
  );
}

function MonthChart() {
  const points = [100, 130, 120, 140, 120, 145];
  const path = sparkPath(points, 380, 120);

  return (
    <svg viewBox="0 0 380 150" className="h-[150px] w-full">
      <line x1="0" y1="120" x2="380" y2="120" stroke="#e7edf3" strokeWidth="1" />
      <path d={path} fill="none" stroke="#159a4a" strokeWidth="2.6" strokeLinecap="round" />
      {points.map((point, index) => {
        const min = Math.min(...points);
        const max = Math.max(...points);
        const range = Math.max(max - min, 1);
        const x = (index / Math.max(points.length - 1, 1)) * 380;
        const y = 120 - ((point - min) / range) * 120;
        return <circle key={index} cx={x} cy={y} r="3.8" fill="#159a4a" />;
      })}
    </svg>
  );
}

function toneForStatus(status: MovementFormState["status"]): "green" | "red" | "amber" {
  if (status === "Pendente") {
    return "amber";
  }

  return status === "Pago" ? "green" : "green";
}

function normalizeAmount(value: string) {
  const digits = value.replace(/[^\d,.-]/g, "").replace(",", ".");
  const parsed = Number(digits);
  if (!Number.isFinite(parsed)) {
    return "0,00";
  }

  return parsed.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type FancySelectProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  showLabel?: boolean;
  icon?: LucideIcon;
};

function FancySelect({ label, value, options, onSelect, showLabel = true, icon: Icon }: FancySelectProps) {
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
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${open ? "bg-[#edf8f1] text-[#0f9c68]" : "bg-[#eff7f1] text-[#159a4a]"}`}>
                <Icon size={18} />
              </span>
            ) : null}
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
        <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full rounded-[18px] border border-[#dce5ee] bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
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

export function FinanceiroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [movementsList, setMovementsList] = useState<Movement[]>(() =>
    movements.map((movement) => ({
      ...movement,
      id: `${movement.date}-${movement.description}`,
    }))
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<MovementFormState>(initialMovementForm);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(financeStorageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as Movement[];
      if (Array.isArray(parsed)) {
        setMovementsList(parsed.filter((item) => item && typeof item.id === "string"));
      }
    } catch {
      // Keep seeded movements when storage is unavailable or malformed.
    }
  }, []);

  useEffect(() => {
    if (movementsList.length) {
      localStorage.setItem(financeStorageKey, JSON.stringify(movementsList));
    }
  }, [movementsList]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setError("");
      setForm(initialMovementForm);
      setCreateOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setCreateOpen(false);
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
    setForm(initialMovementForm);
    setCreateOpen(true);
    router.push("/financeiro?new=1");
  }

  function closeCreateModal() {
    setCreateOpen(false);
    setError("");
    setForm(initialMovementForm);
    router.replace("/financeiro");
  }

  function updateForm<K extends keyof MovementFormState>(key: K, value: MovementFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const filteredMovements = useMemo(() => {
    return movementsList.filter((movement) => {
      if (activeFilter === "Todos") {
        return true;
      }

      if (activeFilter === "Receitas") {
        return movement.type === "Receita";
      }

      if (activeFilter === "Despesas") {
        return movement.type === "Despesa";
      }

      if (activeFilter === "Recebíveis") {
        return movement.status === "Pendente";
      }

      if (activeFilter === "Pagamentos") {
        return movement.status === "Pago";
      }

      return true;
    });
  }, [activeFilter, movementsList]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.description.trim()) {
        throw new Error("Preencha a descrição da movimentação.");
      }

      const amount = normalizeAmount(form.amount);
      const isExpense = form.type === "Despesa";
      const signedValue = isExpense ? `- R$ ${amount}` : `R$ ${amount}`;

      const newMovement: Movement = {
        id: crypto.randomUUID(),
        date: form.date.split("-").reverse().join("/"),
        description: form.description.trim(),
        category: form.category,
        type: form.type,
        value: signedValue,
        status: form.status,
        payment: form.payment,
        statusTone: toneForStatus(form.status),
      };

      setMovementsList((current) => [newMovement, ...current]);
      closeCreateModal();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Movimentações recentes
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-wrap items-center gap-2 rounded-full border border-[#dfe6ef] bg-white px-2 py-2">
                {filters.map((filter, index) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      activeFilter === filter || (index === 0 && activeFilter === "Todos")
                        ? "bg-[#f1fbf4] text-[#159a4a]"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 shadow-sm">
                <Download size={14} className="mr-2 inline-block" />
                Exportar
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[16px] border border-[#edf1f4]">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Pagamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1f4] bg-white">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="text-[13px] text-slate-700">
                    <td className="px-4 py-4 whitespace-nowrap">{movement.date}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{movement.description}</td>
                    <td className="px-4 py-4">{movement.category}</td>
                    <td className="px-4 py-4">
                      <StatusPill tone={movement.type === "Receita" ? "green" : "red"}>{movement.type}</StatusPill>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{movement.value}</td>
                    <td className="px-4 py-4">
                      <StatusPill tone={movement.statusTone}>{movement.status}</StatusPill>
                    </td>
                    <td className="px-4 py-4">{movement.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Resumo do mês
              </h2>
              <button className="rounded-full bg-[#f2fbf5] px-2.5 py-1 text-[12px] font-semibold text-[#159a4a]">
                Ver
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {monthlySummary.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 ${item.tone}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-slate-500">{item.label}</p>
                      <p className="mt-1 text-[14px] font-semibold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/financeiro" className="mt-4 flex items-center justify-center gap-2 text-[14px] font-semibold text-[#159a4a]">
              Ver relatório completo
              <ArrowRight size={16} />
            </Link>
          </section>

          <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
                Contas financeiras
              </h2>
            </div>

            <div className="mt-4 space-y-3">
              {accounts.map((account) => {
                const Icon = account.icon;

                return (
                  <div key={account.name} className="flex items-center gap-3 rounded-[16px] border border-[#edf1f4] bg-[#fbfcfd] p-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${account.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-slate-900">{account.name}</p>
                      <p className="text-[12px] text-slate-500">{account.bank}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-semibold text-slate-900">{account.balance}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="mt-4 flex h-11 w-full items-center justify-center rounded-2xl border border-[#d7e6dc] bg-white text-[14px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f7fffa]">
              Ver todas as contas
            </button>
          </section>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
              Recebíveis em aberto
            </h2>
            <button className="text-[13px] font-semibold text-[#159a4a]">Ver todos</button>
          </div>

          <div className="mt-5 overflow-hidden rounded-[16px] border border-[#edf1f4]">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-4 py-3">Paciente</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1f4] bg-white">
                {pendingRevenue.map((item) => (
                  <tr key={`${item.patient}-${item.due}`} className="text-[13px] text-slate-700">
                    <td className="px-4 py-4 font-medium text-slate-900">{item.patient}</td>
                    <td className="px-4 py-4">{item.description}</td>
                    <td className="px-4 py-4">{item.due}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{item.value}</td>
                    <td className="px-4 py-4">
                      <StatusPill tone={item.tone}>{item.tone === "amber" ? "A vencer" : "Em dia"}</StatusPill>
                    </td>
                  </tr>
                ))}
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-[14px] text-slate-500" colSpan={7}>
                      Nenhuma movimentação encontrada para este filtro.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
              Despesas por categoria
            </h2>
            <button className="text-[13px] font-semibold text-[#159a4a]">Ver todas</button>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <DonutChart />
          </div>

          <div className="mt-5 space-y-3">
            {expenseItems.map((item) => (
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
        </section>
      </section>

      <section className="rounded-[22px] border border-[#e5ebf0] bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[18px] font-bold tracking-[-0.03em] text-slate-900">
            Faturamento dos últimos 6 meses
          </h2>
          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 shadow-sm">
            Este mês
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_280px]">
          <div className="rounded-[18px] bg-white">
            <MonthChart />
          </div>

          <div className="rounded-[18px] bg-[#f7fbf8] p-4">
            <div className="flex items-center gap-2 text-[#159a4a]">
              <Sparkles size={18} />
              <span className="text-[14px] font-semibold">Destaque do período</span>
            </div>
            <p className="mt-3 text-[16px] font-bold tracking-[-0.03em] text-slate-900">
              A receita cresceu 18,7% e o lucro líquido bateu R$ 122,6 mil.
            </p>
            <p className="mt-3 text-[14px] leading-7 text-slate-600">
              A IA aponta crescimento consistente em procedimentos de alto valor e melhora na taxa de recebimento.
            </p>
          </div>
        </div>
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
                  Adicionar financeiro
                </h3>
                <p className="mt-3 text-[18px] leading-7 text-slate-500">
                  Preencha os dados da movimentação para salvar automaticamente.
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
                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Data</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <CalendarDays size={18} />
                    </span>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(event) => updateForm("date", event.target.value)}
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Tipo</span>
                  <FancySelect
                    label="Tipo"
                    value={form.type}
                    options={["Receita", "Despesa"]}
                    onSelect={(value) => updateForm("type", value as MovementFormState["type"])}
                    showLabel={false}
                    icon={CircleDollarSign}
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Descrição</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <ReceiptText size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.description}
                      onChange={(event) => updateForm("description", event.target.value)}
                      placeholder="Ex: Harmonização facial - Juliana Silva"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Categoria</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Filter size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(event) => updateForm("category", event.target.value)}
                      placeholder="Procedimentos"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Valor</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <DollarSign size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.amount}
                      onChange={(event) => updateForm("amount", event.target.value)}
                      placeholder="Ex: 2800"
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Status</span>
                  <FancySelect
                    label="Status"
                    value={form.status}
                    options={["Recebido", "Pago", "Pendente"]}
                    onSelect={(value) => updateForm("status", value as MovementFormState["status"])}
                    showLabel={false}
                    icon={CheckCircle2}
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Pagamento</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <CreditCard size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.payment}
                      onChange={(event) => updateForm("payment", event.target.value)}
                      placeholder="PIX"
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
                  {saving ? "Salvando..." : "Salvar movimentação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
