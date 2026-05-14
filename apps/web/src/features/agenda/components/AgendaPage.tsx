"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type WeekDay = {
  key: string;
  short: string;
  day: string;
  active?: boolean;
};

type Appointment = {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  category: string;
  procedure_name: string;
  notes: string | null;
  status: string;
  created_at: string;
};

type AppointmentFormState = {
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: string;
  category: string;
  procedureName: string;
  notes: string;
};

const weekDays: WeekDay[] = [
  { key: "dom", short: "DOM", day: "18" },
  { key: "seg", short: "SEG", day: "19" },
  { key: "ter", short: "TER", day: "20", active: true },
  { key: "qua", short: "QUA", day: "21" },
  { key: "qui", short: "QUI", day: "22" },
  { key: "sex", short: "SEX", day: "23" },
  { key: "sab", short: "SAB", day: "24" },
];

const timelineHours = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const miniCalendarWeeks = [
  ["27", "28", "29", "30", "1", "2", "3"],
  ["4", "5", "6", "7", "8", "9", "10"],
  ["11", "12", "13", "14", "15", "16", "17"],
  ["18", "19", "20", "21", "22", "23", "24"],
  ["25", "26", "27", "28", "29", "30", "31"],
];

const dayMeta: Record<string, { title: string }> = {
  "18": { title: "Domingo, 18 de Maio" },
  "19": { title: "Segunda-feira, 19 de Maio" },
  "20": { title: "Terca-feira, 20 de Maio" },
  "21": { title: "Quarta-feira, 21 de Maio" },
  "22": { title: "Quinta-feira, 22 de Maio" },
  "23": { title: "Sexta-feira, 23 de Maio" },
  "24": { title: "Sabado, 24 de Maio" },
};

const categoryOptions = [
  "Consulta",
  "Procedimentos",
  "Estética facial",
  "Laser",
  "Corporais",
  "Avaliações",
  "Outros",
];

const initialForm: AppointmentFormState = {
  patientName: "",
  appointmentDate: new Date().toISOString().slice(0, 10),
  appointmentTime: "08:00",
  durationMinutes: "60",
  category: "Consulta",
  procedureName: "",
  notes: "",
};

export function AgendaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDay, setSelectedDay] = useState("20");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  const meta = dayMeta[selectedDay] ?? dayMeta["20"];

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadAppointments() {
      try {
        setIsLoadingAppointments(true);
        const response = await fetch("/api/appointments", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar os agendamentos.");
        }

        const payload = (await response.json()) as { appointments?: Appointment[] };
        setAppointments(payload.appointments ?? []);
      } catch (loadError) {
        console.error(loadError);
        setAppointments([]);
      } finally {
        setIsLoadingAppointments(false);
      }
    }

    void loadAppointments();
  }, []);

  function openModal() {
    setError("");
    setIsModalOpen(true);
    router.push("/agenda?new=1");
  }

  function closeModal() {
    setIsModalOpen(false);
    setError("");
    router.replace("/agenda");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as {
        appointment?: Appointment;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Nao foi possivel salvar o agendamento.");
      }

      if (payload.appointment) {
        setAppointments((current) => [payload.appointment!, ...current]);
      }

      setForm(initialForm);
      closeModal();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro inesperado.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-[24px] border border-[#e5e9ef] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <div
            className="relative overflow-hidden rounded-[18px] border border-[#e7edf3] bg-white"
            style={{
              display: "grid",
              gridTemplateColumns: "84px repeat(7, minmax(0, 1fr))",
              gridTemplateRows: "72px repeat(13, 64px)",
            }}
          >
            <div className="flex items-center justify-start border-b border-r border-[#e7edf3] px-4 text-[12px] font-medium text-slate-400">
              GMT-3
            </div>

            {weekDays.map((day, index) => (
              <div
                key={day.key}
                className="flex flex-col items-center justify-center border-b border-r border-[#e7edf3] px-3 py-3 text-slate-700 last:border-r-0"
                style={{ gridColumn: index + 2, gridRow: 1 }}
              >
                <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-500">
                  {day.short}
                </span>
                <span
                  className={`mt-2 flex h-9 w-9 items-center justify-center rounded-xl text-[18px] font-medium ${
                    day.active
                      ? "bg-[#19a14f] text-white shadow-[0_8px_18px_rgba(25,161,79,0.22)]"
                      : "text-slate-700"
                  }`}
                >
                  {day.day}
                </span>
              </div>
            ))}

            {timelineHours.map((hour, index) => (
              <div
                key={`${hour}-label`}
                className="flex items-start justify-start border-r border-[#eef2f7] px-4 py-2 text-[13px] text-slate-500"
                style={{ gridColumn: 1, gridRow: index + 2 }}
              >
                {hour}
              </div>
            ))}

            {timelineHours.map((hour, hourIndex) =>
              weekDays.map((day, dayIndex) => (
                <div
                  key={`${day.key}-${hour}`}
                  className="border-r border-t border-[#eef2f7] last:border-r-0"
                  style={{ gridColumn: dayIndex + 2, gridRow: hourIndex + 2 }}
                />
              ))
            )}

            <div
              className="pointer-events-none absolute left-[84px] right-0 z-10 h-px bg-red-400"
              style={{ top: "calc(72px + 5 * 64px + 32px)" }}
            >
              <span className="absolute -left-[68px] -top-[13px] rounded-md bg-red-500 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
                15:30
              </span>
            </div>
          </div>
        </div>

        <aside className="rounded-[24px] border border-[#e5e9ef] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between">
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-slate-800">
              {meta.title}
            </h2>
            <button className="text-slate-400 transition-colors hover:text-slate-600">
              <X size={18} />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between text-slate-500">
            <button className="rounded-full border border-slate-200 p-1.5 transition-colors hover:bg-slate-50">
              <ChevronLeft size={14} />
            </button>
            <p className="text-[14px] font-semibold text-slate-700">Maio 2025</p>
            <button className="rounded-full border border-slate-200 p-1.5 transition-colors hover:bg-slate-50">
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="mt-4 rounded-[20px] border border-[#edf1f5] bg-white p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold tracking-[0.22em] text-slate-400">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-y-3 text-center text-[13px] text-slate-600">
              {miniCalendarWeeks.flatMap((week, weekIndex) =>
                week.map((day) => {
                  const active = day === "20";
                  const muted = weekIndex < 3 && Number(day) > 24;

                  return (
                    <button
                      key={`${weekIndex}-${day}`}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        active
                          ? "bg-[#19a14f] text-white shadow-[0_8px_18px_rgba(25,161,79,0.22)]"
                          : "hover:bg-slate-100"
                      } ${muted ? "text-slate-300" : ""}`}
                    >
                      {day}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-8 rounded-[18px] border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-center">
            <CalendarDays className="mx-auto text-[#0f9c68]" size={18} />
            <p className="mt-3 text-[14px] font-semibold text-slate-800">
              {isLoadingAppointments
                ? "Carregando agendamentos..."
                : appointments.length === 0
                  ? "Sem agendamentos preenchidos"
                  : `${appointments.length} agendamento(s) criado(s)`}
            </p>
            <p className="mt-1 text-[13px] leading-6 text-slate-500">
              Esta agenda vai ser preenchida por voce.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-[14px] font-semibold text-[#0f9c68] transition-colors hover:bg-slate-50"
          >
            <Plus size={16} className="mr-2" />
            Novo agendamento
          </button>

          <div className="mt-5 space-y-3">
            {appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-[16px] border border-[#e9edf3] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-slate-800">
                      {appointment.patient_name}
                    </p>
                    <p className="mt-1 text-[12px] text-slate-500">
                      {appointment.procedure_name}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    {appointment.duration_minutes}min
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-500">
                  <Clock3 size={14} className="text-[#0f9c68]" />
                  <span>
                    {appointment.appointment_date} às {appointment.appointment_time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="rounded-[20px] border border-[#e5e9ef] bg-white px-6 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center gap-6 text-[14px]">
          <div className="flex items-center gap-3 text-slate-700">
            <CalendarDays size={16} className="text-[#0f9c68]" />
            <span className="font-semibold">Legenda de atendimentos</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
              Consulta
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0f9c68]" />
              Procedimentos
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
              Estetica facial
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f472b6]" />
              Laser
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
              Corporais
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#86efac]" />
              Avaliacoes
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
              Outros
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-slate-500">
        <p className="text-[15px] font-semibold text-slate-800">Agenda vazia</p>
        <p className="mt-2 text-[14px] leading-6">
          Nenhum horario foi criado ainda. Use o botao{" "}
          <span className="font-semibold text-[#0f9c68]">Novo agendamento</span> para
          adicionar seus horarios quando quiser.
        </p>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[26px] font-bold tracking-[-0.03em] text-slate-900">
                  Novo agendamento
                </h3>
                <p className="mt-2 text-[14px] leading-6 text-slate-500">
                  Preencha os dados para salvar o horario no sistema.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50"
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                    Nome do paciente
                  </span>
                  <input
                    type="text"
                    value={form.patientName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, patientName: event.target.value }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                    placeholder="Ex.: Juliana Silva"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                    Procedimento
                  </span>
                  <input
                    type="text"
                    value={form.procedureName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, procedureName: event.target.value }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                    placeholder="Ex.: Botox"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                    Data
                  </span>
                  <input
                    type="date"
                    value={form.appointmentDate}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, appointmentDate: event.target.value }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                    Horario
                  </span>
                  <input
                    type="time"
                    value={form.appointmentTime}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, appointmentTime: event.target.value }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                    Duração em minutos
                  </span>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={form.durationMinutes}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, durationMinutes: event.target.value }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                    placeholder="60"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                    Categoria
                  </span>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, category: event.target.value }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                  Observações
                </span>
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                  placeholder="Ex.: primeira consulta, trazer exames, etc."
                />
              </label>

              {error ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-12 rounded-2xl border border-slate-200 px-5 text-[14px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex h-12 items-center justify-center rounded-2xl bg-[#22c55e] px-6 text-[14px] font-semibold text-white shadow-[0_16px_30px_rgba(34,197,94,0.22)] transition-colors hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Salvando..." : "Salvar agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
