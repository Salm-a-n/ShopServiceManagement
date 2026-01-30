"use client";
import { useState } from "react";

// Define a union type for notifications
type Notification =
  | {
      id: number;
      type: "reply";
      question: string;
      reply: string | null;
      date: string;
    }
  | {
      id: number;
      type: "alert";
      message: string;
      date: string;
    };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "reply",
      question: "Is my phone repair available?",
      reply: "Yes, your phone is ready for pickup.",
      date: "2026-01-28",
    },
    {
      id: 2,
      type: "alert",
      message: "Product ready for pickup",
      date: "2026-01-30",
    },
  ]);

  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (!question.trim()) return;

    const newNote: Notification = {
      id: notifications.length + 1,
      type: "reply",
      question,
      reply: null, // reply will be filled by admin later
      date: new Date().toISOString().split("T")[0],
    };

    // ✅ Use functional update to avoid stale state issues
    setNotifications((prev) => [newNote, ...prev]);
    setQuestion("");
  };

  return (
    <div className="pt-28 px-6 min-h-screen bg-gray-50">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-indigo-600 mb-2">Notifications</h2>
      <p className="text-gray-600 mb-6">
        Ask questions and view replies from workers/admin
      </p>

      {/* Ask Question Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ask a Question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          rows={3}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <button
          onClick={handleSubmit}
          className="mt-3 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((note) => (
            <li
              key={note.id}
              className="bg-white shadow-md rounded-lg p-4 space-y-2"
            >
              {note.type === "reply" ? (
                <>
                  <div className="text-sm text-gray-800">
                    <span className="font-semibold">You asked:</span>{" "}
                    {note.question}
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-100 p-2 rounded-md">
                    <span className="font-semibold">Reply:</span>{" "}
                    {note.reply || "Awaiting reply from worker/admin"}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-800">{note.message}</div>
              )}
              <div className="text-xs text-gray-500 text-right">{note.date}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No notifications yet</p>
      )}
    </div>
  );
}