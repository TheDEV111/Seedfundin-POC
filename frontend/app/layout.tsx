import type { Metadata } from "next";
import { Outfit } from 'next/font/google';
import "./globals.css";
import { Header } from "@/components/features/Header";
import { Footer } from "@/components/features/Footer";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "Seedfundin | Room & Apartment Rental Marketplace",
  description: "Find verified room shares and full apartments for rent. Connect directly with landlords with zero broker markup.",
};

import { CSPostHogProvider } from './providers';

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} min-h-screen flex flex-col bg-white text-[#2B2B26] antialiased`}>
        <CSPostHogProvider>
          <ReduxProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster 
              position="top-center" 
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#2B2B26',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: 500,
                },
                success: {
                  iconTheme: {
                    primary: '#6B7A3A',
                    secondary: '#fff',
                  },
                },
              }} 
            />
          </ReduxProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
