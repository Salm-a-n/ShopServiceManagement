
"use client";

import { useEffect, useState, useMemo } from "react";
import WaveChart from "@/app/components/WaveChart";
import StatsCard from "@/app/components/StatsCard";

type Work = {
  id: number;
  brand: string;
  complaint: string;
  user: string;
  model?: string;
  charge: string;
  status: "Pending" | "In Progress" | "Completed"; 
  expected_delivery: string | null;
  price?: number;
};

type Notification = {
  id: number;
  title: string;
  message: string;
  created_at: string;
};

function formatDateLabel(iso: string | null) {
  if (!iso) return "N/A";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
  } catch (e) {
    return "N/A";
  }
}

export default function WorkerStatsPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const [msgTitle, setMsgTitle] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [worker_token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("worker_token"));
    }
  }, []);

  /* Helper to normalize status strings safely */
  const normalizeStatus = (s: any): "Pending" | "In Progress" | "Completed" => {
    const status = String(s || "").toLowerCase();
    if (status === "completed") return "Completed";
    if (status === "in_progress" || status === "in progress") return "In Progress";
    return "Pending";
  };

  /* Fetch works */
  useEffect(() => {
    if (!worker_token) return;

    async function fetchWorks() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/worker/works", {
          headers: { 
            Authorization: `Bearer ${worker_token}`,
            "Accept": "application/json"
          },
        });
        const result = await res.json();

        // Handle the new nested structure { active: [], history: { data: [] } }
        const activeData = Array.isArray(result.active) ? result.active : [];
        const historyData = result.history?.data || (Array.isArray(result) ? result : []);
        const combined = [...activeData, ...historyData];

        const normalized: Work[] = combined.map((w: any) => {
          try {
            return {
              id: w?.id || Math.random(),
              brand: w?.brand || "Unknown Device",
              model: w?.model || "N/A",
              complaint: w?.complaint || "No description",
              user: w?.user?.username || w?.user?.name || "Customer",
              charge: w?.price?.toString() || "0",
              expected_delivery: w?.expected_delivery || null,
              status: normalizeStatus(w?.status),
            };
          } catch (e) {
            console.error("Error mapping item:", w, e);
            return { id: 0, brand: "Error", complaint: "", user: "", status: "Pending", expected_delivery: null, charge: "0" };
          }
        });
        
        setWorks(normalized.filter(item => item.id !== 0));
      } catch (err) {
        console.error("Fetch works error:", err);
        setWorks([]); 
      } finally {
        setLoadingWorks(false);
      }
    }

    fetchWorks();
  }, [worker_token]);

  useEffect(() => {
    if (!worker_token) return;
    async function fetchNotifications() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/notifications/admin", {
          headers: { Authorization: `Bearer ${worker_token}`, "Accept": "application/json" },
        });
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    }
    fetchNotifications();
  }, [worker_token]);

  /* Aggregate metrics */
  const totalWorks = works.length;
  const completed = works.filter((w) => w.status === "Completed").length;
  const inProgress = works.filter((w) => w.status === "In Progress").length;
  const pending = works.filter((w) => w.status === "Pending").length;

  /* Chart data */
  const byDate = useMemo(() => {
    const map = new Map<string, number>();
    works.forEach((w) => {
      const d = w.expected_delivery ?? "unknown";
      map.set(d, (map.get(d) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-8)
      .map(([date, count]) => ({
        label: date === "unknown" ? "N/A" : formatDateLabel(date),
        value: count,
      }));
  }, [works]);

  async function sendMessageToAdmin() {
    if (!msgTitle || !msgBody) return alert("Title & Message required");
    try {
      await fetch("http://127.0.0.1:8000/api/notifications/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${worker_token}`, "Accept": "application/json" },
        body: JSON.stringify({ title: msgTitle, message: msgBody }),
      });
      alert("Message sent!");
      setMsgTitle(""); setMsgBody("");
    } catch (err) { alert("Failed to send message"); }
  }

  if (loadingWorks) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-indigo-600 font-semibold animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="py-8">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6">Worker Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Works" value={totalWorks} />
          <StatsCard title="Completed" value={completed} />
          <StatsCard title="In Progress" value={inProgress} />
          <StatsCard title="Pending" value={pending} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Works by Delivery Date</h3>
            <WaveChart data={byDate} vw={900} vh={320} color="#4f46e5" />
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Status Breakdown</h3>
            <div className="space-y-4 mb-8">
              {["Completed", "In Progress", "Pending"].map((label) => {
                const count = works.filter(w => w.status === label).length;
                const pct = totalWorks ? Math.round((count / totalWorks) * 100) : 0;
                const color = label === "Completed" ? "bg-green-500" : label === "In Progress" ? "bg-yellow-500" : "bg-red-500";
                return (
                  <div key={label}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="font-medium">{label}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded h-2 overflow-hidden">
                      <div className={`${color} h-2 transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <h4 className="text-lg font-semibold text-gray-800 mb-3">Recent Items</h4>
            <ul className="space-y-3 overflow-auto max-h-60 pr-2">
              {works.slice(0, 5).map((w) => (
                <li key={w.id} className="border border-gray-100 rounded-lg p-3 flex flex-col gap-1 hover:bg-gray-50 transition-colors">
                  <p className="font-bold text-indigo-600 text-sm">{w.brand} — {w.model}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      w.status === "Completed" ? "bg-green-100 text-green-700" :
                      w.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                    }`}>{w.status}</span>
                    <span className="text-[10px] text-gray-400">{formatDateLabel(w.expected_delivery)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Admin Notifications</h3>
            <ul className="space-y-4 max-h-64 overflow-auto">
              {notifications.map((n) => (
                <li key={n.id} className="border-b border-gray-50 last:border-0 pb-3">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-gray-600 text-xs">{n.message}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Contact Admin</h3>
            <div className="space-y-3">
              <input className="border rounded-lg w-full p-2.5 text-sm" placeholder="Subject" value={msgTitle} onChange={(e) => setMsgTitle(e.target.value)} />
              <textarea className="border rounded-lg w-full p-2.5 text-sm h-24" placeholder="Message..." value={msgBody} onChange={(e) => setMsgBody(e.target.value)} />
              <button onClick={sendMessageToAdmin} className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}