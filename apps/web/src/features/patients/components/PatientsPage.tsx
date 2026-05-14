"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  Filter,
  Grid2x2,
  Image as ImageIcon,
  MoreVertical,
  Paperclip,
  Plus,
  Search,
  Table2,
  UserPlus,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type PatientAsset = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  kind: "file" | "photo";
  createdAt: string;
};

type Patient = {
  id: string;
  owner_id: string;
  full_name: string;
  email: string;
  phone: string;
  status: "ativo" | "inativo";
  type: string;
  last_visit: string | null;
  appointments_count: number;
  total_spent: string;
  source: string;
  avatar_url: string | null;
  notes: string | null;
  attachments: unknown;
  procedure_photos: unknown;
  created_at: string;
  updated_at: string;
};

type PatientFormState = {
  fullName: string;
  email: string;
  phone: string;
  status: "ativo" | "inativo";
  type: string;
  lastVisit: string;
  appointmentsCount: string;
  totalSpent: string;
  source: string;
  avatarUrl: string;
  notes: string;
  attachments: PatientAsset[];
  procedurePhotos: PatientAsset[];
};

type PatientApiPayload = {
  id?: string;
  patient?: Patient;
  patients?: Patient[];
  message?: string;
};

type DropdownKey = "status" | "type" | "source" | "sort" | "page";

const initialForm: PatientFormState = {
  fullName: "",
  email: "",
  phone: "",
  status: "ativo",
  type: "Particular",
  lastVisit: "",
  appointmentsCount: "0",
  totalSpent: "0",
  source: "Instagram",
  avatarUrl: "",
  notes: "",
  attachments: [],
  procedurePhotos: [],
};

const filterOptions = {
  status: ["Todos", "Ativo", "Inativo"],
  type: ["Todos", "Particular", "Conveniado"],
  source: ["Todas", "Instagram", "Indicação", "Google", "Site"],
  sort: ["Nome A-Z", "Nome Z-A"],
  page: ["12 por página", "24 por página", "36 por página"],
};

function formatCurrency(value: string) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatFileSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) {
    return "0 KB";
  }

  const mb = size / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }

  const kb = size / 1024;
  return `${Math.max(1, Math.round(kb))} KB`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function normalizeAssets(value: unknown): PatientAsset[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const data = item as Record<string, unknown>;
      const id = String(data.id ?? crypto.randomUUID());
      const name = String(data.name ?? "arquivo");
      const url = String(data.url ?? "");
      const type = String(data.type ?? "application/octet-stream");
      const size = Number(data.size ?? 0);
      const kind = data.kind === "photo" ? "photo" : "file";
      const createdAt = String(data.createdAt ?? new Date().toISOString());

      if (!url) {
        return null;
      }

      return { id, name, url, type, size, kind, createdAt } satisfies PatientAsset;
    })
    .filter((item): item is PatientAsset => Boolean(item));
}

type DropdownSelectProps = {
  label: string;
  value: string;
  options: string[];
  open: boolean;
  align?: "left" | "right";
  compact?: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

function DropdownSelect({
  label,
  value,
  options,
  open,
  align = "left",
  compact = false,
  onToggle,
  onSelect,
}: DropdownSelectProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`group w-full rounded-[22px] border border-[#dce5ee] bg-gradient-to-b from-white to-[#fbfdff] text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-[#cbd8e5] focus:outline-none focus:ring-4 focus:ring-[#19a14f]/8 ${
          compact ? "min-h-[74px] px-4 py-3" : "px-4 py-3"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {label}
            </span>
            <span className="block truncate text-[14px] font-semibold text-slate-800">{value}</span>
          </div>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#f6f9fc] text-slate-400 transition-colors group-hover:bg-[#effaf3] group-hover:text-[#0f9c68]">
            <ChevronDown size={16} />
          </span>
        </div>
      </button>

      {open ? (
        <div
          className={`absolute top-full z-30 mt-2 min-w-[190px] rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.15)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="max-h-60 overflow-auto">
            {options.map((option) => {
              const active = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelect(option)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[14px] font-medium transition-colors ${
                    active
                      ? "bg-[#f0fbf2] text-[#0f9c68]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{option}</span>
                  {active ? <span className="h-2 w-2 rounded-full bg-[#0f9c68]" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function buildForm(patient?: Patient): PatientFormState {
  if (!patient) {
    return { ...initialForm };
  }

  return {
    fullName: patient.full_name,
    email: patient.email,
    phone: patient.phone,
    status: patient.status,
    type: patient.type || "Particular",
    lastVisit: patient.last_visit ?? "",
    appointmentsCount: String(patient.appointments_count ?? 0),
    totalSpent: String(patient.total_spent ?? "0"),
    source: patient.source || "Site",
    avatarUrl: patient.avatar_url ?? "",
    notes: patient.notes ?? "",
    attachments: normalizeAssets(patient.attachments),
    procedurePhotos: normalizeAssets(patient.procedure_photos),
  };
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Nao foi possivel ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

async function fileToAsset(file: File, kind: "file" | "photo") {
  const url = await readFileAsDataUrl(file);

  return {
    id: crypto.randomUUID(),
    name: file.name,
    url,
    type: file.type || "application/octet-stream",
    size: file.size,
    kind,
    createdAt: new Date().toISOString(),
  } satisfies PatientAsset;
}

export function PatientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtersRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [sourceFilter, setSourceFilter] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("Nome A-Z");
  const [pageSize, setPageSize] = useState("12 por página");
  const [openMenu, setOpenMenu] = useState<DropdownKey | null>(null);
  const [form, setForm] = useState<PatientFormState>(initialForm);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setError("");
      setActivePatient(null);
      setForm(initialForm);
      setModalMode("create");
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);
        const response = await fetch("/api/patients", { cache: "no-store" });
        const payload = (await response.json()) as PatientApiPayload;

        if (!response.ok) {
          throw new Error(payload.message ?? "Nao foi possivel carregar os pacientes.");
        }

        setPatients(payload.patients ?? []);
      } catch (loadError) {
        console.error(loadError);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }

    void loadPatients();
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (filtersRef.current && !filtersRef.current.contains(target)) {
        setOpenMenu(null);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let current = patients.filter((patient) => {
      const matchesSearch =
        !normalizedSearch ||
        patient.full_name.toLowerCase().includes(normalizedSearch) ||
        patient.email.toLowerCase().includes(normalizedSearch) ||
        patient.phone.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" || patient.status === statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "Todos" || patient.type.toLowerCase() === typeFilter.toLowerCase();

      const matchesSource =
        sourceFilter === "Todas" || patient.source.toLowerCase() === sourceFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType && matchesSource;
    });

    if (sortOrder === "Nome Z-A") {
      current = [...current].sort((a, b) => b.full_name.localeCompare(a.full_name));
    } else {
      current = [...current].sort((a, b) => a.full_name.localeCompare(b.full_name));
    }

    return current;
  }, [patients, search, statusFilter, typeFilter, sourceFilter, sortOrder]);

  function openCreateModal() {
    setError("");
    setActivePatient(null);
    setForm(initialForm);
    setModalMode("create");
    router.push("/pacientes?new=1");
  }

  function openEditModal(patient: Patient) {
    setError("");
    setActivePatient(patient);
    setForm(buildForm(patient));
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setActivePatient(null);
    setError("");
    setForm(initialForm);
    router.replace("/pacientes");
  }

  function updateForm<K extends keyof PatientFormState>(key: K, value: PatientFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function appendAssets(
    event: ChangeEvent<HTMLInputElement>,
    target: "attachments" | "procedurePhotos",
    kind: "file" | "photo"
  ) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    const assets = await Promise.all(files.map((file) => fileToAsset(file, kind)));

    setForm((current) => ({
      ...current,
      [target]: [...current[target], ...assets],
    }));

    event.target.value = "";
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const url = await readFileAsDataUrl(file);
    updateForm("avatarUrl", url);
    event.target.value = "";
  }

  function removeAsset(target: "attachments" | "procedurePhotos", id: string) {
    setForm((current) => ({
      ...current,
      [target]: current[target].filter((asset) => asset.id !== id),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...(modalMode === "edit" && activePatient ? { id: activePatient.id } : {}),
        ...form,
      };

      const response = await fetch("/api/patients", {
        method: modalMode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as PatientApiPayload;

      if (!response.ok) {
        throw new Error(data.message ?? "Nao foi possivel salvar o paciente.");
      }

      if (data.patient) {
        setPatients((current) => {
          if (modalMode === "edit") {
            return current.map((patient) => (patient.id === data.patient?.id ? data.patient! : patient));
          }

          return [data.patient!, ...current];
        });
      }

      closeModal();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>, patient: Patient) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEditModal(patient);
    }
  }

  const modalTitle = modalMode === "edit" ? "Editar paciente" : "Adicionar cliente";
  const modalSubtitle =
    modalMode === "edit"
      ? "Atualize dados, anexos, fotos e observacoes do paciente."
      : "Cadastre um cliente com foto, arquivos e informacoes clinicas.";

  function toggleMenu(menu: DropdownKey) {
    setOpenMenu((current) => (current === menu ? null : menu));
  }

  function closeMenu() {
    setOpenMenu(null);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[24px] border border-[#e5e9ef] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-2xl border border-[#dfe6f0] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setView("cards")}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                view === "cards" ? "bg-[#f0fbf2] text-[#0f9c68]" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Grid2x2 size={18} />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                view === "table" ? "bg-[#f0fbf2] text-[#0f9c68]" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Table2 size={18} />
              Planilha
            </button>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex h-14 items-center gap-3 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#0f9c68] px-5 text-[15px] font-semibold text-white shadow-[0_18px_34px_rgba(16,185,129,0.2)] transition-opacity hover:opacity-95 lg:px-7"
          >
            <UserPlus size={18} />
            Adicionar cliente
            <span className="ml-2 border-l border-white/15 pl-3">
              <ChevronDown size={16} />
            </span>
          </button>
        </div>
      </section>

      <div ref={filtersRef} className="space-y-5">
      <section className="rounded-[24px] border border-[#e5e9ef] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,190px))_auto]">
          <label className="group rounded-[22px] border border-[#dce5ee] bg-gradient-to-b from-white to-[#fbfdff] px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all focus-within:border-[#19a14f]/40 focus-within:ring-4 focus-within:ring-[#19a14f]/8 hover:border-[#cbd8e5]">
            <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              <Search size={14} className="text-[#19a14f]" />
              Buscar paciente
            </span>
            <div className="flex items-center gap-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Nome, e-mail ou telefone"
                className="w-full bg-transparent text-[14px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </label>

          <DropdownSelect
            label="Status"
            value={statusFilter}
            options={filterOptions.status}
            open={openMenu === "status"}
            onToggle={() => toggleMenu("status")}
            onSelect={(value) => {
              setStatusFilter(value);
              closeMenu();
            }}
          />

          <DropdownSelect
            label="Tipo"
            value={typeFilter}
            options={filterOptions.type}
            open={openMenu === "type"}
            onToggle={() => toggleMenu("type")}
            onSelect={(value) => {
              setTypeFilter(value);
              closeMenu();
            }}
          />

          <DropdownSelect
            label="Fonte"
            value={sourceFilter}
            options={filterOptions.source}
            open={openMenu === "source"}
            onToggle={() => toggleMenu("source")}
            onSelect={(value) => {
              setSourceFilter(value);
              closeMenu();
            }}
          />

          <button
            type="button"
            onClick={closeMenu}
            className="inline-flex h-full min-h-[74px] items-center justify-center gap-3 rounded-[22px] border border-[#dce5ee] bg-white px-5 text-[14px] font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#19a14f]/30 hover:bg-[#f8fffb] hover:text-[#0f9c68]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0fbf2] text-[#0f9c68]">
              <Filter size={18} />
            </span>
            Mais filtros
          </button>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e5e9ef] bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[18px] font-semibold text-[#0f9c68]">
            {filteredPatients.length}
            <span className="font-normal text-slate-600"> clientes encontrados</span>
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="rounded-full border border-[#dce5ee] bg-white px-4 py-2 text-[14px] font-semibold text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-[#19a14f]/25 hover:text-[#0f9c68]"
            >
              Exportar
            </button>
            <DropdownSelect
              label="Ordenar por"
              value={sortOrder}
              options={filterOptions.sort}
              open={openMenu === "sort"}
              align="right"
              onToggle={() => toggleMenu("sort")}
              onSelect={(value) => {
                setSortOrder(value);
                closeMenu();
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-[22px] border border-dashed border-slate-200 px-6 py-14 text-center text-slate-500">
            Carregando pacientes...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-slate-200 px-6 py-14 text-center text-slate-500">
            Nenhum cliente cadastrado ainda.
          </div>
        ) : view === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredPatients.map((patient) => {
              const attachmentsCount = normalizeAssets(patient.attachments).length;
              const photosCount = normalizeAssets(patient.procedure_photos).length;

              return (
                <article
                  key={patient.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEditModal(patient)}
                  onKeyDown={(event) => handleCardKeyDown(event, patient)}
                  className="cursor-pointer rounded-[22px] border border-[#e5e9ef] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#16a34a] to-[#0f9c68] text-[18px] font-bold text-white">
                        {patient.avatar_url ? (
                          <img
                            src={patient.avatar_url}
                            alt={patient.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{getInitials(patient.full_name)}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-[18px] font-semibold text-slate-900">
                          {patient.full_name}
                        </h3>
                        <p className="mt-1 truncate text-[13px] text-slate-500">{patient.phone}</p>
                        <p className="mt-1 truncate text-[13px] text-slate-500">{patient.email}</p>
                        <span
                          className={`mt-3 inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
                            patient.status === "ativo"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {patient.status === "ativo" ? "● Ativo" : "● Inativo"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openEditModal(patient);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                      aria-label={`Editar ${patient.full_name}`}
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#eef2f7] pt-5 text-center">
                    <div>
                      <p className="text-[12px] text-slate-500">Agendamentos</p>
                      <p className="mt-2 text-[15px] font-semibold text-slate-900">
                        {patient.appointments_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] text-slate-500">Ultima visita</p>
                      <p className="mt-2 text-[15px] font-semibold text-slate-900">
                        {formatDate(patient.last_visit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] text-slate-500">Gasto total</p>
                      <p className="mt-2 text-[15px] font-semibold text-slate-900">
                        {formatCurrency(patient.total_spent)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-600">
                      <Paperclip size={13} />
                      {attachmentsCount} arquivos
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-600">
                      <ImageIcon size={13} />
                      {photosCount} fotos
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[18px] border border-[#e5e9ef]">
            <table className="min-w-full divide-y divide-[#eef2f7]">
              <thead className="bg-slate-50">
                <tr className="text-left text-[13px] font-semibold text-slate-500">
                  <th className="px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                  </th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Ultima visita</th>
                  <th className="px-4 py-3">Agendamentos</th>
                  <th className="px-4 py-3">Gasto total</th>
                  <th className="px-4 py-3">Fonte</th>
                  <th className="px-4 py-3">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f7] bg-white">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEditModal(patient)}
                    onKeyDown={(event) => handleCardKeyDown(event, patient)}
                    className="cursor-pointer text-[14px] text-slate-700 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#16a34a] to-[#0f9c68] text-[12px] font-bold text-white">
                          {patient.avatar_url ? (
                            <img
                              src={patient.avatar_url}
                              alt={patient.full_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>{getInitials(patient.full_name)}</span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-900">{patient.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">{patient.phone}</td>
                    <td className="px-4 py-4">{patient.email}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
                          patient.status === "ativo"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {patient.status === "ativo" ? "● Ativo" : "● Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-4">{patient.type}</td>
                    <td className="px-4 py-4">{formatDate(patient.last_visit)}</td>
                    <td className="px-4 py-4">{patient.appointments_count}</td>
                    <td className="px-4 py-4">{formatCurrency(patient.total_spent)}</td>
                    <td className="px-4 py-4">{patient.source}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditModal(patient);
                        }}
                        aria-label={`Editar ${patient.full_name}`}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-slate-600">
            {filteredPatients.length === 0
              ? "Mostrando 0 de 0 clientes"
              : `Mostrando 1 a ${filteredPatients.length} de ${filteredPatients.length} clientes`}
          </p>

          <div className="flex items-center gap-2 text-slate-500">
            <button type="button" className="rounded-full p-2 hover:bg-slate-50">
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="h-10 w-10 rounded-full bg-[#19a14f] text-[14px] font-semibold text-white">
              1
            </button>
            <button type="button" className="h-10 w-10 rounded-full text-[14px] font-semibold hover:bg-slate-50">
              2
            </button>
            <button type="button" className="h-10 w-10 rounded-full text-[14px] font-semibold hover:bg-slate-50">
              3
            </button>
            <span className="px-2">...</span>
            <button type="button" className="h-10 w-10 rounded-full text-[14px] font-semibold hover:bg-slate-50">
              16
            </button>
            <button type="button" className="rounded-full p-2 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>

          <DropdownSelect
            label="Exibir"
            value={pageSize}
            options={filterOptions.page}
            open={openMenu === "page"}
            align="right"
            compact
            onToggle={() => toggleMenu("page")}
            onSelect={(value) => {
              setPageSize(value);
              closeMenu();
            }}
          />
        </div>
      </section>
      </div>

      {modalMode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[26px] font-bold tracking-[-0.03em] text-slate-900">{modalTitle}</h3>
                <p className="mt-2 text-[14px] leading-6 text-slate-500">{modalSubtitle}</p>
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

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="space-y-4 rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#16a34a] to-[#0f9c68] text-[22px] font-bold text-white">
                      {form.avatarUrl ? (
                        <img src={form.avatarUrl} alt={form.fullName || "Paciente"} className="h-full w-full object-cover" />
                      ) : (
                        <span>{getInitials(form.fullName || "Paciente")}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-500">Foto do paciente</p>
                      <p className="mt-1 text-[14px] text-slate-600">
                        Selecione uma imagem para reconhecer o paciente mais rapidamente.
                      </p>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-[14px] font-semibold text-slate-700 transition-colors hover:border-[#19a14f] hover:text-[#0f9c68]">
                    <ImageIcon size={18} />
                    <span>Escolher imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => updateForm("avatarUrl", "")}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    <X size={16} />
                    Remover foto
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-[12px] text-slate-500">Arquivos</p>
                      <p className="mt-2 text-[20px] font-bold text-slate-900">{form.attachments.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-[12px] text-slate-500">Fotos</p>
                      <p className="mt-2 text-[20px] font-bold text-slate-900">{form.procedurePhotos.length}</p>
                    </div>
                  </div>

                  {activePatient ? (
                    <div className="rounded-2xl bg-white p-4 text-[13px] text-slate-600 shadow-sm">
                      <p className="font-semibold text-slate-900">Criado em</p>
                      <p className="mt-1">{formatDate(activePatient.created_at)}</p>
                    </div>
                  ) : null}
                </aside>

                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">Nome completo</span>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(event) => updateForm("fullName", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                        placeholder="Amanda Rocha"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">E-mail</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => updateForm("email", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                        placeholder="cliente@email.com"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">Telefone</span>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(event) => updateForm("phone", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                        placeholder="(11) 98765-4321"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">Ultima visita</span>
                      <input
                        type="date"
                        value={form.lastVisit}
                        onChange={(event) => updateForm("lastVisit", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">Status</span>
                      <select
                        value={form.status}
                        onChange={(event) =>
                          updateForm("status", event.target.value === "inativo" ? "inativo" : "ativo")
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">Tipo</span>
                      <select
                        value={form.type}
                        onChange={(event) => updateForm("type", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                      >
                        <option>Particular</option>
                        <option>Conveniado</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">Fonte</span>
                      <select
                        value={form.source}
                        onChange={(event) => updateForm("source", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                      >
                        <option>Instagram</option>
                        <option>Indicação</option>
                        <option>Google</option>
                        <option>Site</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                        Agendamentos
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={form.appointmentsCount}
                        onChange={(event) => updateForm("appointmentsCount", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                        placeholder="12"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">Gasto total</span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={form.totalSpent}
                        onChange={(event) => updateForm("totalSpent", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                        placeholder="2450"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold text-slate-700">Observacoes</span>
                    <textarea
                      value={form.notes}
                      onChange={(event) => updateForm("notes", event.target.value)}
                      rows={5}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                      placeholder="Informacoes clinicas, preferencias, alergias, observacoes de retorno..."
                    />
                  </label>

                  <div className="grid gap-5 xl:grid-cols-2">
                    <section className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[16px] font-semibold text-slate-900">Arquivos do paciente</p>
                          <p className="mt-1 text-[13px] text-slate-500">
                            Anexe documentos, exames e termos assinados.
                          </p>
                        </div>

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-3 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:text-[#0f9c68]">
                          <Plus size={16} />
                          Adicionar
                          <input
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={(event) => appendAssets(event, "attachments", "file")}
                          />
                        </label>
                      </div>

                      <div className="mt-4 space-y-3">
                        {form.attachments.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-[14px] text-slate-500">
                            Nenhum arquivo anexado ainda.
                          </div>
                        ) : (
                          form.attachments.map((asset) => (
                            <div
                              key={asset.id}
                              className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
                            >
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <FileText size={18} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[14px] font-semibold text-slate-900">{asset.name}</p>
                                <p className="text-[12px] text-slate-500">
                                  {formatFileSize(asset.size)} · {asset.type || "arquivo"}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeAsset("attachments", asset.id)}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                aria-label={`Remover ${asset.name}`}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </section>

                    <section className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[16px] font-semibold text-slate-900">Fotos dos procedimentos</p>
                          <p className="mt-1 text-[13px] text-slate-500">
                            Guarde antes e depois, evolucao e registros do atendimento.
                          </p>
                        </div>

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-3 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:text-[#0f9c68]">
                          <ImageIcon size={16} />
                          Adicionar
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) => appendAssets(event, "procedurePhotos", "photo")}
                          />
                        </label>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {form.procedurePhotos.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-[14px] text-slate-500 sm:col-span-2">
                            Nenhuma foto adicionada ainda.
                          </div>
                        ) : (
                          form.procedurePhotos.map((asset) => (
                            <div key={asset.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                              <div className="aspect-[4/3] bg-slate-100">
                                <img
                                  src={asset.url}
                                  alt={asset.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="flex items-start gap-3 px-4 py-3">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[14px] font-semibold text-slate-900">
                                    {asset.name}
                                  </p>
                                  <p className="text-[12px] text-slate-500">{formatFileSize(asset.size)}</p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeAsset("procedurePhotos", asset.id)}
                                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                  aria-label={`Remover ${asset.name}`}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                  </div>
                </div>
              </div>

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
                  disabled={saving}
                  className="flex h-12 items-center justify-center rounded-2xl bg-[#22c55e] px-6 text-[14px] font-semibold text-white shadow-[0_16px_30px_rgba(34,197,94,0.22)] transition-colors hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Salvando..." : modalMode === "edit" ? "Salvar alteracoes" : "Salvar cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
