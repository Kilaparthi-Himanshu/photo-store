'use server';

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function Logout() {
    const supabase = createClient();
    const {error} = (await supabase).auth.signOut();

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/login');
    revalidatePath('/');
    revalidatePath('/photos');
    redirect('/login');
}