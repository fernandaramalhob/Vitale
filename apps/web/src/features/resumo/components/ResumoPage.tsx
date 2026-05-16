"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";

type CardItem = {
  hora: string;
  nome: string;
  proc: string;
};

type KanbanColumn = {
  id: string;
  label: string;
  count: number;
  gradient: string;
  pacientes: CardItem[];
};

type CardFormState = {
  hora: string;
  nome: string;
  proc: string;
};

const kpis = [
  { label: "OCUPACAO DA AGENDA", value: "91%" },
  { label: "COMPARECIMENTO PREVISTO", value: "84%" },
  { label: "ESPERA MEDIA ALVO", value: "11 min" },
];

const seedColunas: KanbanColumn[] = [
  {
    id: "confirmados",
    label: "Confirmados",
    count: 2,
    gradient: "linear-gradient(90deg, #24994a 0%, #1ca282 100%)",
    pacientes: [
      { hora: "08:30", nome: "Luciana Freitas", proc: "Bioestimulador" },
      { hora: "09:15", nome: "Carla Mendes", proc: "Preenchimento" },
    ],
  },
  {
    id: "preparo",
    label: "Em preparo",
    count: 2,
    gradient: "linear-gradient(90deg, #24994a 0%, #88d62d 100%)",
    pacientes: [
      { hora: "10:15", nome: "Renata Borges", proc: "Bioestimulador" },
      { hora: "11:00", nome: "Patricia Lima", proc: "Toxina botulinica" },
    ],
  },
  {
    id: "atendimento",
    label: "Em atendimento",
    count: 2,
    gradient: "linear-gradient(90deg, #24994a 0%, #1bb19d 100%)",
    pacientes: [
      { hora: "13:40", nome: "Juliana Vilela", proc: "Harmonizacao facial" },
      { hora: "14:20", nome: "Beatriz Costa", proc: "Fios de PDO" },
    ],
  },
  {
    id: "posconsulta",
    label: "Pos-consulta",
    count: 2,
    gradient: "linear-gradient(90deg, #24994a 0%, #1bb19d 100%)",
    pacientes: [
      { hora: "16:10", nome: "Marcos Telles", proc: "Laser vascular" },
      { hora: "16:50", nome: "Amanda Rocha", proc: "Peeling quimico" },
    ],
  },
];

const initialCardForm: CardFormState = {
  hora: "08:00",
  nome: "",
  proc: "",
};

export function ResumoPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(seedColunas);
  const [cardForm, setCardForm] = useState<CardFormState>(initialCardForm);
  const [addOpen, setAddOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string>(seedColunas[0]?.id ?? "");

  const activeColumn = useMemo(
    () => columns.find((column) => column.id === activeColumnId) ?? columns[0],
    [activeColumnId, columns]
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setAddOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAddOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function openAddCard(columnId: string) {
    const targetColumn = columns.find((column) => column.id === columnId) ?? columns[0];
    setActiveColumnId(targetColumn?.id ?? "");
    setCardForm(initialCardForm);
    setAddOpen(true);
  }

  function closeAddCard() {
    setAddOpen(false);
    setCardForm(initialCardForm);
  }

  function updateCardForm<K extends keyof CardFormState>(key: K, value: CardFormState[K]) {
    setCardForm((current) => ({ ...current, [key]: value }));
  }

  function handleAddCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nome = cardForm.nome.trim();
    const proc = cardForm.proc.trim();

    if (!nome || !proc || !activeColumn) {
      return;
    }

    const newCard: CardItem = {
      hora: cardForm.hora,
      nome,
      proc,
    };

    setColumns((current) =>
      current.map((column) =>
        column.id === activeColumn.id
          ? { ...column, count: column.count + 1, pacientes: [...column.pacientes, newCard] }
          : column
      )
    );

    closeAddCard();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[22px] border border-[#d9e4de] bg-[linear-gradient(90deg,#ecf9ef_0%,#eefcff_100%)] px-8 py-8 shadow-[0_1px_3px_rgba(18,37,24,0.05)]">
        <h1 className="max-w-5xl text-[30px] font-bold leading-[1.02] tracking-[-0.03em] text-[#121826] md:text-[56px]">
          Operacao clinica pronta para o pico da tarde
        </h1>
        <p className="mt-4 max-w-5xl text-[18px] leading-8 text-[#4b5563]">
          A operacao entra no pico com agenda alta, CRM aquecido e dois pontos
          de risco que pedem resposta rapida do time clinico e comercial.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[22px] border border-[#e7ece9] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#7f8b90]">
                {kpi.label}
              </p>
              <p className="text-[41px] font-bold leading-none text-[#111827]">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-[#dfe6e1] bg-white px-8 py-8 shadow-[0_1px_3px_rgba(18,37,24,0.05)]">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.38em] text-[#4d8d73]">
              AGENDA DO DIA
            </p>
            <h2 className="text-[30px] font-bold tracking-[-0.03em] text-[#111827] md:text-[56px]">
              Kanban do turno
            </h2>
          </div>
          <span className="pb-2 text-[16px] font-medium text-[#4d8d73]">
            8 pacientes
          </span>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {columns.map((col) => (
            <div key={col.id} className="space-y-4">
              <div
                className="flex items-center justify-between rounded-[28px] px-4 py-3 shadow-[0_0_0_6px_rgba(27,158,84,0.08)]"
                style={{ background: col.gradient }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[14px] font-bold text-[#4f5b63] shadow-sm">
                    {col.count}
                  </span>
                  <span className="text-[15px] font-semibold text-white">
                    {col.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openAddCard(col.id)}
                  className="text-[26px] font-light leading-none text-white/85 transition-colors hover:text-white"
                  aria-label={`Adicionar paciente em ${col.label}`}
                >
                  +
                </button>
              </div>

              {col.pacientes.map((p) => (
                <div
                  key={p.nome}
                  className="cursor-pointer rounded-[18px] border border-[#edf0ec] bg-white px-4 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_22px_rgba(21,48,31,0.08)]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full border border-[#eceff1] px-4 py-1 text-[11px] font-semibold tracking-[0.24em] text-[#45515f]">
                      {p.hora}
                    </span>
                    <button className="text-[16px] font-medium text-[#adb7c4]">
                      ↗
                    </button>
                  </div>
                  <p className="text-[25px] font-semibold leading-tight tracking-[-0.03em] text-[#1a2233]">
                    {p.nome}
                  </p>
                  <p className="mt-3 text-[19px] text-[#46525e]">{p.proc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {addOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <div
            ref={formRef}
            className="w-full max-w-xl rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[26px] font-bold tracking-[-0.03em] text-slate-900">
                  Adicionar paciente
                </h3>
                <p className="mt-2 text-[14px] leading-6 text-slate-500">
                  Inclua mais uma pessoa na coluna {activeColumn?.label ?? "selecionada"}.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddCard}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleAddCard}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">Hora</span>
                  <input
                    type="time"
                    value={cardForm.hora}
                    onChange={(event) => updateCardForm("hora", event.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">Nome</span>
                  <input
                    type="text"
                    value={cardForm.nome}
                    onChange={(event) => updateCardForm("nome", event.target.value)}
                    placeholder="Ex.: Ana Silva"
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                    Procedimento
                  </span>
                  <input
                    type="text"
                    value={cardForm.proc}
                    onChange={(event) => updateCardForm("proc", event.target.value)}
                    placeholder="Ex.: Bioestimulador"
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddCard}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[14px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
