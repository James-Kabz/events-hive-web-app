"use server"

import { signIn, signOut } from "@/auth"
import { revalidatePath } from "next/cache";

export async function login(provider: string){
    await signIn(provider, { redirectTo:"/dashboard" });
    revalidatePath("/dashboard");
}

export async function logout(){
    await signOut({ redirectTo:"/login" });
    revalidatePath("/login");
}