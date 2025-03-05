import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { Toaster } from "sonner";
import Chatbot from "@/components/shared/chat/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IUMSS",
  description: "Intelligent University Management System for Students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
            {children}
          </main>
        </div>
        <Toaster position="top-center" />
        <Chatbot />
      </body>
    </html>
  );
}
