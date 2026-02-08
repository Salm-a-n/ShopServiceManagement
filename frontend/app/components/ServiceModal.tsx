
"use client";

import { useEffect, useMemo, useState } from "react";

export default function ServiceModal({
  service,
  onClose,
}: {
  service: any;
  onClose: () => void;
}) {
  const [currentService, setCurrentService] = useState<any>(service);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;

  useEffect(() => {
    setCurrentService(service);
  }, [service]);

  const messages = useMemo(() => {
    if (!currentService) return [];
    const userMsgs = currentService.user_questions?.map((q: any) => ({
      sender: "user", text: q.message, time: q.time,
    })) || [];
    const workerMsgs = currentService.worker_answers?.map((a: any) => ({
      sender: "worker", text: a.message, time: a.time,
    })) || [];

    return [...userMsgs, ...workerMsgs].sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }, [currentService]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      setSending(true);
      const res = await fetch(`http://127.0.0.1:8000/api/works/${service.id}/question`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to send message");
        return;
      }

      setMessage("");
      alert("Question sent successfully!");
      onClose(); // This triggers the refresh in the parent page
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (!currentService) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-start bg-white">
          <div>
            <h2 className="text-2xl font-bold text-indigo-600">{currentService.complaint}</h2>
            <p className="text-gray-600">{currentService.brand} • {currentService.model}</p>
            <p className="text-sm mt-1">Status: <span className="font-bold text-indigo-500">{currentService.status}</span></p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">✕</button>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b text-sm bg-gray-50">
          <p><b>Expected Delivery:</b> {currentService.expected_delivery ?? "—"}</p>
          <p><b>Price:</b> {currentService.price ? `₹${currentService.price}` : "Not updated"}</p>
          <p>
            <b>Worker:</b>{" "}
            <span className={currentService.worker ? "text-indigo-600 font-medium" : "text-gray-500"}>
              {currentService.worker 
      ? (currentService.worker.username || currentService.worker.name || "Assigned") 
      : "Not assigned"}
            </span>
          </p>
          <p><b>Created At:</b> {new Date(currentService.created_at).toLocaleString()}</p>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 italic mt-10 text-sm">No messages yet. Ask the worker a question.</p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${m.sender === "user" ? "ml-auto bg-indigo-600 text-white rounded-tr-none" : "bg-white border text-gray-800 rounded-tl-none"}`}>
                {m.text}
                <div className="text-[10px] mt-1 opacity-70">{new Date(m.time).toLocaleTimeString()}</div>
              </div>
            ))
          )}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t flex gap-2 bg-white">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Type your question..."
          />
          <button onClick={sendMessage} disabled={sending || !message.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-semibold transition disabled:opacity-50">
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}