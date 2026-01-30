"use client";
import { useState } from "react";

export default function ManageQuestions() {
  const [questions, setQuestions] = useState([
    { id: 1, question: "Is my phone repair available?", reply: null },
    { id: 2, question: "How long for laptop service?", reply: "2 days" },
  ]);
  const [reply, setReply] = useState("");

  const handleReply = (id: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, reply } : q
      )
    );
    setReply("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">User Questions</h2>
      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q.id} className="bg-white shadow-md rounded-lg p-4">
            <p className="font-semibold">Q: {q.question}</p>
            <p className="text-sm text-gray-600">Reply: {q.reply || "Awaiting reply"}</p>
            {!q.reply && (
              <div className="mt-2 flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type reply..."
                  className="border p-2 rounded w-full"
                />
                <button
                  onClick={() => handleReply(q.id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}