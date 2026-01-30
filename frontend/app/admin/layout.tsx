"use client";
import AdminNavbar from "@/app/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="pt-28 px-6">{children}</main>
    </div>
  );
}