
"use client";
import { useEffect, useState } from "react";

export type NewWorkPayload = {
  brand: string;
  model: string;
  complaint: string;
  expected_delivery: string;
  price: number;
  user_id: number;
};

type Props = {
  userId?: number;
  onClose: () => void;
  onAdd: (work: any) => void;
};

export default function AddWorkModal({ userId, onClose, onAdd }: Props) {
  const [device, setDevice] = useState("");
  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [worker_token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("worker_token"));
  }, []);

  const handleSubmit = async () => {
    if (!userId || !worker_token) return alert("Missing user or auth");

    if (!device || !phone || !problem || !deliveryDate || !price) {
      return alert("All fields are required");
    }

    const payload: NewWorkPayload = {
      brand: device,
      model: phone,
      complaint: problem,
      expected_delivery: deliveryDate,
      price: Number(price),
      user_id: userId,
    };

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/api/worker/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${worker_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create work");
        return;
      }

      // Important: Pass the work object from the response (data.work)
      onAdd(data.work || data); 
      onClose();
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="bg-indigo-600 text-white p-5 text-center">
          <h2 className="text-xl font-bold">Create New Work</h2>
          <p className="text-sm opacity-90">Customer ID: #{userId}</p>
        </div>

        <div className="p-6 space-y-4">
          <input className="w-full border rounded-lg px-4 py-2" placeholder="Device / Brand" value={device} onChange={(e) => setDevice(e.target.value)} />
          <input className="w-full border rounded-lg px-4 py-2" placeholder="Phone / Model" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <textarea className="w-full border rounded-lg px-4 py-2" placeholder="Problem / Complaint" rows={3} value={problem} onChange={(e) => setProblem(e.target.value)} />
          <input type="date" className="w-full border rounded-lg px-4 py-2" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
          <input type="number" className="w-full border rounded-lg px-4 py-2" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className="p-6 flex gap-3">
          <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Creating..." : "Create Work"}
          </button>
          <button onClick={onClose} className="flex-1 border py-2 rounded-xl font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}