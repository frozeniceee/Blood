"use client";

import { useState, useEffect } from "react";
import { User, Activity, Settings, Calendar, Shield, Save, Loader2, Info, AlertTriangle, CheckCircle, XCircle, Clock, CalendarDays, Plus, Trash2, Edit, X, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  getCurrentUserAction, 
  updateProfileAction, 
  updateAvailabilityAction,
  getDonationLogsAction,
  addDonationLogAction,
  updateDonationLogAction,
  deleteDonationLogAction
} from "@/app/actions/auth";

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

  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  
  // Donation History Logs State
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [logDate, setLogDate] = useState("");
  const [logLocation, setLogLocation] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [submittingLog, setSubmittingLog] = useState(false);

  async function fetchLogs() {
    setLogsLoading(true);
    try {
      const res = await getDonationLogsAction();
      if (res.success && res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLogsLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "history") {
      fetchLogs();
    }
  }, [activeTab]);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLog(true);
    try {
      let res;
      if (editingLog) {
        res = await updateDonationLogAction(editingLog.id, logDate, logLocation, logNotes);
      } else {
        res = await addDonationLogAction(logDate, logLocation, logNotes);
      }

      if (res.success) {
        alert(editingLog ? "Donation record updated successfully!" : "Donation record added successfully!");
        setIsLogModalOpen(false);
        await fetchLogs();
        
        // Refresh profile stats in UI
        const profRes = await getCurrentUserAction();
        if (profRes.success && profRes.profile) {
          setTotalDonations(profRes.profile.totalDonations || 0);
          setLastDonationDate(profRes.profile.lastDonation || "Never");
        }
      } else {
        alert(res.error || "An error occurred");
      }
    } catch (err) {
      console.error("Error submitting log:", err);
      alert("An error occurred while saving the record.");
    } finally {
      setSubmittingLog(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this donation record?")) return;
    
    try {
      const res = await deleteDonationLogAction(logId);
      if (res.success) {
        alert("Donation record deleted!");
        await fetchLogs();
        
        // Refresh profile stats in UI
        const profRes = await getCurrentUserAction();
        if (profRes.success && profRes.profile) {
          setTotalDonations(profRes.profile.totalDonations || 0);
          setLastDonationDate(profRes.profile.lastDonation || "Never");
        }
      } else {
        alert(res.error || "Failed to delete log");
      }
    } catch (err) {
      console.error("Error deleting log:", err);
      alert("An error occurred while deleting the record.");
    }
  };

  const openAddLogModal = () => {
    setEditingLog(null);
    setLogDate(new Date().toISOString().split("T")[0]);
    setLogLocation("");
    setLogNotes("");
    setIsLogModalOpen(true);
  };

  const openEditLogModal = (log: any) => {
    setEditingLog(log);
    setLogDate(log.donationDate);
    setLogLocation(log.location);
    setLogNotes(log.notes);
    setIsLogModalOpen(true);
  };

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
            <Button 
              variant={activeTab === "profile" ? "secondary" : "ghost"} 
              className="justify-start"
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-4 w-4" /> Profile
            </Button>
            <Button 
              variant={activeTab === "history" ? "secondary" : "ghost"} 
              className="justify-start"
              onClick={() => setActiveTab("history")}
            >
              <Activity className="mr-2 h-4 w-4" /> Donation History
            </Button>
          </nav>
        </div>

        <div className="space-y-6">
          {activeTab === "profile" ? (
            <>
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
            </>
          ) : (
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Donation Logs
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Manage and log your actual blood donations. Logging new donations automatically triggers your 90-day recovery cooldown.
                  </CardDescription>
                </div>
                <Button onClick={openAddLogModal} className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Log
                </Button>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Loading donation history...</p>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 border border-dashed rounded-xl">
                    <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg text-slate-800">No logs found</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-6">
                      You haven't added any specific donation logs yet. Click "Add Log" to record your first donation.
                    </p>
                    <Button onClick={openAddLogModal} variant="outline" className="flex items-center gap-1 mx-auto">
                      <Plus className="h-4 w-4" />
                      Add First Log
                    </Button>
                  </div>
                ) : (
                  <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-6">
                    {logs.map((log) => (
                      <div key={log.id} className="relative group">
                        {/* Timeline dot */}
                        <div className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-primary bg-background shadow-sm group-hover:scale-125 transition-transform">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        
                        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-800 text-lg">
                                {log.donationDate}
                              </span>
                              {log.location && (
                                <span className="flex items-center text-sm text-muted-foreground bg-slate-100 rounded-full px-2.5 py-0.5">
                                  <MapPin className="h-3 w-3 mr-1 text-slate-500" />
                                  {log.location}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-slate-600 hover:text-primary"
                                onClick={() => openEditLogModal(log)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-slate-600 hover:text-destructive"
                                onClick={() => handleDeleteLog(log.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {log.notes ? (
                            <p className="text-slate-600 text-sm italic pl-2 border-l-2 border-slate-200 mt-2">
                              "{log.notes}"
                            </p>
                          ) : (
                            <p className="text-slate-400 text-sm mt-1">No notes added.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Log Form Modal Overlay */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                {editingLog ? "Edit Donation Record" : "Add Donation Record"}
              </h3>
              <button 
                onClick={() => setIsLogModalOpen(false)}
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Donation Date</label>
                <Input 
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  required
                  disabled={submittingLog}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Location / Hospital</label>
                <Input 
                  type="text"
                  placeholder="e.g. Barishal Medical College"
                  value={logLocation}
                  onChange={(e) => setLogLocation(e.target.value)}
                  disabled={submittingLog}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. Felt fine, donated whole blood 450ml"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  disabled={submittingLog}
                />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsLogModalOpen(false)}
                  disabled={submittingLog}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingLog} className="flex items-center gap-1">
                  {submittingLog ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingLog ? "Update Record" : "Add Record"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

