import fs from "fs";
import path from "path";
import { createClient as createSupabaseServerClient } from "./supabase/server";

// Helper to check if Supabase is configured with valid credentials
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url && 
    anonKey && 
    url !== "your_supabase_project_url" && 
    anonKey !== "your_supabase_anon_key"
  );
}

// Local JSON file path helper
const jsonDbPath = path.join(process.cwd(), "src/lib/db.json");

function readJsonDb() {
  try {
    if (!fs.existsSync(jsonDbPath)) {
      // Re-create with empty structure if deleted
      const empty = { users: [], donors: [], admins: [] };
      fs.writeFileSync(jsonDbPath, JSON.stringify(empty, null, 2));
      return empty;
    }
    const data = fs.readFileSync(jsonDbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON DB:", error);
    return { users: [], donors: [], admins: [] };
  }
}

function writeJsonDb(data: any) {
  try {
    fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing JSON DB:", error);
  }
}

// Interfaces
export interface DonorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  area: string;
  age: number;
  medicalHistory: string;
  available: boolean;
  status: "pending" | "approved" | "declined";
  date: string;
  lastDonation?: string;
  totalDonations: number;
}

// --------------------------------------------------------------------
// PUBLIC API
// --------------------------------------------------------------------

export async function getDonors(): Promise<DonorProfile[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("donors")
        .select("*");
      
      if (error) throw error;
      
      return (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        email: "", // email not public on Supabase for safety
        phone: d.phone,
        bloodGroup: d.blood_group,
        area: d.area,
        age: d.age || 0,
        medicalHistory: d.notes || "",
        available: d.is_available,
        status: d.status as any,
        date: d.created_at ? d.created_at.split("T")[0] : "",
        lastDonation: d.last_donation_date || "Never",
        totalDonations: d.total_donations || 0
      }));
    } catch (e) {
      console.error("Supabase getDonors error, falling back to JSON DB:", e);
    }
  }

  const db = readJsonDb();
  return db.donors;
}

export async function getDonorProfile(id: string): Promise<DonorProfile | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        email: "", // email fetch if needed, can get from user profile
        phone: data.phone,
        bloodGroup: data.blood_group,
        area: data.area,
        age: data.age || 0,
        medicalHistory: data.notes || "",
        available: data.is_available,
        status: data.status as any,
        date: data.created_at ? data.created_at.split("T")[0] : "",
        lastDonation: data.last_donation_date || "Never",
        totalDonations: data.total_donations || 0
      };
    } catch (e) {
      console.error("Supabase getDonorProfile error, falling back to JSON DB:", e);
    }
  }

  const db = readJsonDb();
  return db.donors.find((d: any) => d.id === id) || null;
}

export async function registerDonor(email: string, password: string, donorData: Omit<DonorProfile, "id" | "status" | "date" | "available" | "lastDonation" | "totalDonations">): Promise<{ success: boolean; error?: string; userId?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      // 1. Sign up user in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create auth user");
      }

      const userId = authData.user.id;

      // 2. Insert donor profile
      const { error: profileError } = await supabase
        .from("donors")
        .insert({
          id: userId,
          name: donorData.name,
          phone: donorData.phone,
          blood_group: donorData.bloodGroup,
          area: donorData.area,
          age: donorData.age,
          notes: donorData.medicalHistory,
          status: "pending",
          is_available: true,
          total_donations: 0,
          last_donation_date: null
        });

      if (profileError) {
        console.error("Failed to insert profile, removing user...", profileError);
        // Best effort clean up: delete auth user if profile insertion failed
        await supabase.auth.admin.deleteUser(userId);
        throw profileError;
      }

      return { success: true, userId };
    } catch (e: any) {
      console.error("Supabase registration failed, falling back to JSON DB:", e);
      return { success: false, error: e.message || "Registration failed" };
    }
  }

  // Fallback to JSON DB
  const db = readJsonDb();
  if (db.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "Email already exists" };
  }

  const newId = Date.now().toString();
  db.users.push({ id: newId, email, password, role: "user" });
  
  const newDonor: DonorProfile = {
    id: newId,
    name: donorData.name,
    email,
    phone: donorData.phone,
    bloodGroup: donorData.bloodGroup,
    area: donorData.area,
    age: donorData.age,
    medicalHistory: donorData.medicalHistory,
    available: true,
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    lastDonation: "Never",
    totalDonations: 0
  };
  
  db.donors.push(newDonor);
  writeJsonDb(db);

  return { success: true, userId: newId };
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string; userId?: string; name?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user returned");

      const profile = await getDonorProfile(data.user.id);
      return { 
        success: true, 
        userId: data.user.id, 
        name: profile?.name || data.user.email 
      };
    } catch (e: any) {
      console.error("Supabase login failed, falling back to JSON DB:", e);
    }
  }

  // Fallback to JSON DB
  const db = readJsonDb();
  const user = db.users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const donor = db.donors.find((d: any) => d.id === user.id);
  return { 
    success: true, 
    userId: user.id, 
    name: donor?.name || user.email 
  };
}

export async function updateDonorProfile(id: string, phone: string, area: string, medicalHistory: string, totalDonations: number, lastDonationDate: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase
        .from("donors")
        .update({
          phone,
          area,
          notes: medicalHistory,
          total_donations: totalDonations,
          last_donation_date: lastDonationDate === "Never" || !lastDonationDate ? null : lastDonationDate,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Supabase profile update failed, falling back to JSON DB:", e);
    }
  }

  const db = readJsonDb();
  const index = db.donors.findIndex((d: any) => d.id === id);
  if (index !== -1) {
    db.donors[index].phone = phone;
    db.donors[index].area = area;
    db.donors[index].medicalHistory = medicalHistory;
    db.donors[index].totalDonations = totalDonations;
    db.donors[index].lastDonation = lastDonationDate || "Never";
    writeJsonDb(db);
    return true;
  }
  return false;
}

export async function updateDonorAvailability(id: string, isAvailable: boolean): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase
        .from("donors")
        .update({
          is_available: isAvailable,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Supabase availability update failed, falling back to JSON DB:", e);
    }
  }

  const db = readJsonDb();
  const index = db.donors.findIndex((d: any) => d.id === id);
  if (index !== -1) {
    db.donors[index].available = isAvailable;
    writeJsonDb(db);
    return true;
  }
  return false;
}

export async function adminGetRegistrations(): Promise<DonorProfile[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("donors")
        .select("*");
      
      if (error) throw error;
      
      return (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        email: "", // email not fetched
        phone: d.phone,
        bloodGroup: d.blood_group,
        area: d.area,
        age: d.age || 0,
        medicalHistory: d.notes || "",
        available: d.is_available,
        status: d.status as any,
        date: d.created_at ? d.created_at.split("T")[0] : "",
        lastDonation: d.last_donation_date || "Never",
        totalDonations: d.total_donations || 0
      }));
    } catch (e) {
      console.error("Supabase admin get error, falling back to JSON DB:", e);
    }
  }

  const db = readJsonDb();
  return db.donors;
}

export async function adminApproveDonor(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase
        .from("donors")
        .update({ status: "approved" })
        .eq("id", id);
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Supabase approve error, falling back to JSON DB:", e);
    }
  }

  const db = readJsonDb();
  const index = db.donors.findIndex((d: any) => d.id === id);
  if (index !== -1) {
    db.donors[index].status = "approved";
    writeJsonDb(db);
    return true;
  }
  return false;
}

export async function adminDeclineDonor(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase
        .from("donors")
        .update({ status: "declined" })
        .eq("id", id);
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Supabase decline error, falling back to JSON DB:", e);
    }
  }

  const db = readJsonDb();
  const index = db.donors.findIndex((d: any) => d.id === id);
  if (index !== -1) {
    db.donors[index].status = "declined";
    writeJsonDb(db);
    return true;
  }
  return false;
}

export async function adminGetAdmins(): Promise<any[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("admins")
        .select("*");
      
      if (error) throw error;
      return (data || []).map((a: any) => ({
        id: a.id,
        username: a.username,
        createdDate: a.created_at ? a.created_at.split("T")[0] : ""
      }));
    } catch (e) {
      console.error("Supabase admin list error, falling back to JSON DB:", e);
    }
  }

  const db = readJsonDb();
  return db.admins.map((a: any) => ({
    id: a.id,
    username: a.username,
    createdDate: a.createdDate
  }));
}

export async function adminAddAdmin(username: string, password: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase
        .from("admins")
        .insert({ username, password });
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Supabase add admin error, falling back to JSON DB:", e);
    }
  }

  const db = readJsonDb();
  if (db.admins.some((a: any) => a.username.toLowerCase() === username.toLowerCase())) {
    return false;
  }

  db.admins.push({
    id: Date.now().toString(),
    username,
    password,
    createdDate: new Date().toISOString().split("T")[0]
  });
  writeJsonDb(db);
  return true;
}

export async function adminLogin(username: string, password: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();
      
      if (error) throw error;
      return !!data;
    } catch (e) {
      console.error("Supabase admin login error, checking fallback:", e);
    }
  }

  const db = readJsonDb();
  return db.admins.some(
    (a: any) => a.username.toLowerCase() === username.toLowerCase() && a.password === password
  );
}
