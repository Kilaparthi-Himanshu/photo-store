'use server';

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";

function extractFilePath(url) {
    const parts = url.split('/user_uploads/');
    if (parts.length < 2) {
        console.error("Invalid URL format");
        return '';
    }

    let filePath = parts[1];
    if (filePath.includes('?')) {
        filePath = filePath.split('?')[0];
    }
    return 'user_uploads/' + filePath;
}

export async function deletePhoto(formData) {
    const src = formData.get('photoPath');
    const filePath = extractFilePath(src);
    const supabase = await createClient();
    const { error } = await supabase.storage.from('photos').remove([filePath]);
    if (error) {
        return {success: false, error}
    }
    revalidatePath('/photos');
    return {success: true};
}