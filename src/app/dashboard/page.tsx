"use client";

import { useState, useEffect } from "react";
import { User, Activity, Settings, Calendar, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AREAS = ["Barishal", "Patuakhali", "Jhalokati", "Rajapur", "Bhola", "Pirojpur", "Barguna", "Kuakata", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gournadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"];

export default function DashboardPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Profile Forms State
  const [name, setName] = useState("Loading...");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Barishal");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Load mock user from local storage
    const saved = localStorage.getItem("mock_user");
    if (saved) {
      const user = JSON.parse(saved);
      setName(`${user.firstName || "New"} ${user.lastName || "User"}`);
      if (user.bloodGroup) setBloodGroup(user.bloodGroup);
      if (user.phone) setPhone(user.phone);
      if (user.area) setArea(user.area);
      if (user.medicalHistory) setMedicalHistory(user.medicalHistory);
    } else {
      setName("Ahmed Khan (Default)");
      setPhone("01711000000");
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = localStorage.getItem("mock_user");
    if (saved) {
      const user = JSON.parse(saved);
      user.phone = phone;
      user.area = area;
      user.medicalHistory = medicalHistory;
      localStorage.setItem("mock_user", JSON.stringify(user));
    }
    alert("Profile information updated successfully!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword && newPassword) {
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your donor profile and availability.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border px-4 py-2 rounded-full shadow-sm">
          <span className="text-sm font-medium">Status:</span>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm font-semibold ${isAvailable ? 'text-green-600' : 'text-slate-500'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <div className="space-y-6">
          <Card className="border-t-4 border-t-primary">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                <span className="text-2xl font-bold text-primary">{bloodGroup}</span>
              </div>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground">Blood Donor</p>
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
                    <p className="text-2xl font-bold">Never</p>
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
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" /> 
                Update Profile Information
              </CardTitle>
              <CardDescription>Keep your contact details and location up to date.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Area / Location</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      required
                    >
                      {AREAS.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical History Notes</label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={medicalHistory}
                    onChange={e => setMedicalHistory(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" /> 
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
