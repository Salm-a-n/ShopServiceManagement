

"use client";
import { useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_hours: number;
  warranty: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  links: any[];
};

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: "", description: "", price: 0, duration_hours: 1, warranty: ""
  });
  const [editingService, setEditingService] = useState<Service | null>(null);

  const API_URL = "http://127.0.0.1:8000/api/services";
  const ADMIN_GET_URL = "http://127.0.0.1:8000/api/admin/services";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ADMIN_GET_URL}?search=${searchTerm}&page=${page}`, { headers: getHeaders() });
      const data = await res.json();
      setServices(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        links: data.links
      });
    } catch (err) {
      setMessage({ type: 'error', text: "Failed to load services." });
    } finally {
      setLoading(false);
    }
  };
//searchh and pagination
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchServices();
    }, 300); 
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]);

  const handleAction = async (method: string, url: string, body?: any) => {
    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: body ? JSON.stringify(body) : undefined
      });
      if (res.ok) {
        setMessage({ type: 'success', text: "Operation successful!" });
        setFormData({ name: "", description: "", price: 0, duration_hours: 1, warranty: "" });
        setEditingService(null);
        fetchServices();
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.message || "Something went wrong" });
      }
    } catch {
      setMessage({ type: 'error', text: "Network error" });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black text-gray-900">Service Dashboard</h2>
        <input 
          type="text" 
          placeholder="Search services..." 
          className="p-3 border rounded-xl w-64 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
        />
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-white font-bold transition-all ${message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
          {message.text}
        </div>
      )}

      <section className="mb-12">
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-400">Loading services...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length > 0 ? services.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-gray-800">{s.name}</h4>
                      <span className="text-emerald-600 font-bold text-lg">${s.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{s.description || "No description provided."}</p>
                  </div>
                  <div className="flex gap-2 border-t pt-4">
                    <button onClick={() => setEditingService(s)} className="flex-1 bg-amber-50 text-amber-700 py-2 rounded-lg font-bold hover:bg-amber-100">Edit</button>
                    <button onClick={() => handleAction("DELETE", `${API_URL}/${s.id}`)} className="flex-1 bg-rose-50 text-rose-700 py-2 rounded-lg font-bold hover:bg-rose-100">Delete</button>
                  </div>
                </div>
              )) : <div className="col-span-3 text-center py-10 text-gray-400">No services found.</div>}
            </div>

            {/* PAGINATION CONTROLS */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                >Previous</button>
                <span className="px-4 py-2 font-bold">Page {page} of {pagination.last_page}</span>
                <button 
                  disabled={page === pagination.last_page}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                >Next</button>
              </div>
            )}
          </>
        )}
      </section>

      <hr className="my-12 border-gray-200" />
      <section className="bg-white p-8 rounded-3xl shadow-lg border border-indigo-100 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-indigo-600 mb-6">Create New Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700">Service Name</label>
            <input placeholder="Ex: Full Engine Diagnostic" className="w-full p-3 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            
            <label className="block text-sm font-bold text-gray-700">Price ($)</label>
            <input type="number" className="w-full p-3 border rounded-xl" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700">Warranty</label>
            <input placeholder="Ex: 1 Year / 10k miles" className="w-full p-3 border rounded-xl" value={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.value})} />
            
            <label className="block text-sm font-bold text-gray-700">Estimated Hours</label>
            <input type="number" className="w-full p-3 border rounded-xl" value={formData.duration_hours} onChange={e => setFormData({...formData, duration_hours: Number(e.target.value)})} />
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="block text-sm font-bold text-gray-700">Description</label>
            <textarea placeholder="Describe what is included..." className="w-full p-3 border rounded-xl h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <button onClick={() => handleAction("POST", API_URL, formData)} className="md:col-span-2 bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
            + Add Service to Catalog
          </button>
        </div>
      </section>

      {/* EDIT MODAL  */}
      {editingService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           {/* . modal content . */}
           <div className="bg-white p-8 rounded-3xl w-full max-w-lg">
             <h3 className="text-2xl font-bold mb-6 text-gray-800">Update Service</h3>
             <div className="space-y-4">
                <input className="w-full p-3 border rounded-xl" value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} />
                <textarea className="w-full p-3 border rounded-xl" value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <input type="number" className="p-3 border rounded-xl" value={editingService.price} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} />
                   <input className="p-3 border rounded-xl" value={editingService.warranty} onChange={e => setEditingService({...editingService, warranty: e.target.value})} />
                </div>
             </div>
             <div className="flex gap-3 mt-8">
               <button onClick={() => setEditingService(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
               <button onClick={() => handleAction("PUT", `${API_URL}/${editingService.id}`, editingService)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Save Changes</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}