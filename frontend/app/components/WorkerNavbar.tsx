"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ProfileEditModal } from "./ProfileEditModal";

export default function WorkerNavbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [worker_token, setToken] = useState<string | null>(null);

  // 1. Load user and token from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("worker_user");
    const savedToken = localStorage.getItem("worker_token");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);
  }, []);

  // 2. Logout Logic (Ported from your User Navbar)
  const handleLogout = async () => {
    if (!worker_token) {
        // Even if no token, clear storage and redirect just in case
        localStorage.removeItem("worker_token");
        localStorage.removeItem("worker_user");
        window.location.href = "/login";
        return;
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${worker_token}`, 
            Accept: "application/json" 
        },
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message || "Logged out successfully");
      } else {
        console.error("Logout failed on server");
      }

      // Always clear local data and redirect
      localStorage.removeItem("worker_token");
      localStorage.removeItem("worker_user");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Logout request failed");
      // Fallback: still clear storage so the user isn't stuck
      localStorage.removeItem("worker_token");
      localStorage.removeItem("worker_user");
      window.location.href = "/login";
    }
  };

  const handleUserUpdated = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem("worker_user", JSON.stringify(updatedUser));
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-indigo-600 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/worker/dashboard" className="text-xl font-bold hover:text-gray-200">
            Worker Panel
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/worker/dashboard" className="hover:text-gray-200">Dashboard</Link>
            <Link href="/worker/works" className="hover:text-gray-200">My Works</Link>
            
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="hover:text-gray-200 cursor-pointer"
            >
              Edit Profile
            </button>

            {/* 3. Updated Logout Button */}
            <button 
              onClick={handleLogout}
              className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded-md transition text-white font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {isModalOpen && user && (
        <ProfileEditModal 
          user={user}
          apiBase="http://127.0.0.1:8000/api"
          onClose={() => setIsModalOpen(false)} 
          onUpdated={handleUserUpdated}
        />
      )}
    </>
  );
}