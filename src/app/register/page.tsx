"use client";

import Link from "next/link";
import { Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { loginAction } from "@/app/actions/auth";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const AREAS = ["Barishal", "Patuakhali", "Jhalokati", "Rajapur", "Bhola", "Pirojpur", "Barguna", "Kuakata", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gournadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"];

export default function RegisterPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      age: formData.get("age"),
      bloodGroup: formData.get("bloodGroup"),
      phone: formData.get("phone"),
      area: formData.get("area"),
      medicalHistory: formData.get("medicalHistory"),
      email: formData.get("email")
    };
    localStorage.setItem("mock_user", JSON.stringify(user));
    await loginAction();
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center items-center">
          <Droplet className="h-10 w-10 text-primary mb-2" fill="currentColor" />
          <h1 className="text-2xl font-semibold tracking-tight">Become a Donor</h1>
          <p className="text-sm text-muted-foreground">
            Register to join our community and save lives
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input name="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input name="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age</label>
                  <Input name="age" type="number" min="18" max="65" placeholder="e.g. 25" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <select name="bloodGroup" required defaultValue="" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                  <Input name="phone" type="tel" placeholder="01711000000" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Area / Location</label>
                  <select name="area" required defaultValue="" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  placeholder="Mention any skin diseases, diabetes, or other medical conditions..." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" placeholder="john@example.com" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" required />
              </div>

              <Button className="w-full mt-6" type="submit">
                Create Account
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
