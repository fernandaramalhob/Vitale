"use client";

const kpis = [
  { label: "OCUPACAO DA AGENDA", value: "91%" },
  { label: "COMPARECIMENTO PREVISTO", value: "84%" },
  { label: "ESPERA MEDIA ALVO", value: "11 min" },
];

const colunas = [
  {
    id: "confirmados",
    label: "Confirmados",
    count: 2,
    gradient: "linear-gradient(90deg, #24994a 0%, #1ca282 100%)",
    pacientes: [
      { hora: "08:30", nome: "Luciana Freitas", proc: "Bioestimulador" },
      { hora: "09:15", nome: "Carla Mendes", proc: "Preenchimento" },
    ],
  },
  {
    id: "preparo",
    label: "Em preparo",
    count: 2,
    gradient: "linear-gradient(90deg, #24994a 0%, #88d62d 100%)",
    pacientes: [
      { hora: "10:15", nome: "Renata Borges", proc: "Bioestimulador" },
      { hora: "11:00", nome: "Patricia Lima", proc: "Toxina botulinica" },
    ],
  },
  {
    id: "atendimento",
    label: "Em atendimento",
    count: 2,
    gradient: "linear-gradient(90deg, #24994a 0%, #1bb19d 100%)",
    pacientes: [
      { hora: "13:40", nome: "Juliana Vilela", proc: "Harmonizacao facial" },
      { hora: "14:20", nome: "Beatriz Costa", proc: "Fios de PDO" },
    ],
  },
  {
    id: "posconsulta",
    label: "Pos-consulta",
    count: 2,
    gradient: "linear-gradient(90deg, #24994a 0%, #1bb19d 100%)",
    pacientes: [
      { hora: "16:10", nome: "Marcos Telles", proc: "Laser vascular" },
      { hora: "16:50", nome: "Amanda Rocha", proc: "Peeling quimico" },
    ],
  },
];

export function ResumoPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[22px] border border-[#d9e4de] bg-[linear-gradient(90deg,#ecf9ef_0%,#eefcff_100%)] px-8 py-8 shadow-[0_1px_3px_rgba(18,37,24,0.05)]">
        <h1 className="max-w-5xl text-[30px] font-bold leading-[1.02] tracking-[-0.03em] text-[#121826] md:text-[56px]">
          Operacao clinica pronta para o pico da tarde
        </h1>
        <p className="mt-4 max-w-5xl text-[18px] leading-8 text-[#4b5563]">
          A operacao entra no pico com agenda alta, CRM aquecido e dois pontos
          de risco que pedem resposta rapida do time clinico e comercial.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[22px] border border-[#e7ece9] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#7f8b90]">
                {kpi.label}
              </p>
              <p className="text-[41px] font-bold leading-none text-[#111827]">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-[#dfe6e1] bg-white px-8 py-8 shadow-[0_1px_3px_rgba(18,37,24,0.05)]">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.38em] text-[#4d8d73]">
              AGENDA DO DIA
            </p>
            <h2 className="text-[30px] font-bold tracking-[-0.03em] text-[#111827] md:text-[56px]">
              Kanban do turno
            </h2>
          </div>
          <span className="pb-2 text-[16px] font-medium text-[#4d8d73]">
            8 pacientes
          </span>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {colunas.map((col) => (
            <div key={col.id} className="space-y-4">
              <div
                className="flex items-center justify-between rounded-[28px] px-4 py-3 shadow-[0_0_0_6px_rgba(27,158,84,0.08)]"
                style={{ background: col.gradient }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[14px] font-bold text-[#4f5b63] shadow-sm">
                    {col.count}
                  </span>
                  <span className="text-[15px] font-semibold text-white">
                    {col.label}
                  </span>
                </div>
                <button className="text-[26px] font-light leading-none text-white/85 transition-colors hover:text-white">
                  +
                </button>
              </div>

              {col.pacientes.map((p) => (
                <div
                  key={p.nome}
                  className="cursor-pointer rounded-[18px] border border-[#edf0ec] bg-white px-4 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_22px_rgba(21,48,31,0.08)]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full border border-[#eceff1] px-4 py-1 text-[11px] font-semibold tracking-[0.24em] text-[#45515f]">
                      {p.hora}
                    </span>
                    <button className="text-[16px] font-medium text-[#adb7c4]">
                      ↗
                    </button>
                  </div>
                  <p className="text-[25px] font-semibold leading-tight tracking-[-0.03em] text-[#1a2233]">
                    {p.nome}
                  </p>
                  <p className="mt-3 text-[19px] text-[#46525e]">{p.proc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
