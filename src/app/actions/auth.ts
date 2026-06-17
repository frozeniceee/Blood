"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  loginUser, 
  registerDonor, 
  adminLogin,
  updateDonorProfile,
  updateDonorAvailability,
  adminApproveDonor,
  adminDeclineDonor,
  adminAddAdmin,
  getDonorProfile
} from "@/lib/db";

// User Login Action
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Please enter email and password" };
  }

  const result = await loginUser(email, password);

  if (result.success && result.userId) {
    const cookieStore = await cookies();
    cookieStore.set("mock_session", result.userId, { path: "/", maxAge: 60 * 60 * 24 * 7 }); // 1 week
    return { success: true };
  } else {
    return { success: false, error: result.error || "Invalid email or password" };
  }
}

// User Registration Action
export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const ageStr = formData.get("age") as string;
  const bloodGroup = formData.get("bloodGroup") as string;
  const phone = formData.get("phone") as string;
  const area = formData.get("area") as string;
  const medicalHistory = formData.get("medicalHistory") as string;

  if (!email || !password || !firstName || !lastName || !bloodGroup || !phone || !area) {
    return { success: false, error: "Please fill in all required fields" };
  }

  const age = parseInt(ageStr, 10);
  if (isNaN(age) || age < 18 || age > 65) {
    return { success: false, error: "Age must be between 18 and 65" };
  }

  const name = `${firstName} ${lastName}`;
  const donorData = {
    name,
    email,
    phone,
    bloodGroup,
    area,
    age,
    medicalHistory: medicalHistory || "",
  };

  const result = await registerDonor(email, password, donorData);

  if (result.success && result.userId) {
    const cookieStore = await cookies();
    cookieStore.set("mock_session", result.userId, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    return { success: true };
  } else {
    return { success: false, error: result.error || "Registration failed" };
  }
}

// User Logout Action
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("mock_session");
  redirect("/");
}

// Admin Login Action
export async function adminLoginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Please enter username and password" };
  }

  const isValid = await adminLogin(username, password);

  if (isValid) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", { path: "/", maxAge: 60 * 60 * 2 }); // 2 hours
    return { success: true };
  } else {
    return { success: false, error: "Invalid admin username or password" };
  }
}

// Admin Logout Action
export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/");
}

// Get Logged In User Profile Action
export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const sessionUser = cookieStore.get("mock_session")?.value;
  
  if (!sessionUser) {
    return { success: false, error: "Not logged in" };
  }

  const profile = await getDonorProfile(sessionUser);
  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  return { success: true, profile };
}

// Update User Profile Action
export async function updateProfileAction(formData: FormData) {
  const cookieStore = await cookies();
  const sessionUser = cookieStore.get("mock_session")?.value;
  
  if (!sessionUser) {
    return { success: false, error: "Not logged in" };
  }

  const phone = formData.get("phone") as string;
  const area = formData.get("area") as string;
  const medicalHistory = formData.get("medicalHistory") as string;
  const totalDonationsStr = formData.get("totalDonations") as string;
  const lastDonationDate = formData.get("lastDonationDate") as string;

  if (!phone || !area) {
    return { success: false, error: "Phone number and area are required" };
  }

  const totalDonations = parseInt(totalDonationsStr, 10);
  const totalDonationsParsed = isNaN(totalDonations) ? 0 : totalDonations;

  const success = await updateDonorProfile(
    sessionUser, 
    phone, 
    area, 
    medicalHistory || "",
    totalDonationsParsed,
    lastDonationDate || "Never"
  );
  
  if (success) {
    return { success: true };
  } else {
    return { success: false, error: "Failed to update profile" };
  }
}

// Update User Availability Action
export async function updateAvailabilityAction(isAvailable: boolean) {
  const cookieStore = await cookies();
  const sessionUser = cookieStore.get("mock_session")?.value;
  
  if (!sessionUser) {
    return { success: false, error: "Not logged in" };
  }

  const success = await updateDonorAvailability(sessionUser, isAvailable);
  
  if (success) {
    return { success: true };
  } else {
    return { success: false, error: "Failed to update availability" };
  }
}

// Admin: Approve Donor Action
export async function approveDonorAction(id: string) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_session");
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const success = await adminApproveDonor(id);
  return { success };
}

// Admin: Decline Donor Action
export async function declineDonorAction(id: string) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_session");
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const success = await adminDeclineDonor(id);
  return { success };
}

// Admin: Add Admin Action
export async function addAdminAction(formData: FormData) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_session");
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Username and password are required" };
  }

  const success = await adminAddAdmin(username, password);
  if (success) {
    return { success: true };
  } else {
    return { success: false, error: "Admin already exists or failed to create" };
  }
}
