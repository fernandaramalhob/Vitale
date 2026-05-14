"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid2x2,
  Plus,
  Search,
  Settings,
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

export function Topbar() {
  const pathname = usePathname();
  const title =
    Object.entries(titles).find(([key]) => pathname.startsWith(key))?.[1] ?? "VITALE";
  const isDashboards = pathname.startsWith("/dashboards");
  const isEstoque = pathname.startsWith("/estoque");
  const isFinanceiro = pathname.startsWith("/financeiro");
  const isProcedimentos = pathname.startsWith("/procedimentos");
  const isCrm = pathname.startsWith("/crm");
  const isAgenda = pathname.startsWith("/agenda");
  const isPacientes = pathname.startsWith("/pacientes");

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

          <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <Filter size={16} />
            Filtros
          </button>

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
          <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            01/05/2025 - 31/05/2025
            <ChevronDown size={16} />
          </button>

          <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
            <Filter size={16} />
            Filtros
          </button>

          <button className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95">
            <Settings size={16} />
            Salvar alterações
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

          <button className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95">
            <Plus size={16} strokeWidth={2.2} />
            Nova movimentacao
            <ChevronDown size={16} />
          </button>
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

          <button className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95">
            <Plus size={16} strokeWidth={2.2} />
            Adicionar item
            <ChevronDown size={16} />
          </button>
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

          <button className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95">
            <Plus size={16} strokeWidth={2.2} />
            Adicionar procedimento
          </button>
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

          <Link
            href="/agenda?new=1"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22b24d] to-[#1cc68d] px-4 py-2 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(34,178,77,0.22)] transition-opacity hover:opacity-95"
          >
            <Plus size={16} strokeWidth={2.2} />
            Novo agendamento
            <ChevronDown size={16} />
          </Link>
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

        <button className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#22b24d] to-[#1cc68d] px-4 py-2 text-[15px] font-semibold text-white transition-opacity hover:opacity-95">
          <Plus size={16} strokeWidth={2.2} />
          Novo
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2db39e] text-[14px] font-bold text-white shadow-sm">
          RG
        </button>
      </div>
    </header>
  );
}
