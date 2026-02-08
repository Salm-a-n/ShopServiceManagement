"use client";
import WorkerNavbar from "@/app/components/WorkerNavbar";
import Footer from "@/app/components/Footer";

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <WorkerNavbar />
      <main className="flex-grow pt-28 px-6">{children}</main>
      <Footer />
    </div>
  );
}