
"use client";

import { useEffect, useState, useCallback } from "react";
import AddWorkModal from "@/app/components/AddWorkModal"; 
import WorkModal, { Work } from "@/app/components/WorkModal";
import Pagination from "@/app/components/pagination"; 

export default function WorkerWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [worker_token, setToken] = useState<string | null>(null);

  // Initialize Token
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("worker_token"));
    }
  }, []);

  // Fetch Logic
  const fetchWorks = useCallback(async (page = 1, search = "") => {
    if (!worker_token) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/worker/works?page=${page}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${worker_token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const result = await res.json();
      
      // Update Pagination Meta from Laravel "history" object
      setTotalPages(result.history?.last_page || 1);
      setCurrentPage(result.history?.current_page || 1);

      const activeRaw = result.active || [];
      const historyRaw = result.history?.data || [];
      const combinedRaw = [...activeRaw, ...historyRaw];

      const normalized: Work[] = combinedRaw.map((w: any) => ({
        id: w.id,
        device: w.brand || "Unknown Device",
        problem: w.complaint || "No description",
        user: w.user ? (w.user.username || w.user.name) : `ID: ${w.user_id}`,
        user_id: w.user_id,
        phone: w.model ?? "N/A",
        charge: w.price?.toString() ?? "0",
        status: w.status === "completed" ? "Completed" : w.status === "in_progress" ? "In Progress" : "Pending",
        deliveryDate: w.expected_delivery,
        user_questions: w.user_questions || [],
        worker_answers: w.worker_answers || []
      }));

      setWorks(normalized);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [worker_token]);

  // Trigger fetch on mount or search
  useEffect(() => {
    if (worker_token) {
      fetchWorks(1, historySearch);
    }
  }, [worker_token, historySearch, fetchWorks]);

  const handlePageChange = (page: number) => {
    fetchWorks(page, historySearch);
  };

  const handleSearchUser = async () => {
    if (!worker_token || !searchEmail) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/worker/users/search?email=${searchEmail}`, {
        headers: { Authorization: `Bearer ${worker_token}` }
      });
      const data = await res.json();
      if (res.ok && data) {
        setSearchResult(data);
        setShowAddModal(true);
        setSearchEmail("");
      } else {
        alert("User not found.");
      }
    } catch (err) {
      alert("Search failed.");
    }
  };

  const handleDeleteWork = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Delete this pending job?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/worker/works/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${worker_token}` }
      });
      if (res.ok) fetchWorks(currentPage, historySearch);
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const pendingWorks = works.filter((w) => w.status !== "Completed");
  const completedWorks = works.filter((w) => w.status === "Completed");

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
      {/* Header & User Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Workshop Desk</h1>
          <p className="text-slate-500 mt-1">Search customer email to start a new repair.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border w-full md:w-auto">
          <input 
            value={searchEmail} 
            onChange={(e) => setSearchEmail(e.target.value)} 
            placeholder="Customer email..." 
            className="px-4 py-2 outline-none text-sm flex-1 md:w-64" 
          />
          <button 
            onClick={handleSearchUser} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            Find & Add Job
          </button>
        </div>
      </div>

      {/* Active Repairs Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Active Repairs ({pendingWorks.length})</h2>
        </div>
        
        {pendingWorks.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-400">
            No active repairs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pendingWorks.map((w) => (
              <div 
                key={w.id} 
                onClick={() => setSelectedWork(w)} 
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold text-white rounded-bl-xl ${w.status === 'In Progress' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                  {w.status}
                </div>
                {w.status === "Pending" && (
                  <button onClick={(e) => handleDeleteWork(e, w.id)} className="absolute bottom-16 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors z-10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
                <div className="mb-4">
                  <span className="text-slate-300 font-mono text-xs block mb-1">#{w.id}</span>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600">{w.device}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{w.problem}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="font-black text-slate-900">₹{w.charge}</span>
                  <span className="text-xs font-bold text-slate-400">{w.user}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest">History</h2>
          </div>
          <input 
            type="text" 
            placeholder="Filter records..." 
            className="text-xs border border-slate-200 rounded-xl px-4 py-2 outline-none w-full md:w-64 bg-white shadow-sm" 
            value={historySearch} 
            onChange={(e) => setHistorySearch(e.target.value)} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedWorks.map((w) => (
            <div 
              key={w.id} 
              onClick={() => setSelectedWork(w)} 
              className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-emerald-50/50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{w.device}</h4>
                  <p className="text-xs text-slate-500">Customer: {w.user}</p>
                </div>
              </div>
              <div className="text-right px-4">
                <div className="font-bold text-slate-900">₹{w.charge}</div>
                <div className="text-[10px] text-emerald-500 font-black uppercase">Archived</div>
              </div>
            </div>
          ))}
        </div>

        {/* --- THE PAGINATION COMPONENT --- */}
        <div className="mt-10 flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-2">Page {currentPage} of {totalPages}</p>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      </section>

      {/* Modals */}
      {showAddModal && searchResult && (
        <AddWorkModal 
          userId={searchResult.id} 
          onClose={() => { setShowAddModal(false); setSearchResult(null); }} 
          onAdd={() => { fetchWorks(1, historySearch); setShowAddModal(false); }} 
        />
      )}

      {selectedWork && (
        <WorkModal 
          work={selectedWork} 
          token={worker_token} 
          onClose={() => { setSelectedWork(null); }}
          onUpdate={() => fetchWorks(currentPage, historySearch)} 
        />
      )}
    </div>
  );
}