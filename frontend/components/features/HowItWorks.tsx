'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, ShieldCheck, MessageCircle, Send } from 'lucide-react';

export const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- STEP 1: Search (0 to 0.3) ---
  const mapScale = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 2.5]);
  const mapX = useTransform(scrollYProgress, [0.3, 0.4], ["0%", "-30%"]);
  const mapY = useTransform(scrollYProgress, [0.3, 0.4], ["0%", "30%"]);
  
  const searchBarY = useTransform(scrollYProgress, [0, 0.1, 0.25], [-50, 0, -100]);
  const searchBarOpacity = useTransform(scrollYProgress, [0, 0.1, 0.25], [0, 1, 0]);

  const pin1Y = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [-20, 0, -50]);
  const pin1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [0, 1, 0]);

  const pin2Y = useTransform(scrollYProgress, [0.1, 0.2, 0.4], [-20, 0, 0]);
  const pin2Opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.35, 0.4], [0, 1, 1, 0]);

  // --- STEP 2: Verify (0.35 to 0.65) ---
  const cardY = useTransform(scrollYProgress, [0.35, 0.45, 0.6, 0.65], [200, 0, 0, 200]);
  const cardOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.6, 0.65], [0, 1, 1, 0]);
  
  const stampScale = useTransform(scrollYProgress, [0.45, 0.5, 0.6, 0.65], [3, 1, 1, 0]);
  const stampOpacity = useTransform(scrollYProgress, [0.45, 0.5, 0.6, 0.65], [0, 1, 1, 0]);

  // --- STEP 3: Connect (0.7 to 1.0) ---
  const chatY = useTransform(scrollYProgress, [0.65, 0.75], [100, 0]);
  const chatOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);

  const msg1Opacity = useTransform(scrollYProgress, [0.75, 0.8], [0, 1]);
  const msg1Y = useTransform(scrollYProgress, [0.75, 0.8], [20, 0]);

  const msg2Opacity = useTransform(scrollYProgress, [0.85, 0.9], [0, 1]);
  const msg2Y = useTransform(scrollYProgress, [0.85, 0.9], [20, 0]);

  return (
    <section className="py-24 bg-white" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-charcoal sm:text-5xl tracking-tight">How It Works</h2>
          <p className="mt-4 text-xl text-gray-500">A seamless experience from search to signature.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start relative min-h-[300vh]">
          
          {/* Left Side: Sticky UI Mockup */}
          <div className="lg:sticky top-32 w-full lg:w-1/2 h-[500px] lg:h-[650px] bg-gray-50 rounded-[3rem] border-[8px] border-gray-100 shadow-2xl overflow-hidden relative flex items-center justify-center">
            
            {/* The Map Background (zooms and pans) */}
            <motion.div 
              className="absolute inset-0 bg-[#E8EAE6]"
              style={{
                scale: mapScale, 
                x: mapX, 
                y: mapY,
                backgroundImage: 'radial-gradient(#CBD5E1 2px, transparent 2px)',
                backgroundSize: '30px 30px'
              }}
            >
              {/* Fake Map Elements for realism */}
              <div className="absolute top-[20%] left-[10%] w-[40%] h-[30%] bg-olive-muted/10 rounded-3xl -rotate-12 border border-olive-DEFAULT/10"></div>
              <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[40%] bg-blue-500/5 rounded-[40px] rotate-6 border border-blue-500/10"></div>
              <div className="absolute top-[50%] left-[30%] w-[60%] h-[20px] bg-white/60 -rotate-12 shadow-sm rounded-full"></div>
              <div className="absolute top-[30%] right-[30%] w-[100px] h-[100px] bg-green-500/10 rounded-full blur-md"></div>
            </motion.div>

            {/* STEP 1 UI: Search Bar & Pins */}
            <motion.div style={{ y: searchBarY, opacity: searchBarOpacity }} className="absolute top-8 left-8 right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-10">
              <Search className="text-gray-400 h-6 w-6" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-full"></div>
            </motion.div>

            <motion.div style={{ y: pin1Y, opacity: pin1Opacity }} className="absolute top-1/4 left-1/4 z-10 flex flex-col items-center">
              <div className="bg-white px-3 py-1 rounded-full shadow-lg font-bold text-sm mb-1 text-charcoal">₦150k</div>
              <MapPin className="text-gray-400 h-8 w-8 fill-white" />
            </motion.div>

            <motion.div style={{ y: pin2Y, opacity: pin2Opacity }} className="absolute top-1/2 right-1/4 z-10 flex flex-col items-center">
              <div className="bg-olive-DEFAULT px-3 py-1 rounded-full shadow-lg font-bold text-sm mb-1 text-white scale-110">₦250k</div>
              <MapPin className="text-olive-DEFAULT h-10 w-10 fill-white" />
            </motion.div>

            {/* STEP 2 UI: Property Card & Verified Stamp */}
            <motion.div style={{ y: cardY, opacity: cardOpacity }} className="absolute bottom-12 left-8 right-8 bg-white rounded-3xl shadow-2xl p-4 z-20">
              <div className="w-full h-40 bg-gray-200 rounded-2xl mb-4 overflow-hidden relative">
                <img src="/mock-prop-1.jpg" alt="Property" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-charcoal">Featured</div>
              </div>
              <h4 className="font-extrabold text-charcoal text-lg mb-1">Luxury 2-Bed Apartment</h4>
              <p className="text-gray-500 text-sm mb-4">Lekki Phase 1, Lagos</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="text-olive-DEFAULT font-black">₦2.5m <span className="text-gray-400 text-xs font-normal">/ year</span></div>
                <div className="h-10 w-10 bg-charcoal rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">JD</div>
              </div>

              {/* The Stamp */}
              <motion.div style={{ scale: stampScale, opacity: stampOpacity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-olive-DEFAULT text-olive-DEFAULT px-6 py-2 rounded-xl backdrop-blur-sm bg-white/90 flex items-center gap-2 shadow-2xl">
                <ShieldCheck className="h-8 w-8" />
                <span className="text-2xl font-black tracking-widest uppercase">Verified</span>
              </motion.div>
            </motion.div>

            {/* STEP 3 UI: Chat Interface */}
            <motion.div style={{ y: chatY, opacity: chatOpacity }} className="absolute inset-0 bg-white z-30 flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-charcoal text-white">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-olive-DEFAULT shadow-lg flex-shrink-0">
                  <img src="/mock-prop-2.jpg" alt="Landlord Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">John Doe (Landlord)</h4>
                  <p className="text-xs text-olive-muted">Online</p>
                </div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col gap-6 bg-gray-50">
                <motion.div style={{ y: msg1Y, opacity: msg1Opacity }} className="self-end bg-olive-DEFAULT text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                  Hi John! I love the apartment. Is it still available for viewing tomorrow?
                </motion.div>
                
                <motion.div style={{ y: msg2Y, opacity: msg2Opacity }} className="self-start bg-white border border-gray-100 text-charcoal px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                  Yes it is! I'll be around from 10 AM to 2 PM. Let's lock it in.
                </motion.div>
              </div>

              <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-12 flex items-center px-4 text-gray-400 text-sm">
                  Type a message...
                </div>
                <div className="h-12 w-12 bg-olive-DEFAULT rounded-full flex items-center justify-center text-white shadow-md cursor-pointer hover:bg-olive-deep transition-colors">
                  <Send className="h-5 w-5 ml-1" />
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Side: Scrolling Content Steps */}
          <div className="w-full lg:w-1/2 space-y-[80vh] py-[30vh]">
            
            <div className="h-[40vh] flex flex-col justify-center">
              <span className="text-sm font-bold text-olive-DEFAULT tracking-widest uppercase mb-2">Step 1</span>
              <h3 className="text-4xl font-extrabold text-charcoal mb-4 leading-tight">Search without the noise.</h3>
              <p className="text-xl text-gray-500 leading-relaxed">
                Use our interactive map to pinpoint exactly where you want to live. Filter by room shares or full apartments, and instantly see transparent pricing.
              </p>
            </div>

            <div className="h-[40vh] flex flex-col justify-center">
              <span className="text-sm font-bold text-olive-DEFAULT tracking-widest uppercase mb-2">Step 2</span>
              <h3 className="text-4xl font-extrabold text-charcoal mb-4 leading-tight">Trust what you see.</h3>
              <p className="text-xl text-gray-500 leading-relaxed">
                Every landlord passes a strict KYC check, and every property is verified. When you see the green stamp, you know it's 100% legitimate. Zero scams.
              </p>
            </div>

            <div className="h-[40vh] flex flex-col justify-center pb-[20vh]">
              <span className="text-sm font-bold text-olive-DEFAULT tracking-widest uppercase mb-2">Step 3</span>
              <h3 className="text-4xl font-extrabold text-charcoal mb-4 leading-tight">Connect and close.</h3>
              <p className="text-xl text-gray-500 leading-relaxed">
                Skip the middleman entirely. Verify your phone number to securely chat with the landlord directly on our platform. Schedule viewings and sign leases directly.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

