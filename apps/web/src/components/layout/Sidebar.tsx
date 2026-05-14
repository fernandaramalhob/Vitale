"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BrainCircuit,
  Calendar,
  Heart,
  Stethoscope,
  Package,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

const nav = [
  { label: "Resumo do Dia", href: "/resumo", icon: LayoutDashboard },
  { label: "CRM com IA", href: "/crm", icon: BrainCircuit },
  { label: "Agenda", href: "/agenda", icon: Calendar },
  { label: "Pacientes", href: "/pacientes", icon: Heart },
  { label: "Procedimentos", href: "/procedimentos", icon: Stethoscope },
  { label: "Estoque", href: "/estoque", icon: Package },
  { label: "Financeiro", href: "/financeiro", icon: Wallet },
  { label: "Dashboards", href: "/dashboards", icon: BarChart3 },
  { label: "Configuracoes", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-[calc(100vh-24px)] w-[254px] shrink-0 flex-col rounded-[22px] bg-[#11a83a] px-4 py-4 shadow-[0_12px_30px_rgba(13,76,31,0.08)]">
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/18 text-[18px] font-bold text-white shadow-inner">
          V
        </div>
        <span className="text-[22px] font-bold tracking-tight text-white">Vitale</span>
      </div>

      <nav className="flex-1 pt-8">
        <p className="px-4 pb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Operacional
        </p>

        <ul className="space-y-2">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");

            return (
              <li key={href}>
                <Link
                  href={href}
                  className="relative flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold transition-colors"
                  style={{
                    backgroundColor: active ? "rgba(255,255,255,0.16)" : "transparent",
                    color: active ? "#ffffff" : "rgba(255,255,255,0.88)",
                  }}
                >
                  {active ? (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                  ) : null}
                  <Icon size={15} strokeWidth={1.9} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[12px] font-bold text-white">
            CC
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-white">Clínica Central</p>
            <p className="text-[12px] text-white/60">Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
