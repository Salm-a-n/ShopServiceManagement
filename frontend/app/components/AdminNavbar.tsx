
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileEditModal } from "@/app/components/ProfileEditModal";

export default function AdminNavbar() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // 🔹 NEW: mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("admin_user");
    const savedToken = localStorage.getItem("admin_token");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogout = async () => {
    const currentToken = localStorage.getItem("admin_token");

    if (!currentToken) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        alert("Logged out successfully");
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login";
    }
  };

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full bg-indigo-700 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>

        {/* 🔹 Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/admin/dashboard" className="hover:text-indigo-200">Dashboard</Link>
            <Link href="/admin/workers" className="hover:text-indigo-200">Workers</Link>
            <Link href="/admin/users" className="hover:text-indigo-200">Users</Link>
            <Link href="/admin/services" className="hover:text-indigo-200">Services</Link>
            <Link href="/admin/questions" className="hover:text-indigo-200">Questions</Link>
          </div>

          <div className="flex items-center gap-3 border-l border-indigo-500 pl-6">
            <button
              onClick={() => setShowProfileModal(true)}
              className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* 🔹 Mobile Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* 🔹 Mobile Menu */}
      {/* 🔹 Mobile Menu */}
{menuOpen && (
  <div className="md:hidden absolute top-full left-0 w-full bg-white text-gray-900 shadow-lg rounded-b-xl overflow-hidden">
    
    <div className="flex flex-col divide-y">
      {[
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/workers", label: "Workers" },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/services", label: "Services" },
        { href: "/admin/questions", label: "Questions" },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMenuOpen(false)}
          className="px-6 py-4 hover:bg-indigo-50 transition font-medium"
        >
          {item.label}
        </Link>
      ))}
    </div>

    {/* Actions */}
    <div className="flex gap-3 p-4 bg-gray-50 border-t">
      <button
        onClick={() => {
          setMenuOpen(false);
          setShowProfileModal(true);
        }}
        className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition"
      >
        Profile
      </button>

      <button
        onClick={handleLogout}
        className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </div>
)}


      {/* Profile Modal */}
      {showProfileModal && user && (
        <div className="text-gray-900">
          <ProfileEditModal
            user={user}
            apiBase="http://127.0.0.1:8000/api"
            onClose={() => setShowProfileModal(false)}
            onUpdated={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem("admin_user", JSON.stringify(updatedUser));
            }}
          />
        </div>
      )}
    </nav>
  );
}
