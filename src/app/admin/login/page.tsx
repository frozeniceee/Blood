"use client";

import { useSearchParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { adminLoginAction } from "@/app/actions/auth";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error");

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

        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <form action={adminLoginAction} className="space-y-4">
              {hasError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center font-medium">
                  Invalid username or password
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
                />
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" type="submit">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
