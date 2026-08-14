import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function FreeTrialBanner() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-olive-DEFAULT/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-olive-muted/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="bg-charcoal rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          
          {/* Inner decorative gradients for the dark card */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-br from-olive-DEFAULT/30 to-transparent opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            
            {/* Left Content */}
            <div className="p-10 sm:p-16 lg:p-20 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 w-fit mb-6">
                <Sparkles className="w-4 h-4 text-olive-muted" />
                <span className="text-xs font-semibold text-white tracking-wide uppercase">For Landlords</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
                List your first 3 properties for <span className="text-transparent bg-clip-text bg-gradient-to-r from-olive-muted to-olive-DEFAULT">free.</span>
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
                Experience the power of direct tenant matchmaking. No commitment, no hidden fees. Start filling your vacancies faster today.
              </p>
              
              <ul className="space-y-4 mb-10">
                {['Zero commission on your first 3 active listings', 'Direct messages from verified tenants', 'Smart dashboard to manage applications'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle2 className="w-6 h-6 text-olive-DEFAULT shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup?role=host" 
                  className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-charcoal bg-olive-DEFAULT hover:bg-olive-muted transition-colors rounded-full shadow-lg shadow-olive-DEFAULT/20 w-fit"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>

            {/* Right Visual (Abstract Representation of 3 free slots) */}
            <div className="hidden lg:flex relative h-full w-full items-center justify-center p-12 bg-black/20">
              <div className="relative w-full max-w-sm flex flex-col gap-6">
                
                {/* Slot 1 */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4 transform transition-all duration-500 hover:-translate-y-2 hover:bg-white/15">
                  <div className="w-12 h-12 rounded-xl bg-olive-DEFAULT/30 flex items-center justify-center text-white font-bold text-xl border border-olive-DEFAULT/50">1</div>
                  <div>
                    <div className="h-4 w-32 bg-white/20 rounded-full mb-2"></div>
                    <div className="h-3 w-24 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="ml-auto px-3 py-1 rounded-full bg-olive-DEFAULT text-charcoal text-xs font-bold">Free</div>
                </div>

                {/* Slot 2 */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4 transform transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 ml-8">
                  <div className="w-12 h-12 rounded-xl bg-olive-DEFAULT/30 flex items-center justify-center text-white font-bold text-xl border border-olive-DEFAULT/50">2</div>
                  <div>
                    <div className="h-4 w-32 bg-white/20 rounded-full mb-2"></div>
                    <div className="h-3 w-24 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="ml-auto px-3 py-1 rounded-full bg-olive-DEFAULT text-charcoal text-xs font-bold">Free</div>
                </div>

                {/* Slot 3 */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4 transform transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 ml-16">
                  <div className="w-12 h-12 rounded-xl bg-olive-DEFAULT/30 flex items-center justify-center text-white font-bold text-xl border border-olive-DEFAULT/50">3</div>
                  <div>
                    <div className="h-4 w-32 bg-white/20 rounded-full mb-2"></div>
                    <div className="h-3 w-24 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="ml-auto px-3 py-1 rounded-full bg-olive-DEFAULT text-charcoal text-xs font-bold">Free</div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
