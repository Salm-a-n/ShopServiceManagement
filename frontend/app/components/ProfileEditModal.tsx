
"use client";

import { useState } from "react";
import { X, Camera } from "lucide-react";

type Props = {
  user: any;
  apiBase: string;
  onClose: () => void;
  onUpdated?: (user: any) => void;
};

export function ProfileEditModal({ user, apiBase, onClose, onUpdated }: Props) {
  const [tab, setTab] = useState<"profile" | "photo" | "password">("profile");
  const [username, setUsername] = useState(user?.username || user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- 1. Dynamic Token Retrieval ---
  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem("worker_token") ||
      localStorage.getItem("admin_token") ||
      localStorage.getItem("user_token")
    );
  };

  const token = getAuthToken();

  // --- 2. Update Profile Info ---
  const updateProfile = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) throw new Error("Not authenticated");
      const form = new FormData();
      form.append("username", username);
      form.append("phone", phone);

      const res = await fetch(`${apiBase}/profile`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      if (onUpdated) onUpdated(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Update Photo ---
  const updatePhoto = async () => {
    if (!photo) return setError("Select a photo first");
    setLoading(true);
    setError("");
    try {
      if (!token) throw new Error("Not authenticated");
      const form = new FormData();
      form.append("profile_photo", photo);

      const res = await fetch(`${apiBase}/profile`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update photo");

      if (onUpdated) onUpdated(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 4. Change Password & Global Logout ---
  const changePassword = async () => {
    setLoading(true);
    setError("");

    try {
      if (!token) throw new Error("Not authenticated");
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const res = await fetch(`${apiBase}/profile/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      // Clear all possible session keys for security
      const keysToRemove = [
        "admin_token", "admin_user",
        "worker_token", "worker_user",
        "user_token", "user_data",
        "token", "user" // legacy keys
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));

      alert("Password changed successfully. Please login again.");
      window.location.href = "/login";

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 relative shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Edit Profile</h2>

        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-200">
          {(["profile", "photo", "password"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-center font-medium transition ${
                tab === t ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"
              }`}
            >
              {t === "profile" ? "Info" : t === "photo" ? "Photo" : "Password"}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded mb-3">{error}</p>}

        {/* Tab 1: Profile Info */}
        {tab === "profile" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button 
              onClick={updateProfile} 
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* Tab 2: Photo */}
        {tab === "photo" && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <img 
                src={photo ? URL.createObjectURL(photo) : user.profile_photo ? `http://127.0.0.1:8000/storage/${user.profile_photo}` : "/default-avatar.png"}
                className="h-32 w-32 rounded-full border-4 border-indigo-100 object-cover shadow-sm"
                alt="Profile"
              />
              <label className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 text-white shadow-md">
                <Camera size={18} />
                <input type="file" accept="image/*" hidden onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
              </label>
            </div>
            <button 
              onClick={updatePhoto} 
              disabled={loading || !photo}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading || !photo ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Uploading..." : "Update Photo"}
            </button>
          </div>
        )}

        {/* Tab 3: Password */}
        {tab === "password" && (
          <div className="space-y-3">
            <input 
              type="password" 
              placeholder="Current password" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input 
              type="password" 
              placeholder="New password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input 
              type="password" 
              placeholder="Confirm new password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              onClick={changePassword} 
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Processing..." : "Change Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}