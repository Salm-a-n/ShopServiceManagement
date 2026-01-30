"use client";
import Link from "next/link";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6">
      {/* Hero Section */}
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
        Welcome to Service Shop
      </h1>
      <p className="text-lg max-w-2xl mb-10 leading-relaxed">
        Got a phone or laptop in repair? 📱💻  
        Track your service progress in real time, see updates from the shop, and
        manage your profile easily. No more waiting in the dark — stay informed
        every step of the way.
      </p>

      {/* Buttons */}
      <div className="flex gap-6">
        <Link href="/login">
          <button className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg shadow hover:bg-gray-100 transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-yellow-400 text-blue-900 font-semibold px-8 py-3 rounded-lg shadow hover:bg-yellow-300 transition">
            Register
          </button>
        </Link>
      </div>

      {/* Extra Info */}
      <div className="mt-12 max-w-xl text-sm text-gray-100">
        <p>
          ✨ Users can: submit complaints, upload photos, track repair status, and
          give feedback.  
        </p>
        <p>
          🔒 Secure login keeps your data safe, and you can update your profile anytime.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;