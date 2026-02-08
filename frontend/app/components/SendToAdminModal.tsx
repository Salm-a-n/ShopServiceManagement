"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function SendToAdminModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;

  const generalTitles = ["Service Feedback", "Complaint", "Suggestion", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !message) return alert("Please fill in all fields");

    try {
      setLoading(true);
      setSuccess("");

      const res = await fetch("http://127.0.0.1:8000/api/notifications/admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ title, message }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      setSuccess(data.message || "Message sent!");
      setTitle("");
      setMessage("");

      // Close modal after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-indigo-600">Send Message to Admin</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Single input with dropdown options */}
          <input
            list="titles"
            placeholder="Select or type a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <datalist id="titles">
            {generalTitles.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>

          {/* Message */}
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows={4}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Sending..." : "Send"}
          </button>

          {success && <p className="text-green-600 mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
}
