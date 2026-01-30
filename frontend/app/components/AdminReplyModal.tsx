"use client";
import { useState } from "react";

export default function AdminReplyModal({
  item,
  onClose,
  onReply,
}: {
  item: { id: number; question: string; reply: string | null };
  onClose: () => void;
  onReply: (id: number, reply: string) => void;
}) {
  const [reply, setReply] = useState("");

  if (!item) return null;

  const handleSubmit = () => {
    if (!reply.trim()) return;
    onReply(item.id, reply);
    setReply("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold text-indigo-600">Reply to User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">✕</button>
        </div>

        {/* Question */}
        <p className="text-sm text-gray-700 mb-4">
          <span className="font-semibold">User asked:</span> {item.question}
        </p>

        {/* Reply Form */}
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply..."
          rows={4}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Send Reply
        </button>
      </div>
    </div>
  );
}