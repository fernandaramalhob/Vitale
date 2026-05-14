import postgres from "postgres";

const connectionString = process.env.DATABASE_URL?.trim();

declare global {
  // eslint-disable-next-line no-var
  var __vitaleDb: ReturnType<typeof postgres> | undefined;
}

export function hasDatabaseUrl() {
  return Boolean(connectionString);
}

export function getDb() {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const isSupabase = connectionString.includes("supabase.co");

  const db =
    globalThis.__vitaleDb ??
    postgres(connectionString, {
      ssl: isSupabase ? "require" : false,
      prepare: false,
    });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__vitaleDb = db;
  }

  return db;
}
