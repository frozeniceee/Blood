import Link from "next/link";
import { Search, HeartHandshake, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-48 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto max-w-6xl px-4 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <HeartHandshake className="mr-2 h-4 w-4" />
            Save Lives in Your Community
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl">
            Find <span className="text-primary">Blood Donors</span> near you in seconds.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
            A fast, free, and community-driven platform to connect people who need blood with those who are ready to donate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <Link 
              href="/search" 
              className="inline-flex h-12 md:h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              <Search className="mr-2 h-5 w-5" />
              Find Donors Now
            </Link>
            <Link 
              href="/register" 
              className="inline-flex h-12 md:h-14 items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 text-base font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              Register as a Donor
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">1. Search your area</h3>
              <p className="text-slate-600">Select your blood group and enter your location to find nearby donors instantly.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">2. Browse available donors</h3>
              <p className="text-slate-600">See a list of matching donors who are currently available and ready to help.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <HeartHandshake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">3. Contact them directly</h3>
              <p className="text-slate-600">Reach out using the provided contact details. No middlemen, no delays.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
