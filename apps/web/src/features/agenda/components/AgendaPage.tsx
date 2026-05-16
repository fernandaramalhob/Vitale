"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Tag,
  UserRound,
  Stethoscope,
  Settings,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Appointment = {
  id: string;
  patient_name: string;
  doctor_name?: string | null;
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
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: string;
  category: string;
  procedureName: string;
  notes: string;
};

type AppointmentFormMode = "create" | "edit";

type CalendarMode = "week" | "day" | "month";
type DensityMode = "comfortable" | "compact";

type CalendarDay = {
  date: Date;
  short: string;
  day: string;
  active: boolean;
  today: boolean;
};

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

const categoryOptions = [
  "Consulta",
  "Procedimentos",
  "Estetica facial",
  "Laser",
  "Corporais",
  "Avaliacoes",
  "Outros",
];

const categoryToneMap: Record<string, string> = {
  Consulta: "bg-[#e7f9ee] text-[#159a4a]",
  Procedimentos: "bg-[#eefbf4] text-[#0f9c68]",
  "Estetica facial": "bg-[#f2efff] text-[#7c3aed]",
  Laser: "bg-[#fff0f6] text-[#db2777]",
  Corporais: "bg-[#fff6e8] text-[#c2410c]",
  Avaliacoes: "bg-[#edf8f1] text-[#159a4a]",
  Outros: "bg-[#edf1f5] text-slate-600",
};

type FancySelectProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  icon?: LucideIcon;
};

function FancySelect({ label, value, options, onSelect, icon: Icon }: FancySelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-[76px] w-full items-center rounded-[20px] border bg-white px-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-[#b7d9c2] focus:outline-none focus:ring-4 focus:ring-[#19a14f]/8 ${
          open ? "border-[#19a14f]" : "border-[#dce5ee]"
        }`}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {Icon ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                <Icon size={18} />
              </span>
            ) : null}
            <div className="min-w-0">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {label}
              </span>
              <span className="block truncate text-[18px] font-medium text-slate-800">{value}</span>
            </div>
          </div>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              open
                ? "bg-[#edf8f1] text-[#0f9c68]"
                : "bg-[#f6f9fc] text-slate-400 hover:bg-[#effaf3] hover:text-[#0f9c68]"
            }`}
          >
            <ChevronRight size={16} className="rotate-90" />
          </span>
        </div>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+10px)] z-40 w-full rounded-[18px] border border-[#dce5ee] bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
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
  );
}

const weekShort = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const initialForm: AppointmentFormState = {
  patientName: "",
  doctorName: "",
  appointmentDate: toDateKey(new Date()),
  appointmentTime: "08:00",
  durationMinutes: "60",
  category: "Consulta",
  procedureName: "",
  notes: "",
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function sameDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b);
}

function startOfMonth(date: Date) {
  const next = new Date(date);
  next.setDate(1);
  next.setHours(0, 0, 0, 0);
  return next;
}

function buildMonthGrid(date: Date) {
  const monthStart = startOfMonth(date);
  const firstGridDay = addDays(monthStart, -monthStart.getDay());
  const weeks: Date[][] = [];

  for (let week = 0; week < 6; week += 1) {
    const row: Date[] = [];
    for (let day = 0; day < 7; day += 1) {
      row.push(addDays(firstGridDay, week * 7 + day));
    }
    weeks.push(row);
  }

  return weeks;
}

function buildWeekDays(date: Date): CalendarDay[] {
  const weekStart = startOfWeek(date);
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const current = addDays(weekStart, index);
    return {
      date: current,
      short: weekShort[index] ?? "",
      day: String(current.getDate()),
      active: sameDay(current, date),
      today: sameDay(current, today),
    };
  });
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return (hour ?? 0) * 60 + (minute ?? 0);
}

function formatMonthTitle(date: Date) {
  return `${monthNames[date.getMonth()] ?? ""} ${date.getFullYear()}`;
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatRange(start: Date, end: Date) {
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
  return `${start.toLocaleDateString("pt-BR", options)} - ${end.toLocaleDateString("pt-BR", options)}`;
}

function formatDayHeader(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function createDemoAppointments(baseDate: Date): Appointment[] {
  const today = toDateKey(baseDate);
  const tomorrow = toDateKey(addDays(baseDate, 1));
  const yesterday = toDateKey(addDays(baseDate, -1));

  return [
    {
      id: "demo-1",
      patient_name: "Juliana Silva",
      doctor_name: "Dra. Marina Costa",
      appointment_date: today,
      appointment_time: "08:30",
      duration_minutes: 60,
      category: "Procedimentos",
      procedure_name: "Harmonizacao Facial",
      notes: "Confirmar chegada 15 min antes.",
      status: "Agendado",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-2",
      patient_name: "Pedro Costa",
      doctor_name: "Dr. Ricardo Alves",
      appointment_date: today,
      appointment_time: "10:00",
      duration_minutes: 45,
      category: "Consulta",
      procedure_name: "Avaliacao inicial",
      notes: "Trazer exames recentes.",
      status: "Agendado",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-3",
      patient_name: "Carla Mendes",
      doctor_name: "Dra. Beatriz Lima",
      appointment_date: tomorrow,
      appointment_time: "13:30",
      duration_minutes: 90,
      category: "Laser",
      procedure_name: "Laser Lavieen",
      notes: "Pausar skincare agressivo.",
      status: "Agendado",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-4",
      patient_name: "Ana Oliveira",
      doctor_name: "Dr. Felipe Nunes",
      appointment_date: yesterday,
      appointment_time: "16:00",
      duration_minutes: 60,
      category: "Avaliacoes",
      procedure_name: "Retorno de tratamento",
      notes: "Revisar evolucao.",
      status: "Concluido",
      created_at: new Date().toISOString(),
    },
  ];
}

export function AgendaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<CalendarMode>("week");
  const [density, setDensity] = useState<DensityMode>("comfortable");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<AppointmentFormMode>("create");
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const demoAppointments = useMemo(() => createDemoAppointments(new Date()), []);
  const allAppointments = useMemo(
    () => [...demoAppointments, ...appointments].sort((a, b) => {
      const left = `${a.appointment_date}T${a.appointment_time}`;
      const right = `${b.appointment_date}T${b.appointment_time}`;
      return left.localeCompare(right);
    }),
    [appointments, demoAppointments]
  );

  const weekDays = useMemo(() => buildWeekDays(selectedDate), [selectedDate]);
  const monthGrid = useMemo(() => buildMonthGrid(selectedDate), [selectedDate]);
  const selectedKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);
  const monthAppointmentsByDate = useMemo(() => {
    const grouped = new Map<string, Appointment[]>();

    allAppointments.forEach((appointment) => {
      const current = grouped.get(appointment.appointment_date) ?? [];
      current.push(appointment);
      grouped.set(appointment.appointment_date, current);
    });

    return grouped;
  }, [allAppointments]);
  const selectedDayAppointments = useMemo(
    () => allAppointments.filter((item) => item.appointment_date === selectedKey),
    [allAppointments, selectedKey]
  );
  const visibleDays =
    viewMode === "week" ? weekDays : viewMode === "day" ? [weekDays.find((day) => day.active) ?? weekDays[0]] : [];
  const visibleKeys = useMemo(
    () => new Set(visibleDays.map((day) => toDateKey(day.date))),
    [visibleDays]
  );
  const visibleAppointments = useMemo(
    () => allAppointments.filter((item) => visibleKeys.has(item.appointment_date)),
    [allAppointments, visibleKeys]
  );
  const weekRange = useMemo(
    () => formatRange(weekDays[0].date, weekDays[weekDays.length - 1].date),
    [weekDays]
  );
  const monthTitle = useMemo(() => formatMonthTitle(selectedDate), [selectedDate]);
  const selectedTitle = useMemo(() => formatLongDate(selectedDate), [selectedDate]);
  const selectedHeader = useMemo(() => formatDayHeader(selectedDate), [selectedDate]);
  const nextAppointment = useMemo(() => {
    const now = new Date();
    return (
      allAppointments
        .map((item) => ({ ...item, dateTime: new Date(`${item.appointment_date}T${item.appointment_time}`) }))
        .filter((item) => item.dateTime >= now)
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())[0] ?? allAppointments[0] ?? null
    );
  }, [allAppointments]);
  const selectedAppointment = useMemo(
    () => allAppointments.find((item) => item.id === selectedAppointmentId) ?? null,
    [allAppointments, selectedAppointmentId]
  );

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setError("");
      setFormMode("create");
      setEditingAppointmentId(null);
      setSelectedAppointmentId(null);
      setForm((current) => ({ ...current, appointmentDate: selectedKey }));
      setIsModalOpen(true);
    }
  }, [searchParams, selectedKey]);

  useEffect(() => {
    function handleOpenCreate() {
      setError("");
      setFormMode("create");
      setEditingAppointmentId(null);
      setSelectedAppointmentId(null);
      setForm((current) => ({ ...current, appointmentDate: selectedKey }));
      setIsModalOpen(true);
    }

    window.addEventListener("vitale:open-agenda-create", handleOpenCreate as EventListener);

    return () => {
      window.removeEventListener("vitale:open-agenda-create", handleOpenCreate as EventListener);
    };
  }, [selectedKey]);

  useEffect(() => {
    async function loadAppointments() {
      try {
        setIsLoadingAppointments(true);
        const response = await fetch("/api/appointments", { cache: "no-store" });

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

  function openEditModal(appointment: Appointment) {
    setError("");
    setFormMode("edit");
    setEditingAppointmentId(appointment.id);
    setForm({
      patientName: appointment.patient_name,
      doctorName: appointment.doctor_name ?? "",
      appointmentDate: appointment.appointment_date,
      appointmentTime: appointment.appointment_time,
      durationMinutes: String(appointment.duration_minutes),
      category: appointment.category,
      procedureName: appointment.procedure_name,
      notes: appointment.notes ?? "",
    });
    setSelectedDate(fromDateKey(appointment.appointment_date));
    setSelectedAppointmentId(appointment.id);
    setSidebarOpen(true);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setError("");
    setForm(initialForm);
    setFormMode("create");
    setEditingAppointmentId(null);
    router.replace("/agenda");
  }

  function goToday() {
    setSelectedDate(new Date());
  }

  function moveSelection(direction: -1 | 1) {
    setSelectedDate((current) => {
      if (viewMode === "month") {
        return addMonths(current, direction);
      }

      const step = viewMode === "week" ? 7 : 1;
      return addDays(current, direction * step);
    });
  }

  function toggleDensity() {
    setDensity((current) => (current === "comfortable" ? "compact" : "comfortable"));
  }

  function focusNextAppointment() {
    if (!nextAppointment) {
      return;
    }

    setSelectedDate(fromDateKey(nextAppointment.appointment_date));
    setViewMode("day");
    setSidebarOpen(true);
    setSelectedAppointmentId(nextAppointment.id);
  }

  function handleSelectCalendarDay(day: Date) {
    setSelectedDate(day);
    setSelectedAppointmentId(null);
  }

  function handleSelectAppointment(appointmentId: string) {
    const appointment = allAppointments.find((item) => item.id === appointmentId);

    if (!appointment) {
      return;
    }

    setSelectedAppointmentId(appointmentId);
    setSidebarOpen(true);
    openEditModal(appointment);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const isEditing = formMode === "edit" && editingAppointmentId;
      const response = await fetch("/api/appointments", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          appointmentId: editingAppointmentId,
        }),
      });

      const payload = (await response.json()) as {
        appointment?: Appointment;
        updatedAppointment?: Appointment;
        message?: string;
      };

      const localAppointment: Appointment = {
        id: crypto.randomUUID(),
        patient_name: form.patientName.trim(),
        doctor_name: form.doctorName.trim() || null,
        appointment_date: form.appointmentDate,
        appointment_time: form.appointmentTime,
        duration_minutes: Number(form.durationMinutes) || 60,
        category: form.category,
        procedure_name: form.procedureName.trim(),
        notes: form.notes.trim() || null,
        status: "Agendado",
        created_at: new Date().toISOString(),
      };
      const localUpdatedAppointment: Appointment = {
        ...localAppointment,
        id: editingAppointmentId ?? localAppointment.id,
      };

      if (!response.ok) {
        if (response.status === 503) {
          if (isEditing) {
            setAppointments((current) =>
              current.map((item) => (item.id === editingAppointmentId ? { ...item, ...localUpdatedAppointment } : item))
            );
          } else {
            setAppointments((current) => [localAppointment, ...current]);
          }
          closeModal();
          return;
        }

        throw new Error(payload.message ?? "Nao foi possivel salvar o agendamento.");
      }

      if (isEditing && payload.updatedAppointment) {
        setAppointments((current) =>
          current.map((item) =>
            item.id === payload.updatedAppointment!.id ? payload.updatedAppointment! : item
          )
        );
        setSelectedAppointmentId(payload.updatedAppointment.id);
      } else if (payload.appointment) {
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

  const rowHeight = density === "compact" ? 54 : 64;
  const timelineTemplateRows = `72px repeat(${timelineHours.length}, ${rowHeight}px)`;
  const timelineTemplateColumns =
    viewMode === "week" ? "84px repeat(7, minmax(0, 1fr))" : "84px minmax(0, 1fr)";
  const dayColumnCount = viewMode === "week" ? 7 : 1;
  const rangeLabel = viewMode === "month" ? monthTitle : viewMode === "week" ? weekRange : selectedHeader;
  const modeLabel = viewMode === "week" ? "Semana" : viewMode === "day" ? "Dia" : "Mês";

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-[28px] border border-[#dbeee1] bg-gradient-to-b from-white to-[#f8fff9] px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[28px] font-bold tracking-[-0.04em] text-slate-900">Agenda</h1>
              <p className="mt-1 text-[14px] text-slate-500">
                Navegue por dia ou semana, acompanhe ocupacao e crie novos horarios.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={goToday}
                className="h-11 rounded-2xl border border-[#d7ebdf] bg-white px-4 text-[14px] font-semibold text-[#159a4a] shadow-sm transition-colors hover:bg-[#f4fbf7]"
              >
                Hoje
              </button>

              <div className="flex items-center rounded-2xl border border-[#d7ebdf] bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => moveSelection(-1)}
                  className="flex h-11 w-11 items-center justify-center text-[#159a4a] transition-colors hover:bg-[#f4fbf7]"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveSelection(1)}
                  className="flex h-11 w-11 items-center justify-center text-[#159a4a] transition-colors hover:bg-[#f4fbf7]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex rounded-2xl border border-[#d7ebdf] bg-white p-1 shadow-sm">
                {[
                  ["week", "Semana"],
                  ["day", "Dia"],
                  ["month", "Mês"],
                ].map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode as CalendarMode)}
                    className={`h-10 rounded-xl px-4 text-[14px] font-semibold transition-colors ${
                      viewMode === mode
                        ? "bg-[#edf8f1] text-[#159a4a]"
                        : "text-[#2f6f4e] hover:bg-[#f4fbf7]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={toggleDensity}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-colors ${
                  density === "compact"
                    ? "border-[#d7ebdf] bg-[#edf8f1] text-[#159a4a]"
                    : "border-[#d7ebdf] bg-white text-slate-500 hover:bg-[#f4fbf7]"
                }`}
                title="Alternar densidade"
              >
                <Settings size={16} />
              </button>

              <button
                type="button"
                onClick={focusNextAppointment}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d7ebdf] bg-white text-slate-500 shadow-sm transition-colors hover:bg-[#f4fbf7]"
                title="Ir para o proximo atendimento"
              >
                <Bell size={16} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#edf8f1] px-3 py-1 text-[12px] font-semibold text-[#159a4a]">
              {rangeLabel}
            </span>
            <span className="rounded-full bg-[#f4fbf7] px-3 py-1 text-[12px] font-semibold text-[#159a4a]">
              {timelineHours[0]} - {timelineHours[timelineHours.length - 1]}
            </span>
            <span className="rounded-full bg-[#fff6eb] px-3 py-1 text-[12px] font-semibold text-[#f59e0b]">
              {isLoadingAppointments ? "Carregando dados..." : `${allAppointments.length} compromisso(s)`}
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-[24px] border border-[#dbeee1] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {viewMode === "month" ? (
              <div className="p-3">
                <div className="grid grid-cols-7 gap-2 rounded-[18px] border border-[#dbeee1] bg-[#f8fff9] px-3 py-3 text-center text-[11px] font-semibold tracking-[0.18em] text-slate-500">
                  {weekShort.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {monthGrid.flatMap((week) =>
                    week.map((day) => {
                      const dayKey = toDateKey(day);
                      const dayAppointments = monthAppointmentsByDate.get(dayKey) ?? [];
                      const active = sameDay(day, selectedDate);
                      const today = sameDay(day, new Date());
                      const muted = day.getMonth() !== selectedDate.getMonth();

                      return (
                        <button
                          key={dayKey}
                          type="button"
                          onClick={() => handleSelectCalendarDay(day)}
                          className={`flex min-h-[132px] flex-col rounded-[18px] border p-3 text-left transition-colors ${
                            active
                              ? "border-[#159a4a] bg-[#f0fbf2] shadow-[0_12px_24px_rgba(21,154,74,0.1)]"
                              : "border-[#e6edf2] bg-white hover:border-[#cde7d5] hover:bg-[#fafdfb]"
                          } ${muted ? "opacity-60" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-xl text-[14px] font-semibold ${
                                active
                                  ? "bg-[#159a4a] text-white"
                                  : today
                                    ? "border border-[#d7ebdf] bg-[#edf8f1] text-[#159a4a]"
                                    : "text-slate-700"
                              }`}
                            >
                              {day.getDate()}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {dayAppointments.length}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {dayAppointments.slice(0, 2).map((appointment) => (
                              <div
                                key={appointment.id}
                                className={`rounded-[14px] px-3 py-2 text-[12px] font-medium ${categoryToneMap[appointment.category] ?? categoryToneMap.Outros}`}
                              >
                                <p className="truncate text-[12px] font-semibold">{appointment.appointment_time}</p>
                                <p className="truncate text-[11px] opacity-90">{appointment.patient_name}</p>
                              </div>
                            ))}
                            {dayAppointments.length > 2 ? (
                              <div className="rounded-full border border-[#d7ebdf] bg-white px-3 py-1 text-center text-[11px] font-semibold text-[#159a4a]">
                                +{dayAppointments.length - 2} agendamento(s)
                              </div>
                            ) : null}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div
                className="relative"
                style={{
                  display: "grid",
                  gridTemplateColumns: timelineTemplateColumns,
                  gridTemplateRows: timelineTemplateRows,
                }}
              >
                <div className="flex items-center justify-start border-b border-r border-[#dbeee1] bg-[#f8fff9] px-4 text-[12px] font-medium text-slate-400">
                  GMT-3
                </div>

                {visibleDays.map((day, index) => (
                  <button
                    key={toDateKey(day.date)}
                    type="button"
                    onClick={() => handleSelectCalendarDay(day.date)}
                    className={`flex flex-col items-center justify-center border-b border-r border-[#dbeee1] bg-[#f8fff9] px-3 py-3 text-slate-700 transition-colors last:border-r-0 hover:bg-[#f4fbf7] ${
                      day.active ? "bg-[#edf8f1]" : ""
                    }`}
                    style={{ gridColumn: index + 2, gridRow: 1 }}
                  >
                    <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-500">
                      {day.short}
                    </span>
                    <span
                      className={`mt-2 flex h-9 w-9 items-center justify-center rounded-xl text-[18px] font-semibold ${
                        day.active
                          ? "bg-[#159a4a] text-white shadow-[0_8px_18px_rgba(21,154,74,0.22)]"
                          : day.today
                            ? "border border-[#d7ebdf] bg-[#edf8f1] text-[#159a4a]"
                            : "text-slate-700"
                      }`}
                    >
                      {day.day}
                    </span>
                  </button>
                ))}

                {timelineHours.map((hour, index) => (
                  <div
                    key={`${hour}-label`}
                    className="flex items-start justify-start border-r border-[#e4f1e8] bg-white px-4 py-2 text-[13px] text-slate-500"
                    style={{ gridColumn: 1, gridRow: index + 2 }}
                  >
                    {hour}
                  </div>
                ))}

                {timelineHours.map((hour, hourIndex) =>
                  visibleDays.map((day, dayIndex) => (
                    <div
                      key={`${toDateKey(day.date)}-${hour}`}
                      className="border-r border-t border-[#eaf3ec] bg-white last:border-r-0"
                      style={{ gridColumn: dayIndex + 2, gridRow: hourIndex + 2 }}
                    />
                  ))
                )}

                <div
                  className="pointer-events-none absolute inset-0 grid"
                  style={{
                    gridTemplateColumns: timelineTemplateColumns,
                    gridTemplateRows: timelineTemplateRows,
                  }}
                >
                  {visibleAppointments.map((appointment) => {
                    const dayIndex = visibleDays.findIndex(
                      (day) => toDateKey(day.date) === appointment.appointment_date
                    );

                    if (dayIndex < 0) {
                      return null;
                    }

                    const startMinutes = timeToMinutes(appointment.appointment_time);
                    const topOffsetMinutes = startMinutes - 7 * 60;
                    const rowStart = Math.max(2, 2 + Math.floor(topOffsetMinutes / 60));
                    const spanRows = Math.max(1, Math.ceil(appointment.duration_minutes / 60));
                    const tone = categoryToneMap[appointment.category] ?? categoryToneMap.Outros;

                    return (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() => handleSelectAppointment(appointment.id)}
                        className="pointer-events-auto text-left"
                        style={{
                          gridColumn: dayIndex + 2,
                          gridRow: `${rowStart} / span ${spanRows}`,
                          alignSelf: "start",
                          margin: "6px 8px",
                        }}
                      >
                        <article className="rounded-2xl border border-[#dbeee1] bg-gradient-to-br from-white to-[#f8fff9] p-3 shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition-colors hover:border-[#ccead7] hover:bg-[#f7fff8]">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-semibold text-slate-900">
                                {appointment.patient_name}
                              </p>
                              <p className="mt-1 truncate text-[12px] text-slate-500">
                                {appointment.doctor_name || "Doutor nao informado"}
                              </p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>
                              {appointment.duration_minutes}min
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-500">
                            <Clock3 size={14} className="text-[#159a4a]" />
                            <span>{appointment.appointment_time}</span>
                          </div>
                        </article>
                      </button>
                    );
                  })}
                </div>

                <div
                  className="pointer-events-none absolute left-[84px] right-0 top-[72px] z-20 border-t border-dashed border-[#d7ebdf]"
                  style={{ transform: "translateY(50%)" }}
                />
              </div>
            )}
          </div>

          <div className="mt-4 rounded-[20px] border border-[#dbeee1] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-[13px] text-slate-600">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#159a4a]" />
                Linha de tempo em verde
                <span className="text-slate-300">|</span>
                {dayColumnCount} coluna(s) visivel(is)
              </div>
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className="rounded-full border border-[#d7ebdf] px-3 py-1 text-[12px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f4fbf7]"
              >
                Ver semana
              </button>
            </div>
          </div>

        </div>

        {sidebarOpen ? (
          <aside className="rounded-[28px] border border-[#dbeee1] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-slate-800">
                  {selectedTitle}
                </h2>
                <p className="mt-1 text-[13px] text-slate-500">
                  Controle rapido da data selecionada.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 transition-colors hover:text-slate-600"
                aria-label="Fechar painel lateral"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between text-slate-500">
              <button
                type="button"
                onClick={() => setSelectedDate((current) => addMonths(current, -1))}
                className="rounded-full border border-[#d7ebdf] p-1.5 transition-colors hover:bg-[#f4fbf7]"
              >
                <ChevronLeft size={14} />
              </button>
              <p className="text-[14px] font-semibold text-slate-700">{monthTitle}</p>
              <button
                type="button"
                onClick={() => setSelectedDate((current) => addMonths(current, 1))}
                className="rounded-full border border-[#d7ebdf] p-1.5 transition-colors hover:bg-[#f4fbf7]"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="mt-4 rounded-[20px] border border-[#dbeee1] bg-[#f8fff9] p-4">
              <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold tracking-[0.22em] text-[#84a98c]">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-y-3 text-center text-[13px] text-slate-600">
                {monthGrid.flatMap((week) =>
                  week.map((day) => {
                    const dayKey = toDateKey(day);
                    const active = sameDay(day, selectedDate);
                    const muted = day.getMonth() !== selectedDate.getMonth();
                    const today = sameDay(day, new Date());

                    return (
                    <button
                      key={dayKey}
                      type="button"
                      onClick={() => handleSelectCalendarDay(day)}
                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        active
                          ? "bg-[#159a4a] text-white shadow-[0_8px_18px_rgba(21,154,74,0.22)]"
                            : today
                              ? "border border-[#d7ebdf] bg-[#edf8f1] text-[#159a4a]"
                              : "hover:bg-[#f4fbf7]"
                      } ${muted ? "text-slate-300" : ""}`}
                    >
                        {day.getDate()}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-4 rounded-[18px] border border-dashed border-[#d7ebdf] bg-[#f8fff9] px-4 py-4 text-center">
              <CalendarDays className="mx-auto text-[#159a4a]" size={18} />
              <p className="mt-3 text-[14px] font-semibold text-slate-800">
                {isLoadingAppointments
                  ? "Carregando agendamentos..."
                  : selectedDayAppointments.length === 0
                    ? "Sem agendamentos para este dia"
                    : `${selectedDayAppointments.length} agendamento(s) neste dia`}
              </p>
              <p className="mt-1 text-[13px] leading-6 text-slate-500">
                Use o calendario para alternar a data em segundos.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {selectedDayAppointments.slice(0, 5).map((appointment) => (
                <button
                  key={appointment.id}
                  type="button"
                  onClick={() => handleSelectAppointment(appointment.id)}
                  className="w-full rounded-[16px] border border-[#e9edf3] bg-white px-4 py-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-[#ccead7] hover:bg-[#f8fff9]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-slate-800">
                        {appointment.patient_name}
                      </p>
                      <p className="mt-1 truncate text-[12px] text-slate-500">
                        {appointment.doctor_name || "Doutor nao informado"}
                      </p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                      {appointment.duration_minutes}min
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-500">
                    <Clock3 size={14} className="text-[#159a4a]" />
                    <span>
                      {appointment.appointment_date} as {appointment.appointment_time}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[20px] border border-[#dbeee1] bg-[#f8fff9] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#159a4a]">
                    Detalhes do agendamento
                  </p>
                  <h3 className="mt-2 text-[18px] font-bold tracking-[-0.02em] text-slate-900">
                    {selectedAppointment ? selectedAppointment.patient_name : "Selecione um compromisso"}
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-500">
                    Clique em um cartão do calendario para ver paciente, doutor e horario.
                  </p>
                </div>
                {selectedAppointment ? (
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      categoryToneMap[selectedAppointment.category] ?? categoryToneMap.Outros
                    }`}
                  >
                    {selectedAppointment.category}
                  </span>
                ) : null}
              </div>

              {selectedAppointment ? (
                <div className="mt-4 grid gap-3 text-[13px] text-slate-600">
                  <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Paciente
                    </span>
                    <p className="mt-1 font-semibold text-slate-800">{selectedAppointment.patient_name}</p>
                  </div>

                  <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Doutor
                    </span>
                    <p className="mt-1 font-semibold text-slate-800">
                      {selectedAppointment.doctor_name || "Nao informado"}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Procedimento
                      </span>
                      <p className="mt-1 font-semibold text-slate-800">{selectedAppointment.procedure_name}</p>
                    </div>

                    <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Duracao
                      </span>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedAppointment.duration_minutes} minutos
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Data
                      </span>
                      <p className="mt-1 font-semibold text-slate-800">{selectedAppointment.appointment_date}</p>
                    </div>

                    <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Horario
                      </span>
                      <p className="mt-1 font-semibold text-slate-800">{selectedAppointment.appointment_time}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Observacoes
                    </span>
                    <p className="mt-1 leading-6 text-slate-600">
                      {selectedAppointment.notes || "Sem observacoes registradas."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-[#ccead7] bg-white px-4 py-6 text-center text-[13px] leading-6 text-slate-500">
                  Nenhum agendamento selecionado.
                  <br />
                  Escolha um compromisso na grade ou na lista acima.
                </div>
              )}
            </div>
          </aside>
        ) : (
          <aside className="rounded-[28px] border border-dashed border-[#d7ebdf] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-full w-full items-center justify-center rounded-[20px] border border-[#d7ebdf] bg-[#f8fff9] px-4 py-8 text-[14px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f4fbf7]"
            >
              Abrir painel lateral
            </button>
          </aside>
        )}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-[1120px] rounded-[30px] border border-white/70 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-[34px] font-bold tracking-[-0.04em] text-slate-900">
                  {formMode === "edit" ? "Editar agendamento" : "Novo agendamento"}
                </h3>
                <p className="mt-3 text-[18px] leading-7 text-slate-500">
                  {formMode === "edit"
                    ? "Atualize os dados do atendimento e salve as alteracoes."
                    : "Preencha os dados para salvar o horario no sistema."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-[#dce5ee] p-3 text-[#159a4a] transition-colors hover:bg-[#f4fbf6]"
                aria-label="Fechar modal"
              >
                <X size={22} />
              </button>
            </div>

            <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Nome do paciente</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <UserRound size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.patientName}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, patientName: event.target.value }))
                      }
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder="Ex: Juliana Silva"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Doutor(a)</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Stethoscope size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.doctorName}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, doctorName: event.target.value }))
                      }
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder="Ex: Dra. Marina Costa"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Procedimento</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <FileText size={18} />
                    </span>
                    <input
                      type="text"
                      value={form.procedureName}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, procedureName: event.target.value }))
                      }
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder="Ex: Botox"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Data</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <CalendarDays size={18} />
                    </span>
                    <input
                      type="date"
                      value={form.appointmentDate}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, appointmentDate: event.target.value }))
                      }
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Horário</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Clock3 size={18} />
                    </span>
                    <input
                      type="time"
                      value={form.appointmentTime}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, appointmentTime: event.target.value }))
                      }
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Duração em minutos</span>
                  <div className="flex h-[76px] items-center gap-3 rounded-[20px] border border-[#dce5ee] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7f1] text-[#159a4a]">
                      <Clock3 size={18} />
                    </span>
                    <input
                      type="number"
                      min={15}
                      step={15}
                      value={form.durationMinutes}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, durationMinutes: event.target.value }))
                      }
                      className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder="60"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-3 block text-[18px] font-semibold text-slate-900">Categoria</span>
                  <FancySelect
                    label="Categoria"
                    value={form.category}
                    options={categoryOptions}
                    onSelect={(value) => setForm((current) => ({ ...current, category: value }))}
                    icon={Tag}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-3 block text-[18px] font-semibold text-slate-900">Observações</span>
                <div className="rounded-[20px] border border-[#dce5ee] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus-within:border-[#19a14f] focus-within:ring-4 focus-within:ring-[#19a14f]/8">
                  <textarea
                    value={form.notes}
                    onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                    rows={4}
                    className="w-full bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                    placeholder="Ex.: primeira consulta, trazer exames, etc."
                  />
                </div>
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
                  className="h-14 rounded-[18px] border border-[#bfe2c7] px-6 text-[16px] font-semibold text-[#159a4a] transition-colors hover:bg-[#f4fbf6]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex h-14 items-center justify-center rounded-[18px] bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-6 text-[16px] font-semibold text-white shadow-[0_16px_30px_rgba(34,197,94,0.22)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Salvando..." : formMode === "edit" ? "Salvar alteracoes" : "Salvar agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
