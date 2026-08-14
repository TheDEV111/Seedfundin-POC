import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, Key, Search, ShieldCheck } from "lucide-react";
import { FAQ } from "@/components/features/FAQ";
import { HowItWorks } from "@/components/features/HowItWorks";
import { HeroSearchBar } from "@/components/features/HeroSearchBar";
import { FreeTrialBanner } from "@/components/features/FreeTrialBanner";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden py-24 sm:py-32 px-6 lg:px-8">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 -z-10 bg-white"></div>
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-olive-muted/20 blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -right-32 h-[30rem] w-[30rem] rounded-full bg-olive-DEFAULT/10 blur-3xl opacity-60"></div>

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
          
          {/* Left Text Column */}
          <div className="flex flex-col items-start text-left animate-fade-in-up">
            <div className="mb-6 inline-flex items-center rounded-full border border-olive-DEFAULT/30 bg-olive-DEFAULT/5 px-4 py-1.5 text-sm font-semibold text-olive-deep backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-olive-DEFAULT mr-2"></span>
              Zero Broker Fees. 100% Direct Connections.
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-charcoal mb-6 leading-[1.1]">
              Find Your Next Home. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-olive-deep to-olive-muted">
                Without the Hassle.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl leading-8 text-gray-600 max-w-xl mb-10">
              SingleRent is the first marketplace connecting tenants directly with landlords. 
              Skip the agents and save your money on room shares and full apartments.
            </p>

            {/* Floating Search Bar Component */}
            <HeroSearchBar />
            
            <div className="mt-8 flex items-center gap-4 text-sm font-medium text-gray-500">
              <p>Are you a property owner?</p>
              <Link href="/signup?role=host" className="text-olive-deep hover:text-olive-DEFAULT underline underline-offset-4 decoration-olive-DEFAULT/30 hover:decoration-olive-DEFAULT transition-all">
                List your property for free
              </Link>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="relative w-full h-[500px] lg:h-[650px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-olive-deep/20 border-8 border-white/50 backdrop-blur-sm animate-fade-in-up" style={{animationDelay: "0.2s"}}>
            <Image
              src="/hero-image.jpg"
              alt="Modern apartment interior with olive green accents"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            
            {/* Floating Glassmorphic Badges */}
            <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-olive-DEFAULT/20 text-olive-deep">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verified</p>
                <p className="text-sm font-bold text-charcoal">100% Safe Listings</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-charcoal sm:text-4xl">Featured Listings</h2>
              <p className="mt-4 text-lg text-gray-500">Discover hand-picked rooms and apartments available today.</p>
            </div>
            <Link href="/search" className="hidden sm:inline-flex items-center font-semibold text-olive-DEFAULT hover:text-olive-deep transition-colors">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock Property Card 1 */}
            <div className="group relative bg-white rounded-[2rem] border border-gray-100 p-3 shadow-sm hover:shadow-2xl hover:shadow-olive-DEFAULT/10 transition-all duration-300">
              <div className="relative h-64 w-full overflow-hidden rounded-[1.5rem]">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-charcoal shadow-sm">
                  Apartment
                </div>
                <div className="absolute bottom-4 left-4 z-10 bg-olive-DEFAULT text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  ₦250k / yr
                </div>
                <div className="absolute inset-0 bg-gray-200">
                  <Image src="/mock-prop-1.jpg" alt="Modern 2-Bed in Yaba" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
              <div className="p-4 pt-6">
                <h3 className="text-xl font-bold text-charcoal mb-2">Modern 2-Bed in Yaba</h3>
                <p className="text-gray-500 text-sm mb-4">University Road, Yaba</p>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600 border-t border-gray-100 pt-4">
                  <span>2 Beds</span>
                  <span>•</span>
                  <span>2 Baths</span>
                  <span>•</span>
                  <span>Self Contained</span>
                </div>
              </div>
            </div>

            {/* Mock Property Card 2 */}
            <div className="group relative bg-white rounded-[2rem] border border-gray-100 p-3 shadow-sm hover:shadow-2xl hover:shadow-olive-DEFAULT/10 transition-all duration-300">
              <div className="relative h-64 w-full overflow-hidden rounded-[1.5rem]">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-charcoal shadow-sm">
                  Room Share
                </div>
                <div className="absolute bottom-4 left-4 z-10 bg-olive-DEFAULT text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  ₦120k / yr
                </div>
                <div className="absolute inset-0 bg-gray-200">
                  <Image src="/mock-prop-2.jpg" alt="Ensuite Room for Student" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
              <div className="p-4 pt-6">
                <h3 className="text-xl font-bold text-charcoal mb-2">Ensuite Room for Student</h3>
                <p className="text-gray-500 text-sm mb-4">Akoka, close to Unilag</p>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600 border-t border-gray-100 pt-4">
                  <span>1 Bed</span>
                  <span>•</span>
                  <span>Private Bath</span>
                  <span>•</span>
                  <span>3 Housemates</span>
                </div>
              </div>
            </div>

            {/* Mock Property Card 3 */}
            <div className="group relative bg-white rounded-[2rem] border border-gray-100 p-3 shadow-sm hover:shadow-2xl hover:shadow-olive-DEFAULT/10 transition-all duration-300">
              <div className="relative h-64 w-full overflow-hidden rounded-[1.5rem]">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-charcoal shadow-sm">
                  Apartment
                </div>
                <div className="absolute bottom-4 left-4 z-10 bg-olive-DEFAULT text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  ₦450k / yr
                </div>
                <div className="absolute inset-0 bg-gray-200">
                  <Image src="/mock-prop-3.jpg" alt="Spacious Mini Flat" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
              <div className="p-4 pt-6">
                <h3 className="text-xl font-bold text-charcoal mb-2">Spacious Mini Flat</h3>
                <p className="text-gray-500 text-sm mb-4">Surulere, Lagos</p>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600 border-t border-gray-100 pt-4">
                  <span>1 Bed</span>
                  <span>•</span>
                  <span>1 Bath</span>
                  <span>•</span>
                  <span>Self Contained</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/search" className="inline-flex items-center font-semibold text-olive-DEFAULT">
              View all properties <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FreeTrialBanner />

      <HowItWorks />

      {/* Value Proposition Section */}
      <section className="py-24 bg-charcoal text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            <div className="flex flex-col items-center group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-olive-DEFAULT/20 text-olive-muted mb-6 transition-transform group-hover:scale-110">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Verified Users</h3>
              <p className="text-gray-400">Every landlord and tenant is verified through strict KYC and phone validation. No scams, no fakes.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-olive-DEFAULT/20 text-olive-muted mb-6 transition-transform group-hover:scale-110">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Radius Search</h3>
              <p className="text-gray-400">Find rooms exactly where you need them. Filter by distance to your university or workplace effortlessly.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-olive-DEFAULT/20 text-olive-muted mb-6 transition-transform group-hover:scale-110">
                <Key className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Direct Messaging</h3>
              <p className="text-gray-400">Chat directly with property owners securely inside our platform. No agents intercepting your deals.</p>
            </div>

          </div>
        </div>
      </section>

      <FAQ />

    </div>
  );
}
