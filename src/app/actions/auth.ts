"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction() {
  const cookieStore = await cookies();
  cookieStore.set("mock_session", "true", { path: "/" });
  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("mock_session");
  redirect("/");
}

export async function adminLoginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  
  if ((username === "admin1" && password === "admin123") || 
      (username === "admin2" && password === "admin123")) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", { path: "/" });
    redirect("/admin");
  } else {
    // Basic redirect for invalid login (simulating error)
    redirect("/admin/login?error=true");
  }
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/");
}

