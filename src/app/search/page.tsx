"use client";

import { useState } from "react";
import { Search, MapPin, Droplet, Phone, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

// Mock data until Supabase is connected
const MOCK_DONORS = [
  { id: "1", name: "Ahmed Khan", bloodGroup: "O+", area: "Barishal Sadar", phone: "01711000000", lastDonation: "2025-12-01", available: true, age: 28, medicalHistory: "None" },
  { id: "2", name: "Sara Islam", bloodGroup: "A+", area: "Agailjhara", phone: "01811000000", lastDonation: "2026-01-15", available: true, age: 24, medicalHistory: "Mild asthma" },
  { id: "3", name: "Rahim Uddin", bloodGroup: "B+", area: "Babuganj", phone: "01911000000", lastDonation: "2026-03-10", available: false, age: 35, medicalHistory: "None" },
  { id: "4", name: "Fatema Begum", bloodGroup: "O-", area: "Bakerganj", phone: "01511000000", lastDonation: "2025-10-20", available: true, age: 29, medicalHistory: "None" },
  { id: "5", name: "Kamal Hossain", bloodGroup: "AB+", area: "Gournadi", phone: "01611000000", lastDonation: "2026-04-05", available: true, age: 41, medicalHistory: "High blood pressure managed with meds" },
  { id: "6", name: "Jashim Uddin", bloodGroup: "A-", area: "Muladi", phone: "01722000000", lastDonation: "2026-02-14", available: true, age: 31, medicalHistory: "None" },
  { id: "7", name: "Nusrat Jahan", bloodGroup: "B-", area: "Wazirpur", phone: "01822000000", lastDonation: "2025-11-20", available: false, age: 26, medicalHistory: "None" },
  { id: "8", name: "Tariqul Islam", bloodGroup: "O+", area: "Barishal Sadar", phone: "01922000000", lastDonation: "2026-05-10", available: true, age: 22, medicalHistory: "None" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SearchPage() {
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [area, setArea] = useState<string>("");
  
  const filteredDonors = MOCK_DONORS.filter(donor => {
    if (bloodGroup && donor.bloodGroup !== bloodGroup) return false;
    if (area && !donor.area.toLowerCase().includes(area.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Find Blood Donors</h1>
        <p className="text-muted-foreground max-w-2xl">
          Search for available blood donors in your area. Please only contact donors in case of a genuine emergency.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters */}
        <Card className="lg:col-span-1 h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Filters
            </CardTitle>
            <CardDescription>Narrow down your search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Group</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg}
                    onClick={() => setBloodGroup(bloodGroup === bg ? "" : bg)}
                    className={`h-10 rounded-md border text-sm font-medium transition-colors ${
                      bloodGroup === bg 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Area / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background py-2 pr-3 pl-9 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  <option value="">All Barishal Areas</option>
                  <option value="Barishal Sadar">Barishal Sadar</option>
                  <option value="Agailjhara">Agailjhara</option>
                  <option value="Babuganj">Babuganj</option>
                  <option value="Bakerganj">Bakerganj</option>
                  <option value="Banaripara">Banaripara</option>
                  <option value="Gournadi">Gournadi</option>
                  <option value="Hizla">Hizla</option>
                  <option value="Mehendiganj">Mehendiganj</option>
                  <option value="Muladi">Muladi</option>
                  <option value="Wazirpur">Wazirpur</option>
                </select>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => { setBloodGroup(""); setArea(""); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {filteredDonors.length} {filteredDonors.length === 1 ? 'Donor' : 'Donors'} Found
            </h2>
          </div>

          {filteredDonors.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredDonors.map(donor => (
                <Card key={donor.id} className={`overflow-hidden transition-all hover:shadow-md ${!donor.available ? 'opacity-60' : ''}`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{donor.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="mr-1 h-3 w-3" />
                          {donor.area}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-full h-12 w-12 font-bold text-lg">
                        {donor.bloodGroup}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-6">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Last Donated: {donor.lastDonation}</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${donor.available ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>{donor.available ? 'Available to donate' : 'Currently unavailable'}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      disabled={!donor.available}
                      onClick={() => window.location.href = `tel:${donor.phone}`}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      {donor.available ? 'Call Donor' : 'Unavailable'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center flex flex-col items-center">
              <Droplet className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold mb-2">No donors found</h3>
              <p className="text-muted-foreground">
                We couldn't find any donors matching your criteria. Try adjusting your filters or area.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
