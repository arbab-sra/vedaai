import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

import { Home, ClipboardList, Book, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VedaAI - AI Assessment Creator",
  description: "Create AI-powered assessments effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#D9D9D9] text-gray-900 print:bg-white`}>
        <div className="flex min-h-screen max-w-md mx-auto bg-[#D9D9D9] md:bg-gray-50 md:max-w-none relative shadow-xl overflow-x-hidden print:max-w-none print:w-full print:bg-white print:shadow-none print:overflow-visible print:block">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0 bg-white print:hidden">
            <Sidebar />
          </div>
          
          <div className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden print:block print:h-auto print:overflow-visible">
            <div className="print:hidden">
              <Header />
            </div>
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-32 print:p-0 print:overflow-visible print:block">
              {children}
            </main>
            
            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-20 bg-[#1A1A1A] text-white flex justify-around items-center rounded-[32px] z-50 px-2 shadow-2xl print:hidden">
               <Link href="/" className="flex flex-col items-center justify-center opacity-50 w-16 hover:opacity-100 transition-opacity">
                 <Home className="w-6 h-6 mb-1" />
                 <span className="text-[10px]">Home</span>
               </Link>
               <Link href="/" className="flex flex-col items-center justify-center w-16">
                 <ClipboardList className="w-6 h-6 mb-1" />
                 <span className="text-[10px] font-bold">Assignments</span>
               </Link>
               <Link href="/library" className="flex flex-col items-center justify-center opacity-50 w-16 hover:opacity-100 transition-opacity">
                 <Book className="w-6 h-6 mb-1" />
                 <span className="text-[10px]">Library</span>
               </Link>
               <Link href="/toolkit" className="flex flex-col items-center justify-center opacity-50 w-16 hover:opacity-100 transition-opacity">
                 <Sparkles className="w-6 h-6 mb-1" />
                 <span className="text-[10px]">AI Toolkit</span>
               </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
