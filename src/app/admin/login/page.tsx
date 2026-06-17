"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { adminLoginAction } from "@/app/actions/auth";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(searchParams.get("error") ? "Invalid username or password" : null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await adminLoginAction(formData);
      if (res.success) {
        window.location.href = "/admin";
      } else {
        setError(res.error || "Invalid username or password");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="border-amber-200 shadow-lg animate-in fade-in duration-300">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              name="username"
              placeholder="admin1"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              required
              disabled={loading}
            />
          </div>
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Accessing...
              </>
            ) : (
              "Access Dashboard"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center items-center">
          <ShieldAlert className="h-10 w-10 text-amber-500 mb-2" />
          <h1 className="text-2xl font-semibold tracking-tight">Admin Access</h1>
          <p className="text-sm text-muted-foreground">
            Enter your admin credentials to manage the platform.
          </p>
        </div>

        <Suspense fallback={
          <Card className="border-amber-200 animate-pulse">
            <CardContent className="pt-6 text-center text-muted-foreground">
              Loading form...
            </CardContent>
          </Card>
        }>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
