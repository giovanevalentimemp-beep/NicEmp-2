import { getSupabaseClient } from "@/services/supabase/client";

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  document: string | null;
  created_at: string;
  updated_at: string;
}

export async function getCompanies() {
  return getSupabaseClient()
    .from("companies")
    .select("*")
    .order("name");
}

export async function createCompany(
  ownerId: string,
  name: string,
  document?: string
) {
  return getSupabaseClient()
    .from("companies")
    .insert({
      owner_id: ownerId,
      name,
      document,
    })
    .select()
    .single();
}