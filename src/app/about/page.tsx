"use client";

import { Droplet, Info, ShieldAlert, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">About BloodConnect</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We are a community-driven initiative aiming to bridge the gap between blood donors and those in critical need.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Heart className="h-5 w-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            To ensure nobody has to struggle to find blood during emergencies. By creating a localized, real-time database of donors, we make the process transparent and fast.
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Droplet className="h-5 w-5" />
              Zero Cost
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            BloodConnect is and will always be completely free. We do not charge donors or recipients. Blood donation is a noble cause, not a business.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ShieldAlert className="h-5 w-5" />
              Privacy First
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            Your data is securely stored. Donors can toggle their availability on and off, ensuring they are only contacted when they are ready and able to donate.
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/5 rounded-2xl p-8 md:p-12 border border-primary/10">
        <h2 className="text-2xl font-bold mb-4">Guidelines for Donors</h2>
        <ul className="space-y-3 text-muted-foreground list-disc pl-5">
          <li>You must be in good health and feeling well on the day of donation.</li>
          <li>Wait at least 3-4 months between whole blood donations.</li>
          <li>Ensure you are well-hydrated and have eaten a healthy meal before donating.</li>
          <li>Avoid donating if you have recently traveled to malaria-endemic regions or have had a recent tattoo/piercing (within 6 months).</li>
          <li>Update your availability status on your dashboard if you are temporarily unable to donate.</li>
        </ul>
      </div>
    </div>
  );
}
