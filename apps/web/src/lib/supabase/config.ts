const fallbackSupabaseUrl = "https://uldblllyvfnjudrinfsx.supabase.co";
const fallbackSupabaseKey = "sb_publishable_hyjGSmmQdSHUl2PHtfsRlg_MOlUynN8";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || fallbackSupabaseUrl;

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  fallbackSupabaseKey;
