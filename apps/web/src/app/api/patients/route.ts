import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type PatientRow = {
  id: string;
  owner_id: string;
  full_name: string;
  email: string;
  phone: string;
  doctor_name: string | null;
  convenio_name: string | null;
  status: string;
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

function parseBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return null;
  }

  const data = body as Record<string, unknown>;
  const fullName = String(data.fullName ?? "").trim();
  const email = String(data.email ?? "").trim();
  const phone = String(data.phone ?? "").trim();
  const doctorName = String(data.doctorName ?? "").trim();
  const convenioName = String(data.convenioName ?? "").trim();
  const status = String(data.status ?? "ativo").trim().toLowerCase();
  const type = String(data.type ?? "particular").trim();
  const lastVisit = String(data.lastVisit ?? "").trim();
  const appointmentsCount = Number(data.appointmentsCount ?? 0);
  const totalSpent = Number(data.totalSpent ?? 0);
  const source = String(data.source ?? "Site").trim();
  const avatarUrl = String(data.avatarUrl ?? "").trim();
  const notes = String(data.notes ?? "").trim();
  const attachments = Array.isArray(data.attachments) ? data.attachments : [];
  const procedurePhotos = Array.isArray(data.procedurePhotos) ? data.procedurePhotos : [];

  if (!fullName || !email || !phone) {
    return null;
  }

  return {
    fullName,
    email,
    phone,
    doctorName: doctorName || null,
    convenioName: convenioName || null,
    status: status === "inativo" ? "inativo" : "ativo",
    type: type || "particular",
    lastVisit: lastVisit || null,
    appointmentsCount: Number.isFinite(appointmentsCount)
      ? Math.max(0, Math.trunc(appointmentsCount))
      : 0,
    totalSpent: Number.isFinite(totalSpent) ? totalSpent : 0,
    source: source || "Site",
    avatarUrl: avatarUrl || null,
    notes: notes || null,
    attachments,
    procedurePhotos,
  };
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Nao autenticado." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("vitale_patients")
    .select(
      "id, owner_id, full_name, email, phone, doctor_name, convenio_name, status, type, last_visit, appointments_count, total_spent, source, avatar_url, notes, attachments, procedure_photos, created_at, updated_at"
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ patients: data ?? [] });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Corpo da requisicao invalido." }, { status: 400 });
  }

  const payload = parseBody(body);

  if (!payload) {
    return NextResponse.json(
      { message: "Preencha nome, e-mail e telefone." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Nao autenticado." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("vitale_patients")
    .insert({
      owner_id: user.id,
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      doctor_name: payload.doctorName,
      convenio_name: payload.convenioName,
      status: payload.status,
      type: payload.type,
      last_visit: payload.lastVisit,
      appointments_count: payload.appointmentsCount,
      total_spent: payload.totalSpent,
      source: payload.source,
      avatar_url: payload.avatarUrl,
      notes: payload.notes,
      attachments: payload.attachments,
      procedure_photos: payload.procedurePhotos,
    })
    .select(
      "id, owner_id, full_name, email, phone, doctor_name, convenio_name, status, type, last_visit, appointments_count, total_spent, source, avatar_url, notes, attachments, procedure_photos, created_at, updated_at"
    )
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ patient: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Corpo da requisicao invalido." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const patientId = String(data.id ?? "").trim();

  if (!patientId) {
    return NextResponse.json({ message: "Paciente invalido." }, { status: 400 });
  }

  const payload = parseBody(body);

  if (!payload) {
    return NextResponse.json(
      { message: "Preencha nome, e-mail e telefone." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Nao autenticado." }, { status: 401 });
  }

  const { data: currentPatient, error: lookupError } = await supabase
    .from("vitale_patients")
    .select("id, owner_id")
    .eq("id", patientId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ message: lookupError.message }, { status: 500 });
  }

  if (!currentPatient) {
    return NextResponse.json({ message: "Paciente nao encontrado." }, { status: 404 });
  }

  const { data: updatedPatient, error } = await supabase
    .from("vitale_patients")
    .update({
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      doctor_name: payload.doctorName,
      convenio_name: payload.convenioName,
      status: payload.status,
      type: payload.type,
      last_visit: payload.lastVisit,
      appointments_count: payload.appointmentsCount,
      total_spent: payload.totalSpent,
      source: payload.source,
      avatar_url: payload.avatarUrl,
      notes: payload.notes,
      attachments: payload.attachments,
      procedure_photos: payload.procedurePhotos,
    })
    .eq("id", patientId)
    .eq("owner_id", user.id)
    .select(
      "id, owner_id, full_name, email, phone, doctor_name, convenio_name, status, type, last_visit, appointments_count, total_spent, source, avatar_url, notes, attachments, procedure_photos, created_at, updated_at"
    )
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ patient: updatedPatient });
}
