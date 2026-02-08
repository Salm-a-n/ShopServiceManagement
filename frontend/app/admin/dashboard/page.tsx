
"use client";

import { useMemo, useEffect, useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import Link from "next/link";
import WaveChart from "@/app/components/WaveChart";

interface DashboardData {
  services: any[];
  workers: any[];
  users: any[];
  works: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    services: [],
    workers: [],
    users: [],
    works: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdminData() {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

      if (!token) {
        setError("Unauthorized: Please login as admin.");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        };
        const [resServices, resWorkers, resUsers, resWorks] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/services", { headers }),
          fetch("http://127.0.0.1:8000/api/admin/allworkers", { headers }), 
          fetch("http://127.0.0.1:8000/api/admin/users", { headers }),
          fetch("http://127.0.0.1:8000/api/admin/works", { headers }),
        ]);

        const parseRes = async (res: Response) => {
          if (!res.ok) return [];
          const json = await res.json();
          if (Array.isArray(json)) return json;
          if (json.data && Array.isArray(json.data.data)) return json.data.data;
          if (json.data && Array.isArray(json.data)) return json.data;
          return [];
        };

        setData({
          services: await parseRes(resServices),
          workers: await parseRes(resWorkers), 
          users: await parseRes(resUsers),
          works: await parseRes(resWorks),
        });
      } catch (err) {
        setError("Failed to connect to the backend server.");
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  const dailyWorkChartData = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(date => {
      const count = data.works.filter(work => 
        work.created_at && work.created_at.startsWith(date)
      ).length;

      const [y, m, d] = date.split('-');
      return { label: `${m}/${d}`, value: count };
    });
  }, [data.works]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-indigo-600 font-medium">Loading Admin Panel...</p>
    </div>
  );

  return (
    <div className="pb-20 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-700">Admin Dashboard</h2>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Users" value={data.users.length} />
        <StatsCard title="Total Workers" value={data.workers.length} />
        <StatsCard title="Total Works" value={data.works.length} />
        <StatsCard title="Total Services" value={data.services.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Work Creation Trend</h3>
          <p className="text-sm text-gray-400 mb-4">Volume of new works per day</p>
          <div className="w-full">
            <WaveChart data={dailyWorkChartData} vw={900} vh={350} color="#4f46e5" />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Recent Users</h3>
          <div className="flex-grow space-y-4">
            {data.users.slice(0, 8).map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{user.username}</p>
                    <p className="text-[10px] text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            ))}
            {data.users.length === 0 && <p className="text-gray-400 text-center py-10">No users found.</p>}
          </div>
          <Link href="/admin/users" className="mt-6 text-center text-sm text-indigo-600 font-bold hover:underline">
            View All Users →
          </Link>
        </div>
      </div>
    </div>
  );
}