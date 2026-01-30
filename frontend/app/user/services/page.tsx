"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { services } from "@/app/data/services";
import ServiceCard from "@/app/components/ServiceCard";
import ServiceModal from "@/app/components/ServiceModal";
import Pagination from "@/app/components/pagination";

export default function MyServices() {
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 2;

  // Filter services by search
  const filtered = services.filter(
    (s) =>
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate services
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "auto";
  }, [selected]);

  return (
    <div className="pt-28 px-6 min-h-screen bg-gray-50">
      {/* Header with right-aligned button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-indigo-600">My Services</h2>
          <p className="text-gray-600">Track and manage your service history</p>
        </div>
        <Link
          href="/user/notifications"
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          View Notifications
        </Link>
      </div>

      {/* Search */}
      <input
        placeholder="Search by Service ID or Model"
        className="w-full mb-6 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onClick={() => setSelected(service)}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(filtered.length / perPage))}
        onPageChange={setPage}
      />

      {/* Modal */}
      <ServiceModal service={selected} onClose={() => setSelected(null)} />
    </div>
  );
}