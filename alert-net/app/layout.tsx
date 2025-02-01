import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import type { Metadata } from "next";
import type React from "react"; // Added import for React

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlertNet - Community-Driven Incident Reporting",
  description: "A crowd-powered, AI-driven crime and incident reporting platform for MENA region",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className={jakarta.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
