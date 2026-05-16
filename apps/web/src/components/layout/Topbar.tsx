"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid2x2,
  Plus,
  Search,
  Settings,
  Stethoscope,
  Wallet,
} from "lucide-react";

const titles: Record<string, string> = {
  "/resumo": "RESUMO DO DIA",
  "/crm": "CRM COM IA",
  "/agenda": "AGENDA",
  "/pacientes": "PACIENTES",
  "/procedimentos": "PROCEDIMENTOS",
  "/estoque": "ESTOQUE",
  "/financeiro": "FINANCEIRO",
  "/dashboards": "DASHBOARDS",
  "/configuracoes": "CONFIGURAÇÕES",
};

const configRangeOptions = [
  "Hoje",
  "Últimos 7 dias",
  "Últimos 30 dias",
  "Este mês",
  "Próximo mês",
];

const configFilterOptions = [
  "Todas",
  "Marca",
  "Acesso",
  "Integrações",
  "Segurança",
  "Operação",
];

const configPrefsKey = "vitale-config-topbar-prefs";

export function Topbar() {
  const pathname = usePathname();
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [configRangeOpen, setConfigRangeOpen] = useState(false);
  const [configFilterOpen, setConfigFilterOpen] = useState(false);
  const [configRange, setConfigRange] = useState(configRangeOptions[3]);
  const [configFilter, setConfigFilter] = useState(configFilterOptions[0]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const menuRef = useRef<HTMLDivElement>(null);
  const configRangeRef = useRef<HTMLDivElement>(null);
  const configFilterRef = useRef<HTMLDivElement>(null);
  const title =
    Object.entries(titles).find(([key]) => pathname.startsWith(key))?.[1] ?? "VITALE";
  const isDashboards = pathname.startsWith("/dashboards");
  const isEstoque = pathname.startsWith("/estoque");
  const isFinanceiro = pathname.startsWith("/financeiro");
  const isProcedimentos = pathname.startsWith("/procedimentos");
  const isCrm = pathname.startsWith("/crm");
  const isAgenda = pathname.startsWith("/agenda");
  const isPacientes = pathname.startsWith("/pacientes");

  useEffect(() => {
    if (!pathname.startsWith("/configuracoes")) {
      return;
    }

    try {
      const raw = localStorage.getItem(configPrefsKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as { range?: string; filter?: string };
      if (typeof parsed.range === "string" && configRangeOptions.includes(parsed.range)) {
        setConfigRange(parsed.range);
      }
      if (typeof parsed.filter === "string" && configFilterOptions.includes(parsed.filter)) {
        setConfigFilter(parsed.filter);
      }
    } catch {
      // Ignore malformed stored settings.
    }
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsNewMenuOpen(false);
      }

      if (configRangeRef.current && !configRangeRef.current.contains(event.target as Node)) {
        setConfigRangeOpen(false);
      }

      if (configFilterRef.current && !configFilterRef.current.contains(event.target as Node)) {
        setConfigFilterOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsNewMenuOpen(false);
        setConfigRangeOpen(false);
        setConfigFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isDashboards) {
    return (
      <header className="flex min-h-[88px] items-center justify-between rounded-[18px] border border-white/80 bg-white/95 px-6 shadow-[0_1px_6px_rgba(18,37,24,0.05)] backdrop-blur">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Visao estrategica da performance da sua clinica.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            01/05/2025 - 31/05/2025
            <CalendarDays size={16} />
          </button>

          <div ref={configFilterRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setConfigRangeOpen(false);
                setConfigFilterOpen((current) => !current);
              }}
              className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              <Filter size={16} />
              {configFilter}
            </button>

            {configFilterOpen ? (
              <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-64 rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
                <p className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Filtros
                </p>
                <div className="space-y-1">
                  {configFilterOptions.map((option) => {
                    const active = option === configFilter;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setConfigFilter(option);
                          setConfigFilterOpen(false);
                        }}
                        className={`mx-1 mb-1 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-[14px] px-4 py-3 text-left text-[14px] font-medium transition-colors last:mb-0 ${
                          active
                            ? "border border-[#bfe8c7] bg-[#f0fbf2] text-[#0f9c68]"
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

          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50">
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </header>
    );
  }

  if (pathname.startsWith("/configuracoes")) {
    return (
      <header className="flex min-h-[88px] items-center justify-between rounded-[18px] border border-white/80 bg-white/95 px-6 shadow-[0_1px_6px_rgba(18,37,24,0.05)] backdrop-blur">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-900">
            Configurações
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Gerencie preferências, acessos, integrações e identidade da clínica.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div ref={configRangeRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setConfigFilterOpen(false);
                setConfigRangeOpen((current) => !current);
              }}
              className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              {configRange}
              <ChevronDown size={16} />
            </button>

            {configRangeOpen ? (
              <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-64 rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
                <p className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Período
                </p>
                <div className="space-y-1">
                  {configRangeOptions.map((option) => {
                    const active = option === configRange;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setConfigRange(option);
                          setConfigRangeOpen(false);
                        }}
                        className={`mx-1 mb-1 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-[14px] px-4 py-3 text-left text-[14px] font-medium transition-colors last:mb-0 ${
                          active
                            ? "border border-[#bfe8c7] bg-[#f0fbf2] text-[#0f9c68]"
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

          <div ref={configFilterRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setConfigRangeOpen(false);
                setConfigFilterOpen((current) => !current);
              }}
              className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              <Filter size={16} />
              {configFilter}
            </button>

            {configFilterOpen ? (
              <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-64 rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
                <p className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Filtros
                </p>
                <div className="space-y-1">
                  {configFilterOptions.map((option) => {
                    const active = option === configFilter;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setConfigFilter(option);
                          setConfigFilterOpen(false);
                        }}
                        className={`mx-1 mb-1 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-[14px] px-4 py-3 text-left text-[14px] font-medium transition-colors last:mb-0 ${
                          active
                            ? "border border-[#bfe8c7] bg-[#f0fbf2] text-[#0f9c68]"
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

                    <button
            type="button"
            onClick={() => {
              try {
                localStorage.setItem(
                  configPrefsKey,
                  JSON.stringify({
                    range: configRange,
                    filter: configFilter,
                    savedAt: new Date().toISOString(),
                  })
                );
                window.dispatchEvent(
                  new CustomEvent("vitale:config-saved", {
                    detail: { range: configRange, filter: configFilter },
                  })
                );
                setSaveStatus("saved");
                window.setTimeout(() => setSaveStatus("idle"), 1800);
              } catch {
                // Ignore save failures in restricted environments.
              }
            }}
            className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95"
          >
            <Settings size={16} />
            {saveStatus === "saved" ? "Alterações salvas" : "Salvar alterações"}
          </button>
        </div>
      </header>
    );
  }

  if (isFinanceiro) {
    return (
      <header className="flex min-h-[88px] items-center justify-between rounded-[18px] border border-white/80 bg-white/95 px-6 shadow-[0_1px_6px_rgba(18,37,24,0.05)] backdrop-blur">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-900">Financeiro</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Acompanhe todas as movimentacoes financeiras da sua clinica.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            01/05/2025 - 31/05/2025
            <ChevronDown size={16} />
          </button>

          <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <Filter size={16} />
            Filtros
          </button>

          <Link
            href="/financeiro?new=1"
            className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95"
          >
            <Plus size={16} strokeWidth={2.2} />
            Nova movimentacao
            <ChevronDown size={16} />
          </Link>
        </div>
      </header>
    );
  }

  if (isEstoque) {
    return (
      <header className="flex min-h-[88px] items-center justify-between rounded-[18px] border border-white/80 bg-white/95 px-6 shadow-[0_1px_6px_rgba(18,37,24,0.05)] backdrop-blur">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-900">Estoque</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Controle inteligente de produtos, consumo e reposicao.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <label className="flex h-12 w-[230px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar produto..."
              className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <Filter size={16} />
            Filtros
          </button>

          <Link
            href="/estoque?new=1"
            className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95"
          >
            <Plus size={16} strokeWidth={2.2} />
            Adicionar item
            <ChevronDown size={16} />
          </Link>
        </div>
      </header>
    );
  }

  if (isProcedimentos) {
    return (
      <header className="flex min-h-[88px] items-center justify-between rounded-[18px] border border-white/80 bg-white/95 px-6 shadow-[0_1px_6px_rgba(18,37,24,0.05)] backdrop-blur">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-900">
            Procedimentos
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Gerencie os procedimentos realizados na clinica, valores, avaliacoes e desempenho.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <label className="flex h-12 w-[220px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar procedimento..."
              className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <Grid2x2 size={16} />
            Categorias
          </button>

          <Link
            href="/procedimentos?new=1"
            className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95"
          >
            <Plus size={16} strokeWidth={2.2} />
            Adicionar procedimento
          </Link>
        </div>
      </header>
    );
  }

  if (isCrm) {
    return (
      <header className="flex min-h-[88px] items-center justify-between rounded-[18px] border border-white/80 bg-white/95 px-6 shadow-[0_1px_6px_rgba(18,37,24,0.05)] backdrop-blur">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-900">CRM com IA</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Inteligencia para fortalecer o relacionamento com seus pacientes.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <label className="flex h-12 w-[220px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm">
            <input
              type="text"
              placeholder="Buscar paciente..."
              className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
            />
            <Search size={18} />
          </label>

          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50">
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <Link
            href="/pacientes?new=1"
            className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95"
          >
            <Plus size={16} strokeWidth={2.2} />
            Novo paciente
            <ChevronDown size={16} />
          </Link>

          <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <Filter size={16} />
            Filtros
          </button>
        </div>
      </header>
    );
  }

  if (isAgenda) {
    return (
      <header className="flex min-h-[80px] items-center justify-between rounded-[18px] border border-white/80 bg-white/95 px-6 shadow-[0_1px_6px_rgba(18,37,24,0.05)] backdrop-blur">
        <div className="flex items-center gap-4">
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-slate-900">
            Agenda
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            Hoje
          </button>

          <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <button className="flex h-10 w-10 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50">
              <ChevronLeft size={16} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>

          <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <span>18 - 24 de Maio, 2025</span>
            <ChevronDown size={16} />
          </button>

          <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <CalendarDays size={16} />
            <span>Semana</span>
            <ChevronDown size={16} />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50">
            <Settings size={16} />
          </button>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50">
            <Bell size={16} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("vitale:open-agenda-create"))}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22b24d] to-[#1cc68d] px-4 py-2 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(34,178,77,0.22)] transition-opacity hover:opacity-95"
          >
            <Plus size={16} strokeWidth={2.2} />
            Novo agendamento
            <ChevronDown size={16} />
          </button>
        </div>
      </header>
    );
  }

  if (isPacientes) {
    return (
      <header className="flex min-h-[76px] items-center justify-between rounded-[18px] border border-white/80 bg-white/95 px-6 shadow-[0_1px_6px_rgba(18,37,24,0.05)] backdrop-blur">
        <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-slate-900">
          Clientes
        </h1>

        <div className="flex items-center gap-3">
          <label className="flex h-12 w-[300px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm">
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
            />
            <Search size={18} />
          </label>

          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50">
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#19a14f] text-[14px] font-bold text-white shadow-sm">
            RG
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between rounded-[18px] border border-white/80 bg-white/95 px-6 shadow-[0_1px_6px_rgba(18,37,24,0.05)] backdrop-blur">
      <span className="text-[15px] font-semibold uppercase tracking-[0.02em] text-slate-600">
        {title}
      </span>

        <div className="flex items-center gap-4">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100">
            <Search size={16} />
          </button>

        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100">
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsNewMenuOpen((current) => !current)}
            aria-expanded={isNewMenuOpen}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#22b24d] to-[#1cc68d] px-4 py-2 text-[15px] font-semibold text-white transition-opacity hover:opacity-95"
          >
            <Plus size={16} strokeWidth={2.2} />
            Novo
            <ChevronDown size={15} />
          </button>

          {isNewMenuOpen ? (
            <div className="absolute right-0 top-full z-[60] mt-2 w-[290px] overflow-hidden rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_28px_80px_rgba(15,23,42,0.2)]">
              <div className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Ações rápidas
              </div>
              <Link
                href="/agenda?new=1"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <span>Novo agendamento</span>
                <CalendarDays size={16} className="text-[#22b24d]" />
              </Link>

              <Link
                href="/pacientes?new=1"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <span>Novo paciente</span>
                <Plus size={16} className="text-[#22b24d]" />
              </Link>

              <Link
                href="/procedimentos?new=1"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <span>Novo procedimento</span>
                <Stethoscope size={16} className="text-[#22b24d]" />
              </Link>

              <Link
                href="/estoque?new=1"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <span>Adicionar item no estoque</span>
                <Boxes size={16} className="text-[#22b24d]" />
              </Link>

              <Link
                href="/financeiro?new=1"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <span>Nova movimentação</span>
                <Wallet size={16} className="text-[#22b24d]" />
              </Link>
            </div>
          ) : null}
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2db39e] text-[14px] font-bold text-white shadow-sm">
          RG
        </button>
      </div>
    </header>
  );
}


