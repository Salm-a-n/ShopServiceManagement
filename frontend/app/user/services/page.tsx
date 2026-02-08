
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ServiceCard from "@/app/components/ServiceCard";
import ServiceModal from "@/app/components/ServiceModal";
import Pagination from "@/app/components/pagination";
import SendToAdminModal from "@/app/components/SendToAdminModal";

export default function MyServices() {
  const [services, setServices] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user_token, setToken] = useState<string | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const perPage = 6;

  useEffect(() => {
    const savedToken = localStorage.getItem("user_token");
    setToken(savedToken);
  }, []);
  const fetchServices = useCallback(async () => {
    if (!user_token) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://127.0.0.1:8000/api/user/works?page=${page}&search=${search}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${user_token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      setServices(data.data || []);
      setTotalPages(data.last_page || 1);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, user_token]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    document.body.style.overflow = selected || showAdminModal ? "hidden" : "auto";
  }, [selected, showAdminModal]);

  return (
    <div className="pt-28 px-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-indigo-600">My Services</h2>
          <p className="text-gray-600">Track and manage your service history</p>
        </div>
        <div className="flex gap-3">
          <Link href="/user/notifications" className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition">
            View Notifications
          </Link>
          <Link href="/user/all-services" className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition">
           Available services
            </Link>
          <button onClick={() => setShowAdminModal(true)} className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition">
            Message Admin
          </button>
        </div>
      </div>

      <input
        placeholder="Search by brand, model, or complaint"
        className="w-full mb-6 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        value={search}
        onChange={(e) => { setPage(1); setSearch(e.target.value); }}
      />

      {loading && <p className="text-center text-gray-500">Loading services...</p>}
      {!loading && services.length === 0 && <p className="text-center text-gray-500">No services found.</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onClick={() => setSelected(service)} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

    
      {selected && (
        <ServiceModal 
          service={selected} 
          onClose={() => {
            setSelected(null);
            fetchServices(); 
          }} 
        />
      )}

      {showAdminModal && (
        <SendToAdminModal 
          onClose={() => {
            setShowAdminModal(false);
            fetchServices();
          }} 
        />
      )}
    </div>
  );
}