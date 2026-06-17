"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ShieldAlert, UserCheck, Clock, Eye, Users, Plus, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  approveDonorAction, 
  declineDonorAction, 
  addAdminAction 
} from "@/app/actions/auth";
import { 
  adminGetRegistrationsAction, 
  adminGetAdminsAction 
} from "@/app/actions/donors";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("registrations");
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null);
  
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const regs = await adminGetRegistrationsAction();
      setRegistrations(regs);
      const admList = await adminGetAdminsAction();
      setAdmins(admList);
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await approveDonorAction(id);
      if (res.success) {
        setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: "approved" } : reg));
        setSelectedDonor(null);
      } else {
        alert("Failed to approve donor");
      }
    } catch (e) {
      alert("Error approving donor");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const res = await declineDonorAction(id);
      if (res.success) {
        setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: "declined" } : reg));
        setSelectedDonor(null);
      } else {
        alert("Failed to decline donor");
      }
    } catch (e) {
      alert("Error declining donor");
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminUsername && newAdminPassword) {
      const formData = new FormData();
      formData.append("username", newAdminUsername);
      formData.append("password", newAdminPassword);
      try {
        const res = await addAdminAction(formData);
        if (res.success) {
          alert("New Admin created successfully!");
          setNewAdminUsername("");
          setNewAdminPassword("");
          const admList = await adminGetAdminsAction();
          setAdmins(admList);
        } else {
          alert(res.error || "Failed to create admin");
        }
      } catch (err) {
        alert("Error creating admin");
      }
    }
  };

  const pendingCount = registrations.filter(r => r.status === "pending").length;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 relative">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-amber-500 animate-bounce" />
            Admin Command Center
          </h1>
          <p className="text-muted-foreground mt-1">Manage donors, verify requests, and control platform access.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border px-4 py-2 rounded-full shadow-sm">
          <Clock className="h-4 w-4 text-amber-500" />
          <span className="font-semibold text-amber-600">{loading ? "..." : pendingCount} Pending</span>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === "registrations" ? "border-b-2 border-amber-600 text-amber-700" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("registrations")}
        >
          <UserCheck className="inline w-4 h-4 mr-2" />
          Donor Registrations
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === "admins" ? "border-b-2 border-amber-600 text-amber-700" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("admins")}
        >
          <Users className="inline w-4 h-4 mr-2" />
          Manage Admins
        </button>
      </div>

      {activeTab === "registrations" && (
        <Card className="border-t-4 border-t-amber-500 shadow-sm animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle>Review Registrations</CardTitle>
            <CardDescription>View detailed medical information and approve new donors for the public list.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Loading donor registrations...</p>
              </div>
            ) : registrations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-md">Name</th>
                      <th className="px-4 py-3 font-medium">Age</th>
                      <th className="px-4 py-3 font-medium">Blood Group</th>
                      <th className="px-4 py-3 font-medium">Area</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right rounded-tr-md">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {registrations.map(reg => (
                      <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium">{reg.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{reg.age}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-bold rounded px-2 py-1 text-xs">
                            {reg.bloodGroup}
                          </span>
                        </td>
                        <td className="px-4 py-3">{reg.area}</td>
                        <td className="px-4 py-3">
                          {reg.status === "pending" && (
                            <span className="inline-flex items-center text-amber-600 bg-amber-100 px-2 py-1 rounded-full text-xs font-medium">
                              Pending
                            </span>
                          )}
                          {reg.status === "approved" && (
                            <span className="inline-flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                              Approved
                            </span>
                          )}
                          {reg.status === "declined" && (
                            <span className="inline-flex items-center text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
                              Declined
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8"
                            onClick={() => setSelectedDonor(reg)}
                          >
                            <Eye className="mr-1 h-3 w-3" /> View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No donor registrations found.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "admins" && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <Card className="border-t-4 border-t-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle>Current Administrators</CardTitle>
              <CardDescription>People with access to approve donors.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-slate-800 animate-spin mb-4" />
                  <p className="text-muted-foreground font-medium">Loading administrators...</p>
                </div>
              ) : admins.length > 0 ? (
                <ul className="divide-y">
                  {admins.map(admin => (
                    <li key={admin.id} className="py-3 flex justify-between items-center animate-in fade-in">
                      <div>
                        <p className="font-medium text-slate-900">{admin.username}</p>
                        <p className="text-xs text-muted-foreground">Added: {admin.createdDate}</p>
                      </div>
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">Admin</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No administrators configured.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Add New Admin</CardTitle>
              <CardDescription>Create a new administrator account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input 
                    value={newAdminUsername} 
                    onChange={e => setNewAdminUsername(e.target.value)} 
                    placeholder="e.g. admin3" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temporary Password</label>
                  <Input 
                    type="password"
                    value={newAdminPassword} 
                    onChange={e => setNewAdminPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-850 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Admin
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
              <div>
                <CardTitle className="text-xl">{selectedDonor.name}</CardTitle>
                <CardDescription>Registered on {selectedDonor.date}</CardDescription>
              </div>
              <button onClick={() => setSelectedDonor(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Blood Group</p>
                  <p className="font-bold text-primary text-lg">{selectedDonor.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Age</p>
                  <p className="font-medium text-lg">{selectedDonor.age} Years</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Phone Number</p>
                  <p className="font-medium">{selectedDonor.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Location</p>
                  <p className="font-medium">{selectedDonor.area}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Medical History & Notes</p>
                <div className="bg-amber-50 border border-amber-100 text-amber-900 p-3 rounded-md text-sm">
                  {selectedDonor.medicalHistory || "No medical issues reported."}
                </div>
              </div>

              {selectedDonor.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t mt-4">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-colors" 
                    onClick={() => handleApprove(selectedDonor.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve Donor
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1 transition-colors"
                    onClick={() => handleDecline(selectedDonor.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Decline
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
