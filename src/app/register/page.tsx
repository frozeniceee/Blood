"use client";

import { useState } from "react";
import Link from "next/link";
import { Droplet, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { registerAction } from "@/app/actions/auth";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const AREAS = ["Barishal", "Patuakhali", "Jhalokati", "Rajapur", "Bhola", "Pirojpur", "Barguna", "Kuakata", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gournadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"];

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await registerAction(formData);
      if (res.success) {
        window.location.href = "/dashboard";
      } else {
        setError(res.error || "Registration failed");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center items-center">
          <Droplet className="h-10 w-10 text-primary mb-2 animate-pulse" fill="currentColor" />
          <h1 className="text-2xl font-semibold tracking-tight">Become a Donor</h1>
          <p className="text-sm text-muted-foreground">
            Register to join our community and save lives
          </p>
        </div>

        <Card className="border-t-4 border-t-primary shadow-lg animate-in fade-in duration-300">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input name="firstName" placeholder="John" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input name="lastName" placeholder="Doe" required disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age</label>
                  <Input name="age" type="number" min="18" max="65" placeholder="e.g. 25" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <select name="bloodGroup" required defaultValue="" disabled={loading} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="" disabled>Select...</option>
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input name="phone" type="tel" placeholder="01711000000" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Area / Location</label>
                  <select name="area" required defaultValue="" disabled={loading} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="" disabled>Select Area...</option>
                    {AREAS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Medical History (Optional)</label>
                <textarea 
                  name="medicalHistory"
                  disabled={loading}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  placeholder="Mention any skin diseases, diabetes, or other medical conditions..." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" placeholder="john@example.com" required disabled={loading} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" required disabled={loading} />
              </div>

              <Button className="w-full mt-6 flex items-center justify-center gap-2" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground border-t p-6">
            <div>
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Log in instead
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

