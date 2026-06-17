"use server";

import { cookies } from "next/headers";
import { getDonors, adminGetRegistrations, adminGetAdmins } from "@/lib/db";

// Fetch approved donors for public search
export async function getApprovedDonorsAction() {
  const allDonors = await getDonors();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return allDonors.filter(d => {
    // 1. Must be approved
    if (d.status !== "approved") return false;
    
    // 2. Must be available
    if (!d.available) return false;
    
    // 3. Must satisfy 90-day cooldown
    if (d.lastDonation && d.lastDonation !== "Never") {
      const lastDate = new Date(d.lastDonation);
      if (!isNaN(lastDate.getTime())) {
        lastDate.setHours(0, 0, 0, 0);
        
        // Difference in days
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // If they donated within the last 90 days, hide them
        if (diffDays >= 0 && diffDays < 90) {
          return false;
        }
      }
    }
    
    return true;
  });
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
