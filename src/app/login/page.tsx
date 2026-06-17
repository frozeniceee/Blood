"use client";

import { useState } from "react";
import Link from "next/link";
import { Droplet, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res.success) {
        // Redirect to dashboard using href to force header re-render
        window.location.href = "/dashboard";
      } else {
        setError(res.error || "Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center items-center">
          <Droplet className="h-10 w-10 text-primary mb-2 animate-pulse" fill="currentColor" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>

        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none" htmlFor="password">
                    Password
                  </label>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  disabled={loading}
                />
              </div>
              <Button className="w-full flex items-center justify-center gap-2" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground border-t p-6">
            <div>
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register as a Donor
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

