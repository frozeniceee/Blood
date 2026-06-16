"use client";

import Link from "next/link";
import { Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center items-center">
          <Droplet className="h-10 w-10 text-primary mb-2" fill="currentColor" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form action={loginAction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none" htmlFor="password">
                    Password
                  </label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button className="w-full" type="submit">
                Sign In
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
