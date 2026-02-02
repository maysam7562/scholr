import { supabase } from "./supabaseClient";

export async function getUserOrThrow() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Not logged in");
  return data.user;
}
