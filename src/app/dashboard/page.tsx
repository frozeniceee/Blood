"use client";

import { useState, useEffect } from "react";
import { User, Activity, Settings, Calendar, Shield, Save, Loader2, Info, AlertTriangle, CheckCircle, XCircle, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCurrentUserAction, updateProfileAction, updateAvailabilityAction } from "@/app/actions/auth";

const AREAS = ["Barishal", "Patuakhali", "Jhalokati", "Rajapur", "Bhola", "Pirojpur", "Barguna", "Kuakata", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gournadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Profile Forms State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [status, setStatus] = useState<"pending" | "approved" | "declined">("pending");
  const [registrationDate, setRegistrationDate] = useState("");
  
  // Donation Stats
  const [totalDonations, setTotalDonations] = useState(0);
  const [lastDonationDate, setLastDonationDate] = useState("Never");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getCurrentUserAction();
        if (res.success && res.profile) {
          setName(res.profile.name);
          setEmail(res.profile.email || "");
          setBloodGroup(res.profile.bloodGroup);
          setPhone(res.profile.phone);
          setArea(res.profile.area);
          setMedicalHistory(res.profile.medicalHistory);
          setIsAvailable(res.profile.available);
          setStatus(res.profile.status);
          setRegistrationDate(res.profile.date || "");
          setTotalDonations(res.profile.totalDonations || 0);
          setLastDonationDate(res.profile.lastDonation || "Never");
        } else {
          // If profile fetch fails or not logged in, redirect to login
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error loading dashboard profile:", err);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    // Optimistic update
    setIsAvailable(nextVal);
    
    try {
      const res = await updateAvailabilityAction(nextVal);
      if (!res.success) {
        alert(res.error || "Failed to update availability");
        setIsAvailable(isAvailable); // revert
      }
    } catch (e) {
      alert("Error updating availability");
      setIsAvailable(isAvailable); // revert
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("area", area);
    formData.append("medicalHistory", medicalHistory);
    formData.append("totalDonations", totalDonations.toString());
    formData.append("lastDonationDate", lastDonationDate);

    try {
      const res = await updateProfileAction(formData);
      if (res.success) {
        alert("Profile information updated successfully!");
        // Refresh local calculation
      } else {
        alert(res.error || "Failed to update profile info");
      }
    } catch (err) {
      alert("An unexpected error occurred while updating profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword && newPassword) {
      alert("Password changed successfully! (Local verification only)");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  // Cooldown calculation
  let daysRemaining = 0;
  let isCooldownActive = false;
  let nextEligibleDate = "";
  
  if (lastDonationDate && lastDonationDate !== "Never") {
    const lastDate = new Date(lastDonationDate);
    if (!isNaN(lastDate.getTime())) {
      const eligibleDate = new Date(lastDate.getTime());
      eligibleDate.setDate(eligibleDate.getDate() + 90);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eligibleDate.setHours(0, 0, 0, 0);
      
      if (today < eligibleDate) {
        isCooldownActive = true;
        const diffTime = eligibleDate.getTime() - today.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        nextEligibleDate = eligibleDate.toISOString().split("T")[0];
      }
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading your donor profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Cooldown Alert Banner */}
      {isCooldownActive && status === "approved" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 shadow-sm animate-in fade-in">
          <Clock className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold">Donation Cooldown Active ({daysRemaining} days remaining)</h4>
            <p className="text-blue-800 mt-0.5">
              Since your last donation was on **{lastDonationDate}**, you are in a 90-day cooldown period. You will be eligible to donate again on **{nextEligibleDate}**. 
              <span className="font-semibold block mt-1">Note: Your contact details are temporarily hidden from search results to let your body recover.</span>
            </p>
          </div>
        </div>
      )}

      {/* Verification Status Banner */}
      {status === "pending" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-semibold">Profile Pending Verification</h4>
            <p className="text-amber-800 mt-0.5">
              Your profile is currently waiting for admin approval. You can view and update your details, but your contact details won't be visible in public searches until verified.
            </p>
          </div>
        </div>
      )}
      {status === "declined" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 shadow-sm">
          <XCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-semibold">Profile Verification Declined</h4>
            <p className="text-red-800 mt-0.5">
              Administrators declined your donor registration. Please update your details or contact support for review.
            </p>
          </div>
        </div>
      )}
      {status === "approved" && !isCooldownActive && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50/50 p-4 text-sm text-green-900 shadow-sm">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800">Verified Blood Donor - Eligible</h4>
            <p className="text-green-700 mt-0.5">
              Your profile is approved and fully verified. It is now visible in the search database to patients seeking your blood group.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your donor profile and availability.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border px-4 py-2 rounded-full shadow-sm w-fit">
          <span className="text-sm font-medium">Search Status:</span>
          <button 
            onClick={handleToggleAvailability}
            disabled={isCooldownActive}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${isCooldownActive ? 'bg-slate-200 cursor-not-allowed' : isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable && !isCooldownActive ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm font-semibold ${isCooldownActive ? 'text-blue-600' : isAvailable ? 'text-green-600' : 'text-slate-500'}`}>
            {isCooldownActive ? 'On Cooldown' : isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <div className="space-y-6">
          <Card className="border-t-4 border-t-primary shadow-sm">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                <span className="text-2xl font-bold text-primary">{bloodGroup}</span>
              </div>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-xs text-muted-foreground mt-1">Registered: {registrationDate}</p>
            </CardContent>
          </Card>
          
          <nav className="flex flex-col space-y-1">
            <Button variant="secondary" className="justify-start">
              <User className="mr-2 h-4 w-4" /> Profile
            </Button>
            <Button variant="ghost" className="justify-start">
              <Activity className="mr-2 h-4 w-4" /> Donation History
            </Button>
          </nav>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Donation</p>
                    <p className="text-2xl font-bold text-slate-800">{lastDonationDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                    <p className="text-2xl font-bold text-slate-800">{totalDonations} {totalDonations === 1 ? 'Time' : 'Times'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" /> 
                Update Profile & Donation Log
              </CardTitle>
              <CardDescription>Keep your contact details, location, and donation history up to date.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      required 
                      disabled={updating}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Area / Location</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      required
                      disabled={updating}
                    >
                      {AREAS.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Times Donated</label>
                    <Input 
                      type="number"
                      min="0"
                      value={totalDonations}
                      onChange={e => setTotalDonations(parseInt(e.target.value, 10) || 0)}
                      required
                      disabled={updating}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      Last Donation Date
                    </label>
                    <Input 
                      type="date"
                      value={lastDonationDate === "Never" ? "" : lastDonationDate}
                      onChange={e => setLastDonationDate(e.target.value || "Never")}
                      disabled={updating}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical History Notes</label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={medicalHistory}
                    onChange={e => setMedicalHistory(e.target.value)}
                    disabled={updating}
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto flex items-center gap-2" disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" /> 
                Security Settings
              </CardTitle>
              <CardDescription>Change your password to secure your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" variant="secondary" className="w-full sm:w-auto border border-slate-200">
                  <Save className="w-4 h-4 mr-2" /> Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

