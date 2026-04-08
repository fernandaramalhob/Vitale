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
  { label: "Resumo do Dia",  href: "/resumo",       icon: LayoutDashboard },
  { label: "CRM com IA",     href: "/crm",           icon: BrainCircuit },
  { label: "Agenda",         href: "/agenda",        icon: Calendar },
  { label: "Pacientes",      href: "/pacientes",     icon: Heart },
  { label: "Procedimentos",  href: "/procedimentos", icon: Stethoscope },
  { label: "Estoque",        href: "/estoque",       icon: Package },
  { label: "Financeiro",     href: "/financeiro",    icon: Wallet },
  { label: "Dashboards",     href: "/dashboards",    icon: BarChart3 },
  { label: "Configuracoes",  href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[242px] flex flex-col h-full shrink-0" style={{ backgroundColor: "#218a45" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
        >
          <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-body)" }}>V</span>
        </div>
        <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "var(--font-body)" }}>
          Vitale
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest px-3 mb-3"
          style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}
        >
          Operacional
        </p>
        <ul className="space-y-0.5">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: active ? "rgba(255,255,255,0.18)" : "transparent",
                    color: active ? "#ffffff" : "rgba(255,255,255,0.75)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all hover:bg-white/10">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.22)" }}
          >
            CC
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate" style={{ fontFamily: "var(--font-body)" }}>
              Clinica Central
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}>
              Premium
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
