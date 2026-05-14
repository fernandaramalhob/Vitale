import { NextResponse } from "next/server";

import { getDb, hasDatabaseUrl } from "@/lib/db";

type AppointmentRow = {
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

function parseBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return null;
  }

  const data = body as Record<string, unknown>;
  const patientName = String(data.patientName ?? "").trim();
  const appointmentDate = String(data.appointmentDate ?? "").trim();
  const appointmentTime = String(data.appointmentTime ?? "").trim();
  const durationMinutes = Number(data.durationMinutes);
  const category = String(data.category ?? "").trim();
  const procedureName = String(data.procedureName ?? "").trim();
  const notes = String(data.notes ?? "").trim();

  if (
    !patientName ||
    !appointmentDate ||
    !appointmentTime ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0 ||
    !category ||
    !procedureName
  ) {
    return null;
  }

  return {
    patientName,
    appointmentDate,
    appointmentTime,
    durationMinutes: Math.trunc(durationMinutes),
    category,
    procedureName,
    notes: notes || null,
  };
}

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ appointments: [] });
  }

  const db = getDb();
  const appointments = await db<AppointmentRow[]>`
    select
      id,
      patient_name,
      appointment_date,
      appointment_time,
      duration_minutes,
      category,
      procedure_name,
      notes,
      status,
      created_at
    from public.vitale_appointments
    order by appointment_date asc, appointment_time asc, created_at desc
  `;

  return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Corpo da requisicao invalido." }, { status: 400 });
  }

  const data = parseBody(body);

  if (!data) {
    return NextResponse.json(
      { message: "Preencha nome, data, horario, duracao, categoria e procedimento." },
      { status: 400 }
    );
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      {
        message:
          "DATABASE_URL nao configurada. Me envie a connection string do banco para eu salvar os agendamentos.",
      },
      { status: 503 }
    );
  }

  const db = getDb();
  const [appointment] = await db<AppointmentRow[]>`
    insert into public.vitale_appointments (
      patient_name,
      appointment_date,
      appointment_time,
      duration_minutes,
      category,
      procedure_name,
      notes
    )
    values (
      ${data.patientName},
      ${data.appointmentDate}::date,
      ${data.appointmentTime}::time,
      ${data.durationMinutes},
      ${data.category},
      ${data.procedureName},
      ${data.notes}
    )
    returning
      id,
      patient_name,
      appointment_date,
      appointment_time,
      duration_minutes,
      category,
      procedure_name,
      notes,
      status,
      created_at
  `;

  return NextResponse.json({ appointment }, { status: 201 });
}
