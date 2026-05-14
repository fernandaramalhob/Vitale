"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  SquareCheckBig,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const highlights = [
  {
    icon: SquareCheckBig,
    title: "Mais organização",
    description: "Processos estruturados e centralizados.",
  },
  {
    icon: Zap,
    title: "Mais eficiência",
    description: "Automação e fluxo contínuo de tarefas.",
  },
  {
    icon: BarChart3,
    title: "Mais resultados",
    description: "Dados inteligentes para decisões melhores.",
  },
];

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next") ?? "/resumo";
  const nextPath = requestedNext.startsWith("/") ? requestedNext : "/resumo";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      router.push(nextPath);
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-44 -top-44 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.16)_0%,rgba(20,184,166,0.08)_38%,rgba(255,255,255,0)_72%)]" />
        <div className="absolute bottom-[-10rem] right-[-7rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.14)_0%,rgba(20,184,166,0.08)_38%,rgba(255,255,255,0)_72%)]" />
        <div className="absolute left-10 top-20 grid gap-3 opacity-35">
          {Array.from({ length: 3 }).map((_, index) => (
            <span
              key={index}
              className="h-4 w-4 rounded-[4px] bg-gradient-to-br from-[#22c55e] to-[#14b8a6]"
              style={{ opacity: 0.1 + index * 0.12, transform: `translateX(${index * 22}px)` }}
            />
          ))}
        </div>
        <div className="absolute right-10 top-10 grid grid-cols-8 gap-2 opacity-25">
          {Array.from({ length: 64 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-slate-300/60" />
          ))}
        </div>
        <div className="absolute left-0 top-0 h-80 w-80 rounded-br-full border border-[#22c55e]/15" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-tr-full border border-[#14b8a6]/15" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] items-center px-4 py-6 lg:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <section className="flex flex-col justify-between rounded-[36px] px-4 py-4 sm:px-6 lg:px-10 lg:py-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-4">
                <span className="bg-gradient-to-r from-[#22c55e] via-[#14b8a6] to-[#0f766e] bg-clip-text text-6xl font-extrabold tracking-tight text-transparent sm:text-7xl lg:text-[6.5rem]">
                  Vitale
                </span>
              </div>

              <h1 className="mt-10 max-w-lg text-[2.4rem] font-bold leading-[1.05] tracking-[-0.04em] text-[#1e293b] sm:text-[3rem] lg:text-[3.8rem]">
                Organize e escale sua operação clínica.
              </h1>

              <p className="mt-6 max-w-lg text-[1.12rem] leading-8 text-slate-500">
                Gestão comercial, operacional e financeira em uma única plataforma.
              </p>

              <div className="mt-14 space-y-8">
                {highlights.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                      <Icon className="text-[#22c55e]" size={26} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 className="text-[1.1rem] font-semibold text-[#0f766e]">
                        {title}
                      </h2>
                      <p className="mt-2 text-[1.02rem] leading-7 text-slate-500">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 hidden items-center gap-3 text-xs text-slate-400 lg:flex">
              <Sparkles size={14} className="text-[#14b8a6]" />
              <span>Plataforma moderna para gestão comercial, operacional e financeira.</span>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-[680px] rounded-[30px] border border-[#e2e8f0] bg-white/96 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10 lg:px-16 lg:py-16">
              <div className="mx-auto max-w-[520px]">
                <h2 className="text-[2.8rem] font-bold tracking-[-0.04em] text-[#1e293b]">
                  Acesse sua conta
                </h2>
                <p className="mt-4 text-[1.1rem] text-slate-500">
                  Entre para continuar na plataforma Vitale.
                </p>

                <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
                  <label className="block">
                    <span className="mb-3 block text-[1.05rem] font-semibold text-slate-700">
                      E-mail
                    </span>
                    <div className="flex h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                      <Mail size={22} className="text-slate-400" />
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full bg-transparent text-[1.08rem] text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-[1.05rem] font-semibold text-slate-700">
                      Senha
                    </span>
                    <div className="flex h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                      <Lock size={22} className="text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full bg-transparent text-[1.08rem] text-slate-700 outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                  </label>

                  <div className="flex items-center justify-between gap-4 text-[1rem]">
                    <label className="flex items-center gap-3 text-slate-600">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-[#22c55e] focus:ring-[#22c55e]"
                      />
                      Lembrar de mim
                    </label>

                    <a href="#" className="font-medium text-[#0f9c68] hover:underline">
                      Esqueci minha senha
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-16 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#22c55e] via-[#14b8a6] to-[#0f766e] text-[1.15rem] font-semibold text-white shadow-[0_18px_36px_rgba(34,197,94,0.20)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="text-[1rem] font-medium text-slate-400">ou</span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>

                  <button
                    type="button"
                    className="flex h-16 w-full items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white text-[1.05rem] font-medium text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition-colors hover:bg-slate-50"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <span className="text-[1.2rem] font-bold text-[#4285F4]">G</span>
                    </span>
                    Entrar com Google
                  </button>

                  <div className="pt-2 text-center text-[1rem] text-slate-500">
                    Não tem conta?{" "}
                    <Link href="/cadastro" className="font-semibold text-[#0f9c68] hover:underline">
                      Criar conta
                    </Link>
                  </div>
                </form>

                {error ? (
                  <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[0.98rem] text-red-700">
                    {error}
                  </p>
                ) : null}

                <p className="mt-14 flex items-center gap-3 text-[0.98rem] text-slate-400">
                  <Lock size={16} />
                  Seus dados estão protegidos com segurança de nível empresarial.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
