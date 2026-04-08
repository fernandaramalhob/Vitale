"use client";

const kpis = [
  { label: "OCUPACAO DA AGENDA",      value: "91%" },
  { label: "COMPARECIMENTO PREVISTO", value: "84%" },
  { label: "ESPERA MEDIA ALVO",       value: "11 min" },
];

const colunas = [
  {
    id: "confirmados",
    label: "Confirmados",
    count: 2,
    gradient: "linear-gradient(90deg, #218a45 0%, #218a45 100%)",
    pacientes: [
      { hora: "08:30", nome: "Luciana Freitas", proc: "Bioestimulador" },
      { hora: "09:15", nome: "Carla Mendes",    proc: "Preenchimento" },
    ],
  },
  {
    id: "preparo",
    label: "Em preparo",
    count: 2,
    gradient: "linear-gradient(90deg, #218a45 0%, #5ddb7c 100%)",
    pacientes: [
      { hora: "10:15", nome: "Renata Borges", proc: "Bioestimulador" },
      { hora: "11:00", nome: "Patricia Lima", proc: "Toxina botulinica" },
    ],
  },
  {
    id: "atendimento",
    label: "Em atendimento",
    count: 2,
    gradient: "linear-gradient(90deg, #218a45 0%, #218a45 100%)",
    pacientes: [
      { hora: "13:40", nome: "Juliana Vilela", proc: "Harmonizacao facial" },
      { hora: "14:20", nome: "Beatriz Costa",  proc: "Fios de PDO" },
    ],
  },
  {
    id: "posconsulta",
    label: "Pos-consulta",
    count: 2,
    gradient: "linear-gradient(90deg, #218a45 0%, #218a45 100%)",
    pacientes: [
      { hora: "16:10", nome: "Marcos Telles", proc: "Laser vascular" },
      { hora: "16:50", nome: "Amanda Rocha",  proc: "Peeling quimico" },
    ],
  },
];

export function ResumoPage() {
  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-body)" }}>
      {/* Hero card */}
      <div
        className="rounded-2xl p-8"
        style={{
          background: "linear-gradient(135deg, #eaf6f0 0%, #d6f0e4 60%, #c2e8d8 100%)",
          border: "1px solid #bbe0ce",
        }}
      >
        <h1 className="text-4xl font-bold leading-tight max-w-2xl" style={{ color: "#0d2b1e" }}>
          Operacao clinica pronta para o pico da tarde
        </h1>
        <p className="mt-3 max-w-3xl text-base" style={{ color: "#3d7a5c" }}>
          A operacao entra no pico com agenda alta, CRM aquecido e dois pontos
          de risco que pedem resposta rapida do time clinico e comercial.
        </p>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl p-5"
              style={{ backgroundColor: "#ffffff", border: "1px solid #d0e8dc" }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "#7aaa92" }}
              >
                {kpi.label}
              </p>
              <p className="text-3xl font-bold" style={{ color: "#0d2b1e" }}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#218a45" }}
            >
              AGENDA DO DIA
            </p>
            <h2 className="text-2xl font-bold" style={{ color: "#0d2b1e" }}>
              Kanban do turno
            </h2>
          </div>
          <span className="text-sm font-medium" style={{ color: "#218a45" }}>
            8 pacientes
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {colunas.map((col) => (
            <div key={col.id} className="space-y-3">
              <div
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: col.gradient }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    {col.count}
                  </span>
                  <span className="text-white font-semibold text-sm">{col.label}</span>
                </div>
                <button className="text-white/80 hover:text-white text-xl font-light">+</button>
              </div>

              {col.pacientes.map((p) => (
                <div
                  key={p.nome}
                  className="rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-md"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e8f0ec",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: "#9ab0a4" }}>
                      {p.hora}
                    </span>
                    <button className="text-xs" style={{ color: "#c0d4ca" }}>↗</button>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "#0d2b1e" }}>{p.nome}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#8aab98" }}>{p.proc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
