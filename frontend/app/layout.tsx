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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} min-h-screen flex flex-col bg-white text-[#2B2B26] antialiased`}>
        <ReduxProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
