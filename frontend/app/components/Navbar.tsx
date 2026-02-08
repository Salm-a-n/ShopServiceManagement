

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileEditModal } from "@/app/components/ProfileEditModal";

export default function Navbar({ role }: { role: "user" | "admin" | "worker" }) {
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // ⚡ Client-only states
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [user_token, setToken] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("user_data");
    const savedToken = localStorage.getItem("user_token");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout
  const handleLogout = async () => {
    if (!user_token) return alert("No token found");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${user_token}`, Accept: "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message || "Logged out successfully");
      } else alert("Logout failed");

      localStorage.removeItem("user_token");
      localStorage.removeItem("user_data");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Logout request failed");
    }
  };

  const notifications = [
    "Your phone repair is complete",
    "Worker replied to your complaint",
    "Product ready for pickup",
  ];

  if (!mounted) return null; // prevent SSR errors

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${scrolled ? "bg-gray-200 shadow-lg py-3" : "bg-gradient-to-r from-gray-300 to-gray-100 py-5"} 
        px-8 flex justify-between items-center text-gray-900`}
    >
      <h1 className="text-3xl font-extrabold tracking-wide">Service Shop</h1>

      {role === "user" && (
        <div className="flex gap-4 text-sm items-center relative">
          <Link
            href="/user/services"
            className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition shadow-md font-medium"
          >
            My Services
          </Link>

          <button
            onClick={() => setShowProfileModal(true)}
            className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition shadow-md font-medium"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium shadow-md transition"
          >
            Logout
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && user && (
        <ProfileEditModal
          user={user}
          apiBase="http://127.0.0.1:8000/api"
          onClose={() => setShowProfileModal(false)}
          onUpdated={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }}
        />
      )}
    </nav>
  );
}
