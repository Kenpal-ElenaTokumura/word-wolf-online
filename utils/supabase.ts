import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  // server-side key
  process.env.SERVICE_ROLE_KEY ??
    // client-side key
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
);

export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type Player = Database["public"]["Tables"]["players"]["Row"];
