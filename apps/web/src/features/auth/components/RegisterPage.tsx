"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BarChart3, Eye, EyeOff, Lock, Mail, SquareCheckBig, User, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const highlights = [
  {
    icon: SquareCheckBig,
    title: "Cadastro único",
    description: "A conta fica salva no banco para futuros acessos.",
  },
  {
    icon: Zap,
    title: "Fluxo simples",
    description: "Crie a conta uma vez e entre quantas vezes precisar.",
  },
  {
    icon: BarChart3,
    title: "Base organizada",
    description: "Usuários e sessões armazenados de forma persistente.",
  },
];

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next") ?? "/resumo";
  const nextPath = requestedNext.startsWith("/") ? requestedNext : "/resumo";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        router.push(nextPath);
        router.refresh();
        return;
      }

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInData.session) {
        router.push(nextPath);
        router.refresh();
        return;
      }

      if (signInError) {
        setNotice(
          "Conta criada. Se a confirmação por e-mail estiver ativa no Supabase, confirme a mensagem recebida para entrar."
        );
        return;
      }

      setNotice("Conta criada com sucesso.");
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
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] items-center px-4 py-6 lg:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <section className="flex flex-col justify-between rounded-[36px] px-4 py-4 sm:px-6 lg:px-10 lg:py-10">
            <div className="max-w-xl">
              <span className="bg-gradient-to-r from-[#22c55e] via-[#14b8a6] to-[#0f766e] bg-clip-text text-6xl font-extrabold tracking-tight text-transparent sm:text-7xl lg:text-[6.5rem]">
                Vitale
              </span>

              <h1 className="mt-10 max-w-lg text-[2.4rem] font-bold leading-[1.05] tracking-[-0.04em] text-[#1e293b] sm:text-[3rem] lg:text-[3.8rem]">
                Crie sua conta para começar.
              </h1>

              <p className="mt-6 max-w-lg text-[1.12rem] leading-8 text-slate-500">
                Seu cadastro fica salvo no banco para acessar depois sem refazer tudo.
              </p>

              <div className="mt-14 space-y-8">
                {highlights.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                      <Icon className="text-[#22c55e]" size={26} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 className="text-[1.1rem] font-semibold text-[#0f766e]">{title}</h2>
                      <p className="mt-2 text-[1.02rem] leading-7 text-slate-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-[680px] rounded-[30px] border border-[#e2e8f0] bg-white/96 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10 lg:px-16 lg:py-16">
              <div className="mx-auto max-w-[520px]">
                <h2 className="text-[2.8rem] font-bold tracking-[-0.04em] text-[#1e293b]">
                  Criar conta
                </h2>
                <p className="mt-4 text-[1.1rem] text-slate-500">
                  Preencha os dados abaixo para começar na Vitale.
                </p>

                <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
                  <label className="block">
                    <span className="mb-3 block text-[1.05rem] font-semibold text-slate-700">
                      Nome completo
                    </span>
                    <div className="flex h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                      <User size={22} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Seu nome"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="w-full bg-transparent text-[1.08rem] text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </label>

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

                  <label className="block">
                    <span className="mb-3 block text-[1.05rem] font-semibold text-slate-700">
                      Confirmar senha
                    </span>
                    <div className="flex h-16 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                      <Lock size={22} className="text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••••"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="w-full bg-transparent text-[1.08rem] text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#22c55e] text-[1.15rem] font-semibold text-white shadow-[0_18px_36px_rgba(34,197,94,0.20)] transition-colors hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Criando..." : "Criar conta"}
                  </button>
                </form>

                {error ? (
                  <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[0.98rem] text-red-700">
                    {error}
                  </p>
                ) : null}

                {notice ? (
                  <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[0.98rem] text-emerald-700">
                    {notice}
                  </p>
                ) : null}

                <p className="mt-10 text-center text-[1rem] text-slate-500">
                  Já tem conta?{" "}
                  <Link href="/" className="font-semibold text-[#0f9c68] hover:underline">
                    Entrar
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
