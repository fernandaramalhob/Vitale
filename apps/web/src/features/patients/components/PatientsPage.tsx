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
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Globe2,
  Mail,
  FileText,
  Filter,
  Grid2x2,
  Image as ImageIcon,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Search,
  Table2,
  Tag,
  UserPlus,
  UserRound,
  CircleDollarSign,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
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
  doctor_name: string | null;
  convenio_name: string | null;
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
  doctorName: string;
  convenioName: string;
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

type DropdownKey = "status" | "type" | "source" | "doctor" | "sort" | "page";

const initialForm: PatientFormState = {
  fullName: "",
  email: "",
  phone: "",
  doctorName: "",
  convenioName: "",
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
  doctor: ["Todos", "Dra. Marina Costa", "Dr. Ricardo Alves", "Dra. Beatriz Lima", "Dr. Felipe Nunes"],
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

function createDemoAvatar(
  name: string,
  accentA: string,
  accentB: string,
  skin: string,
  hair: string
) {
  const initials = getInitials(name);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="${name}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentA}" />
          <stop offset="100%" stop-color="${accentB}" />
        </linearGradient>
        <linearGradient id="shirt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#dbeafe" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="120" fill="url(#bg)" />
      <circle cx="120" cy="120" r="96" fill="rgba(255,255,255,0.14)" />
      <path d="M60 190c8-33 33-56 60-56s52 23 60 56" fill="url(#shirt)" opacity="0.95" />
      <circle cx="120" cy="98" r="34" fill="${skin}" />
      <path d="M84 96c4-24 18-42 36-48 17 6 29 19 39 39-5 3-9 7-13 12-10-6-20-9-29-9-10 0-21 3-33 6Z" fill="${hair}" />
      <path d="M95 113c6 9 15 14 25 14s19-5 25-14c-3 18-13 31-25 31s-22-13-25-31Z" fill="rgba(255,255,255,0.18)" />
      <circle cx="108" cy="96" r="3.2" fill="#0f172a" />
      <circle cx="132" cy="96" r="3.2" fill="#0f172a" />
      <path d="M108 112c8 6 16 6 24 0" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" fill="none" />
      <text x="120" y="214" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="rgba(15,23,42,0.18)">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const demoPatients: Patient[] = [
  {
    id: "demo-ana-morais",
    owner_id: "demo-owner",
    full_name: "Ana Morais",
    email: "ana.morais@cliente.demo",
    phone: "(85) 99812-3341",
    doctor_name: "Dra. Marina Costa",
    convenio_name: "SaudeMais",
    status: "ativo",
    type: "Particular",
    last_visit: "2026-05-10",
    appointments_count: 4,
    total_spent: "1240.9",
    source: "Instagram",
    avatar_url: createDemoAvatar("Ana Morais", "#c9f6d8", "#f5fff8", "#f2c7a5", "#2f1f1b"),
    notes: null,
    attachments: [],
    procedure_photos: [],
    created_at: "2026-05-10T10:00:00.000Z",
    updated_at: "2026-05-10T10:00:00.000Z",
  },
  {
    id: "demo-bruno-lima",
    owner_id: "demo-owner",
    full_name: "Bruno Lima",
    email: "bruno.lima@cliente.demo",
    phone: "(85) 99644-2088",
    doctor_name: "Dr. Ricardo Alves",
    convenio_name: "VidaCare",
    status: "ativo",
    type: "Conveniado",
    last_visit: "2026-05-08",
    appointments_count: 2,
    total_spent: "860",
    source: "Indicação",
    avatar_url: createDemoAvatar("Bruno Lima", "#d7e7ff", "#f8fbff", "#d9a47b", "#43302b"),
    notes: null,
    attachments: [],
    procedure_photos: [],
    created_at: "2026-05-08T10:00:00.000Z",
    updated_at: "2026-05-08T10:00:00.000Z",
  },
  {
    id: "demo-carla-souza",
    owner_id: "demo-owner",
    full_name: "Carla Souza",
    email: "carla.souza@cliente.demo",
    phone: "(85) 99120-7754",
    doctor_name: "Dra. Beatriz Lima",
    convenio_name: null,
    status: "ativo",
    type: "Particular",
    last_visit: "2026-05-12",
    appointments_count: 7,
    total_spent: "2890.5",
    source: "Google",
    avatar_url: createDemoAvatar("Carla Souza", "#efe2ff", "#fbf8ff", "#e7b68d", "#1f2937"),
    notes: null,
    attachments: [],
    procedure_photos: [],
    created_at: "2026-05-12T10:00:00.000Z",
    updated_at: "2026-05-12T10:00:00.000Z",
  },
  {
    id: "demo-daniel-paes",
    owner_id: "demo-owner",
    full_name: "Daniel Paes",
    email: "daniel.paes@cliente.demo",
    phone: "(85) 99731-6042",
    doctor_name: "Dr. Felipe Nunes",
    convenio_name: "CarePlus",
    status: "inativo",
    type: "Conveniado",
    last_visit: "2026-04-30",
    appointments_count: 1,
    total_spent: "430",
    source: "Site",
    avatar_url: createDemoAvatar("Daniel Paes", "#ffe9d3", "#fffaf3", "#c78f68", "#121826"),
    notes: null,
    attachments: [],
    procedure_photos: [],
    created_at: "2026-04-30T10:00:00.000Z",
    updated_at: "2026-04-30T10:00:00.000Z",
  },
];

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
        className={`group w-full rounded-[26px] border border-[#dce5ee] bg-gradient-to-b from-white to-[#fbfdff] text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-[#cbd8e5] focus:outline-none focus:ring-4 focus:ring-[#19a14f]/8 ${
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
          <div className="max-h-60 overflow-auto rounded-[22px]">
            {options.map((option) => {
              const active = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelect(option)}
                  className={`mx-1 mb-1 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-full px-4 py-3 text-left text-[14px] font-medium transition-colors last:mb-0 ${
                    active
                      ? "border border-[#bfe8c7] bg-[#f0fbf2] text-[#0f9c68] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
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

type FancySelectProps = {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  compact?: boolean;
  showLabel?: boolean;
};

function FancySelect({ label, value, options, onSelect, compact = false, showLabel = true }: FancySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`group w-full rounded-[20px] border bg-white text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-[#b7d9c2] focus:outline-none focus:ring-4 focus:ring-[#19a14f]/8 ${
          open ? "border-[#19a14f]" : "border-[#dce5ee]"
        } ${compact ? "h-12 px-4" : "min-h-[72px] px-4 py-3"}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {showLabel ? (
              <>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {label}
                </span>
                <span className="block truncate text-[15px] font-medium text-slate-800">{value}</span>
              </>
            ) : (
              <span className="block truncate text-[15px] font-medium text-slate-800">{value}</span>
            )}
          </div>

          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              open
                ? "bg-[#edf8f1] text-[#0f9c68]"
                : "bg-[#f6f9fc] text-slate-400 group-hover:bg-[#effaf3] group-hover:text-[#0f9c68]"
            }`}
          >
            <ChevronDown size={16} />
          </span>
        </div>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+10px)] z-30 w-full rounded-[18px] border border-[#dce5ee] bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
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
                      ? "border border-[#bfe8c7] bg-[#f0fbf2] text-[#0f9c68] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
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

function FieldLabel({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <span className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-slate-700">
      <Icon size={18} className="text-[#159a4a]" />
      <span>{children}</span>
    </span>
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
    doctorName: patient.doctor_name ?? "",
    convenioName: patient.convenio_name ?? "",
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
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
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
  const [doctorFilter, setDoctorFilter] = useState("Todos");
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
      setCreatePanelOpen(true);
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

        const loadedPatients = payload.patients ?? [];
        setPatients(loadedPatients.length > 0 ? loadedPatients : demoPatients);
      } catch (loadError) {
        console.error(loadError);
        setPatients(demoPatients);
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

      const matchesDoctor =
        doctorFilter === "Todos" ||
        (patient.doctor_name ?? "").toLowerCase() === doctorFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType && matchesSource && matchesDoctor;
    });

    if (sortOrder === "Nome Z-A") {
      current = [...current].sort((a, b) => b.full_name.localeCompare(a.full_name));
    } else {
      current = [...current].sort((a, b) => a.full_name.localeCompare(b.full_name));
    }

    return current;
  }, [patients, search, statusFilter, typeFilter, sourceFilter, doctorFilter, sortOrder]);


  function openCreateModal() {
    setError("");
    setActivePatient(null);
    setForm(initialForm);
    setModalMode("create");
    setCreatePanelOpen(true);
    router.push("/pacientes?new=1");
  }

  function openEditModal(patient: Patient) {
    setError("");
    setCreatePanelOpen(false);
    setActivePatient(patient);
    setForm(buildForm(patient));
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setCreatePanelOpen(false);
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

      {createPanelOpen ? (
        <section className="rounded-[28px] border border-[#dfe6ef] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[26px] font-bold tracking-[-0.03em] text-slate-900">{modalTitle}</h3>
              <p className="mt-2 text-[14px] leading-6 text-slate-500">{modalSubtitle}</p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50"
              aria-label="Fechar cadastro"
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
              </aside>

              <div className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <FieldLabel icon={UserRound}>Nome completo</FieldLabel>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(event) => updateForm("fullName", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                      placeholder="Amanda Rocha"
                    />
                  </label>

                  <label className="block">
                    <FieldLabel icon={Mail}>E-mail</FieldLabel>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => updateForm("email", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                      placeholder="cliente@email.com"
                    />
                  </label>

                  <label className="block">
                    <FieldLabel icon={Phone}>Telefone</FieldLabel>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(event) => updateForm("phone", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                      placeholder="(11) 98765-4321"
                    />
                  </label>

                  <label className="block">
                    <FieldLabel icon={CalendarDays}>Última visita</FieldLabel>
                    <input
                      type="date"
                      value={form.lastVisit}
                      onChange={(event) => updateForm("lastVisit", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors focus:border-[#19a14f]"
                    />
                  </label>

                  <label className="block">
                      <FieldLabel icon={Sparkles}>Status</FieldLabel>
                      <FancySelect
                        label="Status"
                        value={form.status === "ativo" ? "Ativo" : "Inativo"}
                        options={["Ativo", "Inativo"]}
                        onSelect={(value) => updateForm("status", value === "Inativo" ? "inativo" : "ativo")}
                        showLabel={false}
                        compact
                      />
                    </label>

                  <label className="block">
                      <FieldLabel icon={Tag}>Tipo</FieldLabel>
                      <FancySelect
                        label="Tipo"
                        value={form.type}
                        options={["Particular", "Conveniado"]}
                        onSelect={(value) => {
                          updateForm("type", value);
                          if (value !== "Conveniado") {
                            updateForm("convenioName", "");
                          }
                        }}
                        showLabel={false}
                        compact
                      />
                    </label>

                  {form.type === "Conveniado" ? (
                    <label className="block">
                      <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                        Convênio
                      </span>
                      <input
                        type="text"
                        value={form.convenioName}
                        onChange={(event) => updateForm("convenioName", event.target.value)}
                        placeholder="Ex.: Bradesco Saúde"
                        className="h-12 w-full rounded-[26px] border border-[#dce5ee] bg-gradient-to-b from-white to-[#fbfdff] px-4 text-[15px] text-slate-700 outline-none transition-all focus:border-[#19a14f]"
                      />
                    </label>
                  ) : null}

                  <label className="block">
                      <FieldLabel icon={Globe2}>Fonte</FieldLabel>
                      <FancySelect
                        label="Fonte"
                        value={form.source}
                        options={["Instagram", "Indicação", "Google", "Site"]}
                        onSelect={(value) => updateForm("source", value)}
                        showLabel={false}
                        compact
                      />
                    </label>

                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold text-slate-700">Agendamentos</span>
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
                    <FieldLabel icon={CircleDollarSign}>Gasto total</FieldLabel>
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
                  <FieldLabel icon={FileText}>Observações</FieldLabel>
                  <textarea
                    value={form.notes}
                    onChange={(event) => updateForm("notes", event.target.value)}
                    rows={5}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                    placeholder="Informações clínicas, preferências, alergias, observações de retorno..."
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
                          Guarde antes e depois, evolução e registros do atendimento.
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
                              <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
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
                {saving ? "Salvando..." : "Salvar cliente"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <div ref={filtersRef} className="space-y-5">
      <section className="rounded-[24px] border border-[#e5e9ef] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_repeat(4,minmax(0,170px))_auto]">
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

          <DropdownSelect
            label="Doutor"
            value={doctorFilter}
            options={filterOptions.doctor}
            open={openMenu === "doctor"}
            onToggle={() => toggleMenu("doctor")}
            onSelect={(value) => {
              setDoctorFilter(value);
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
                        <p className="mt-1 truncate text-[13px] text-slate-500">
                          Doutor: {patient.doctor_name || "Nao definido"}
                        </p>
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
                  <th className="px-4 py-3">Doutor</th>
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
                    <td className="px-4 py-4">{patient.doctor_name || "Nao definido"}</td>
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

      {modalMode === "edit" ? (
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
                      <FieldLabel icon={UserRound}>Nome completo</FieldLabel>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(event) => updateForm("fullName", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                        placeholder="Amanda Rocha"
                      />
                    </label>

                    <label className="block">
                      <FieldLabel icon={Mail}>E-mail</FieldLabel>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => updateForm("email", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                        placeholder="cliente@email.com"
                      />
                    </label>

                    <label className="block">
                      <FieldLabel icon={Phone}>Telefone</FieldLabel>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(event) => updateForm("phone", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                        placeholder="(11) 98765-4321"
                      />
                    </label>

                    <label className="block">
                      <FieldLabel icon={UserRound}>Doutor</FieldLabel>
                      <input
                        type="text"
                        value={form.doctorName}
                        onChange={(event) => updateForm("doctorName", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-[15px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#19a14f]"
                        placeholder="Dr. Carlos"
                      />
                    </label>

                    <label className="block">
                      <FieldLabel icon={CalendarDays}>Última visita</FieldLabel>
                      <input
                        type="date"
                        value={form.lastVisit}
                        onChange={(event) => updateForm("lastVisit", event.target.value)}
                        className="h-12 w-full rounded-[26px] border border-[#dce5ee] bg-gradient-to-b from-white to-[#fbfdff] px-4 text-[15px] text-slate-700 outline-none transition-all focus:border-[#19a14f]"
                      />
                    </label>

                    <label className="block">
                      <FieldLabel icon={Sparkles}>Status</FieldLabel>
                      <FancySelect
                        label="Status"
                        value={form.status === "ativo" ? "Ativo" : "Inativo"}
                        options={["Ativo", "Inativo"]}
                        onSelect={(value) => updateForm("status", value === "Inativo" ? "inativo" : "ativo")}
                        showLabel={false}
                        compact
                      />
                    </label>

                    <label className="block">
                      <FieldLabel icon={Tag}>Tipo</FieldLabel>
                      <FancySelect
                        label="Tipo"
                        value={form.type}
                        options={["Particular", "Conveniado"]}
                        onSelect={(value) => {
                          updateForm("type", value);
                          if (value !== "Conveniado") {
                            updateForm("convenioName", "");
                          }
                        }}
                        showLabel={false}
                        compact
                      />
                    </label>

                    <label className="block">
                      <FieldLabel icon={Globe2}>Fonte</FieldLabel>
                      <FancySelect
                        label="Fonte"
                        value={form.source}
                        options={["Instagram", "Indicação", "Google", "Site"]}
                        onSelect={(value) => updateForm("source", value)}
                        showLabel={false}
                        compact
                      />
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
                      <FieldLabel icon={CircleDollarSign}>Gasto total</FieldLabel>
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
                    <FieldLabel icon={FileText}>Observações</FieldLabel>
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
