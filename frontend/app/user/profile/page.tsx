"use client";
import { useState } from "react";

export default function Profile() {
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const username = "Salman"; // dynamic username

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 pt-20 flex justify-center px-4">
      {/* Profile Card */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/default-avatar.png"
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-indigo-200 shadow-md"
          />
          <button
            onClick={() => setShowPhotoModal(true)}
            className="mt-3 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit Photo
          </button>
        </div>

        {/* Dynamic Header */}
        <h2 className="text-2xl font-bold mb-6 text-indigo-600 text-center">
          Welcome {username}
        </h2>

        {/* Profile Info */}
        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
            <input
              className="w-full p-2 border rounded-lg bg-gray-50 text-gray-800"
              defaultValue={username}
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
            <input
              className="w-full p-2 border rounded-lg bg-gray-50 text-gray-800"
              defaultValue="+91 98765 43210"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg bg-gray-50"
              value="********"
              disabled
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowUsernameModal(true)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Change Username
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-indigo-600 mb-4">Change Username</h3>
            <input
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter new username"
            />
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
              Save
            </button>
            <button
              onClick={() => setShowUsernameModal(false)}
              className="w-full mt-2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-indigo-600 mb-4">Change Password</h3>
            <div className="space-y-3">
              <input type="password" className="w-full p-2 border rounded-lg" placeholder="Old Password" />
              <input type="password" className="w-full p-2 border rounded-lg" placeholder="New Password" />
              <input type="password" className="w-full p-2 border rounded-lg" placeholder="Confirm New Password" />
            </div>
            <button className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
              Save
            </button>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="w-full mt-2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Profile Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-indigo-600 mb-4">Change Profile Photo</h3>
            <input type="file" className="w-full p-2 border rounded-lg mb-3" />
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
              Upload
            </button>
            <button
              onClick={() => setShowPhotoModal(false)}
              className="w-full mt-2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}