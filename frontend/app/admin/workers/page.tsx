
"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/pagination";

interface Worker {
  id: number;
  username: string;
  email: string;
  phone: string;
  description: string;
  is_active: boolean;
  total_works: number;
  completed_works: number;
  pending_works: number;
}

export default function ManageWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [newWorker, setNewWorker] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    description: "",
  });

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("admin_token");
      const query = new URLSearchParams({ 
        search, 
        page: currentPage.toString() 
      }).toString();
      
      const url = `http://127.0.0.1:8000/api/admin/workers?${query}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized: Please login again.");
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setWorkers(data.data || []);
      setTotalPages(data.last_page || 1);
      
      if (data.current_page > data.last_page && data.last_page > 0) {
        setCurrentPage(data.last_page);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1); 
  };

  const toggleBlock = async (id: number) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`http://127.0.0.1:8000/api/admin/workers/${id}/toggle`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        setWorkers(prev => prev.map(w => 
          w.id === id ? { ...w, is_active: !w.is_active } : w
        ));
      }
    } catch (err) {
      alert("Network error while updating status.");
    }
  };

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("http://127.0.0.1:8000/api/create-worker", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newWorker),
      });

      if (res.ok) {
        setNewWorker({ username: "", email: "", password: "", phone: "", description: "" });
        fetchWorkers();
        alert("Worker added successfully!");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Worker Management</h2>
        <div className="w-full md:w-72">
          <SearchBar
            placeholder="Search workers..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="block md:hidden divide-y divide-slate-100">
          {loading ? (
             <div className="p-20 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>
          ) : workers.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No workers found.</div>
          ) : (
            workers.map((w) => (
              <div key={w.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900">{w.username}</div>
                    <div className="text-xs font-semibold text-indigo-600 uppercase">{w.description || "Worker"}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-widest ${w.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {w.is_active ? 'ACTIVE' : 'BLOCKED'}
                  </span>
                </div>
                <div className="text-sm text-slate-500">
                  <p>{w.email}</p>
                  <p>{w.phone}</p>
                </div>
                <div className="flex justify-between items-center pt-2">
                   <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                     Stats: {w.completed_works} / {w.total_works}
                   </span>
                   <button
                    onClick={() => toggleBlock(w.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      w.is_active ? "text-rose-600 border border-rose-200" : "bg-emerald-600 text-white"
                    }`}
                  >
                    {w.is_active ? "Block" : "Unblock"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">Worker Info</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-center">Stats (Comp/Total)</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-center">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center">Loading...</td></tr>
              ) : (
                workers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{w.username}</div>
                      <div className="text-xs font-semibold text-indigo-600 uppercase mb-1">{w.description || "Worker"}</div>
                      <div className="text-sm text-slate-500">{w.email} • {w.phone}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                        {w.completed_works} / {w.total_works}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-black tracking-widest ${w.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {w.is_active ? 'ACTIVE' : 'BLOCKED'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleBlock(w.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          w.is_active ? "text-rose-600 hover:bg-rose-50" : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {w.is_active ? "Block User" : "Unblock User"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Registration Form  */}
      <section className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-2xl text-white">
        <h3 className="text-xl font-bold mb-6">Onboard New Worker</h3>
        <form onSubmit={handleAddWorker} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <input
            className="bg-slate-800 border-none rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 w-full"
            placeholder="Username"
            value={newWorker.username}
            onChange={(e) => setNewWorker({ ...newWorker, username: e.target.value })}
            required
            autoComplete="off"
          />
          <input
            className="bg-slate-800 border-none rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 w-full"
            type="email"
            placeholder="Email Address"
            value={newWorker.email}
            onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
            required
            autoComplete="off"
          />
          <input
            className="bg-slate-800 border-none rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 w-full"
            type="password"
            placeholder="Set Password"
            value={newWorker.password}
            onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
            required
            autoComplete="new-password"
          />
          <input
            className="bg-slate-800 border-none rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 w-full"
            placeholder="Phone Number"
            value={newWorker.phone}
            onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
            required
            autoComplete="off"
          />
          <input
            className="bg-slate-800 border-none rounded-lg p-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 w-full"
            placeholder="Role (e.g. Technician)"
            value={newWorker.description}
            onChange={(e) => setNewWorker({ ...newWorker, description: e.target.value })}
          />
          <button type="submit" className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg w-full">
            Create Account
          </button>
        </form>
      </section>
    </div>
  );
}




