'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Is SingleRent entirely free for tenants?",
    answer: "Yes! Tenants can search, filter, and contact landlords completely free of charge. We don't charge any broker fees or hidden commissions."
  },
  {
    question: "How do I know the listings are legitimate?",
    answer: "Every landlord must verify their phone number and identity before their listing goes live. We also have manual moderation and a community reporting system to ensure 100% safe listings."
  },
  {
    question: "Can I list just a single room?",
    answer: "Absolutely. We differentiate clearly between Room Shares and Full Apartments. You can list a single room in a shared flat and specify the number of housemates."
  },
  {
    question: "What happens when I contact a landlord?",
    answer: "Once you verify your own phone number, we reveal the landlord's contact info and provide a seamless WhatsApp link to start the conversation directly."
  },
  {
    question: "Are there any hidden agency fees?",
    answer: "No. Our core promise is zero broker fees. You only pay your rent directly to the landlord."
  },
  {
    question: "How long does it take to list a property?",
    answer: "Under 5 minutes. You just need 3 quality photos, basic details, and OTP verification to get your listing live instantly."
  },
  {
    question: "Do you handle rent payments?",
    answer: "Not currently. For this initial version, our focus is strictly on matching you safely and quickly. Rent payments and leases are handled directly between the tenant and landlord."
  },
  {
    question: "How much does it cost to list a property?",
    answer: "Your first listings are completely free during our trial period! In the future, landlords will pay a small flat subscription for active listings, never a commission."
  },
  {
    question: "Can I filter for self-contained apartments?",
    answer: "Yes, our search allows you to specifically filter for fully self-contained apartments versus shared rooms, along with bedroom and bathroom counts."
  },
  {
    question: "What if an apartment is already rented out?",
    answer: "Landlords are required to remove or pause their listings once filled. We also monitor listing age and engagement to prune stale properties, keeping our marketplace fresh."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#F7F7F2]">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-charcoal sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-500">Everything you need to know about renting and listing on SingleRent.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div 
                key={index}
                initial={false}
                animate={{ backgroundColor: isOpen ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.5)" }}
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-lg text-charcoal">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0 ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-olive-DEFAULT/10 text-olive-deep"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
