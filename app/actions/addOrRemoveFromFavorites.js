'use server'

import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";

export async function addOrRemoveFromFavorites(formData) {
    const photoName = formData.get('photoName');
    const isFavorited = formData.get('isFavorited');

    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) return {success: false, error: 'User is not authenticated'}

    if (isFavorited === 'true') {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .match({
                user_id: user.id,
                photo_name: photoName
            });
        if (error) {
            return {success: false, error}
        }
    } else {
        const { error } = await supabase
            .from('favorites')
            .insert([{
                user_id: user.id,
                photo_name: photoName
            }]);
        if (error) {
            return {success: false, error}
        }
    }
    revalidatePath('/photos');
    revalidatePath('/favorites');

    return {success: true};
}