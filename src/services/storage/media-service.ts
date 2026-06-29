import { getSupabaseClient } from "@/services/supabase/client";

const MEDIA_BUCKET = "media";

export async function uploadMedia(file: File, folder = "uploads") {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const result = await getSupabaseClient().storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (result.error) throw result.error;
  return {
    path: result.data.path,
    publicUrl: getMediaPublicUrl(result.data.path),
  };
}

export function getMediaPublicUrl(path: string) {
  return getSupabaseClient().storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function deleteMedia(path: string) {
  return getSupabaseClient().storage.from(MEDIA_BUCKET).remove([path]);
}
