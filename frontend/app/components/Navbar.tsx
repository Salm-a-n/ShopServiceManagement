"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ role }: { role: "user" | "admin" | "worker" }) {
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Example notifications (replace with API data)
  const notifications = [
    "Your phone repair is complete",
    "Worker replied to your complaint",
    "Product ready for pickup",
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link
            href="/user/profile"
            className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition shadow-md font-medium"
          >
            Profile
          </Link>

          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition shadow-md font-medium"
          >
            🔔
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-64 p-4 z-50">
              <h3 className="text-sm font-semibold text-indigo-600 mb-2">
                Notifications
              </h3>
              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((note, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-700 bg-gray-100 p-2 rounded-md"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No notifications</p>
              )}
              <Link
                href="/user/notifications"
                onClick={() => setShowNotifications(false)} // 👈 closes dropdown
                className="block mt-3 text-sm text-indigo-600 hover:underline"
              >
                View all
              </Link>
            </div>
          )}

          <button className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium shadow-md transition">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}