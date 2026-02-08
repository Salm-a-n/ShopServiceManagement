
"use client";
import { useState, useEffect, useMemo } from "react";

export type Work = {
  id: number;
  device: string;
  problem: string;
  user: string;
  user_id: number;
  phone?: string;
  charge: string;
  status: "Pending" | "In Progress" | "Completed";
  deliveryDate: string | null;
  user_questions?: { message: string; time: string }[];
  worker_answers?: { message: string; time: string }[];
};

export default function WorkModal({
  work,
  token,
  onClose,
  onUpdate,
}: {
  work: Work | null;
  token: string | null;
  onClose: () => void;
  onUpdate: (id: number, updated: Partial<Work>) => void;
}) {
  const [status, setStatus] = useState<Work["status"]>("Pending");
  const [complaint, setComplaint] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (work) {
      setStatus(work.status);
      setComplaint(work.problem);
      setPrice(work.charge);
      setDeliveryDate(work.deliveryDate ?? "");
    }
  }, [work]);

  const messages = useMemo(() => {
    if (!work) return [];
    const userMsgs = work.user_questions?.map(q => ({ sender: "user", text: q.message, time: q.time })) || [];
    const workerMsgs = work.worker_answers?.map(a => ({ sender: "worker", text: a.message, time: a.time })) || [];
    return [...userMsgs, ...workerMsgs].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [work]);

  if (!work) return null;
  const isCompleted = work.status === "Completed";

  const handleUpdateActiveWork = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PATCH"); 
      formData.append("status", status.toLowerCase().replace(" ", "_"));
      formData.append("complaint", complaint);
      formData.append("price", price);
      formData.append("expected_delivery", deliveryDate);

      const res = await fetch(`http://127.0.0.1:8000/api/worker/works/${work.id}`, {
        method: "POST", 
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        },
        body: formData,
      });

      if (res.ok) {
        // Trigger update and refresh in parent, then close
        onUpdate(work.id, { status, problem: complaint, charge: price, deliveryDate });
        onClose();
      } else {
        const errData = await res.json();
        alert(errData.message || "Update failed");
      }
    } catch (err) { 
      alert("Network error occurred"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/works/${work.id}/answer`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        },
        body: JSON.stringify({ answer: reply }),
      });

      if (res.ok) {
        setReply("");
        // Notify parent to refresh background data
        onUpdate(work.id, {}); 
        alert("Message sent!");
        onClose(); // Auto-refresh occurs via onClose in parent
      } else {
        alert("Failed to send message");
      }
    } catch (err) {
      alert("Connection error");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`bg-white w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all ${isCompleted ? 'max-w-4xl h-[85vh]' : 'max-w-lg'}`}>
        
        {/* MODAL HEADER */}
        <div className={`p-5 flex justify-between items-center ${isCompleted ? 'bg-green-600' : 'bg-indigo-600'} text-white`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono border border-white/30">JOB: #{work.id}</span>
               <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-bold">UID: {work.user_id}</span>
            </div>
            <h2 className="text-xl font-bold leading-tight">{isCompleted ? "Service Archive" : "Active Job"}</h2>
            <p className="text-xs opacity-90 mt-1">{work.user} • {work.device}</p>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform text-2xl p-2">✕</button>
        </div>

        {!isCompleted ? (
          <div className="p-6 space-y-4">
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-2">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Customer Contact</p>
                <p className="text-sm font-semibold text-indigo-900">{work.phone || "No phone provided"}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Complaint / Issue</label>
              <textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} className="w-full border rounded-xl p-3 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" rows={3}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none bg-white">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price (₹)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Expected Delivery</label>
              <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <button onClick={handleUpdateActiveWork} disabled={loading} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all">
              {loading ? "Saving Changes..." : "Update Work Details"}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-80 p-6 bg-gray-50 border-r border-gray-100 space-y-6 overflow-y-auto">
              <div>
                <h3 className="font-bold text-gray-800 border-b pb-2 mb-3">Service Details</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="text-gray-500">Customer ID:</span> <br/><b>UID-{work.user_id}</b></p>
                  <p><span className="text-gray-500">Job ID:</span> <br/><b>#{work.id}</b></p>
                  <p><span className="text-gray-500">Customer:</span> <br/><b>{work.user}</b></p>
                  <p><span className="text-gray-500">Device:</span> <br/><b>{work.device}</b></p>
                  <p><span className="text-gray-500">Final Price:</span> <br/><b className="text-green-600 text-lg">₹{work.charge}</b></p>
                  <p><span className="text-gray-500">Completed:</span> <br/><b>{work.deliveryDate || 'N/A'}</b></p>
                  <p><span className="text-gray-500">Complaint:</span> <br/><span className="italic">"{work.problem}"</span></p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-4 border-b text-sm font-bold text-gray-500 uppercase tracking-widest bg-white">Support Chat</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <p className="text-sm">No messages yet</p>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === "worker" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.sender === "worker" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white border text-gray-800 rounded-tl-none shadow-sm"}`}>
                        {m.text}
                        <div className={`text-[9px] mt-1 opacity-70 ${m.sender === "worker" ? "text-right" : "text-left"}`}>
                          {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t flex gap-2">
                <input 
                   value={reply} 
                   onChange={(e) => setReply(e.target.value)} 
                   placeholder="Type your answer..." 
                   className="flex-1 border rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                   onKeyPress={(e)=>e.key === 'Enter' && handleSendReply()}
                />
                <button 
                  onClick={handleSendReply} 
                  disabled={loading || !reply.trim()} 
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}