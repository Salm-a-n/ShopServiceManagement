"use client";
import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-indigo-700 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="flex gap-6">
          <Link href="/admin/dashboard" className="hover:text-gray-200">Dashboard</Link>
          <Link href="/admin/workers" className="hover:text-gray-200">Workers</Link>
          <Link href="/admin/users" className="hover:text-gray-200">Users</Link>
          <Link href="/admin/services" className="hover:text-gray-200">Services</Link>
          <Link href="/admin/questions" className="hover:text-gray-200">Questions</Link>
          <Link href="/admin/works" className="hover:text-gray-200">Works</Link>
        </div>
      </div>
    </nav>
  );
}