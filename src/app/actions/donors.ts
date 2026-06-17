"use server";

import { cookies } from "next/headers";
import { getDonors, adminGetRegistrations, adminGetAdmins } from "@/lib/db";

// Fetch approved donors for public search
export async function getApprovedDonorsAction() {
  const allDonors = await getDonors();
  // Filter for approved donors only
  return allDonors.filter(d => d.status === "approved");
}

// Fetch all registrations (admin only)
export async function adminGetRegistrationsAction() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_session");
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }
  return await adminGetRegistrations();
}

// Fetch all admins (admin only)
export async function adminGetAdminsAction() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_session");
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }
  return await adminGetAdmins();
}
