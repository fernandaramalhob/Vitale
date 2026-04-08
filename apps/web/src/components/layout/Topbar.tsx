"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Plus } from "lucide-react";

const titles: Record<string, string> = {
  "/resumo":       "RESUMO DO DIA",
  "/crm":          "CRM COM IA",
  "/agenda":       "AGENDA",
  "/pacientes":    "PACIENTES",
  "/procedimentos":"PROCEDIMENTOS",
  "/estoque":      "ESTOQUE",
  "/financeiro":   "FINANCEIRO",
  "/dashboards":   "DASHBOARDS",
  "/configuracoes":"CONFIGURACOES",
};

export function Topbar() {
  const pathname = usePathname();
  const title = Object.entries(titles).find(([key]) =>
    pathname.startsWith(key)
  )?.[1] ?? "VITALE";

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
      <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
        {title}
      </span>

      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <Search size={16} />
        </button>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        <button className="flex items-center gap-1.5 bg-[#1a7a3c] hover:bg-[#166834] text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
          <Plus size={15} />
          Novo
        </button>

        <button className="w-8 h-8 rounded-full bg-[#1a7a3c] flex items-center justify-center text-white text-xs font-bold">
          RG
        </button>
      </div>
    </header>
  );
}
