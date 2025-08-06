import { supabase } from 'src/lib/supabase';

export async function uploadSubmission(userId: string, fileBuffer: Buffer) {
  const filePath = `${userId}/${Date.now()}.zip`;

  const { error } = await supabase.storage
    .from('submissions')
    .upload(filePath, fileBuffer, {
      contentType: 'application/zip',
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  return filePath;
}
