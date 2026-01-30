"use client";
import { useState } from "react";
import Pagination from "@/app/components/pagination";
import SearchBar from "@/app/components/SearchBar";

export default function ManageWorks() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  // Sample works data (replace with API later)
  const works = [
    { id: 1, service: "Phone Repair", worker: "Ali", status: "Done" },
    { id: 2, service: "Laptop Service", worker: "Sara", status: "Pending" },
    { id: 3, service: "Tablet Screen Replacement", worker: "Ali", status: "Done" },
    { id: 4, service: "PC Cleaning", worker: "John", status: "Pending" },
    { id: 5, service: "Battery Replacement", worker: "Sara", status: "Done" },
    { id: 6, service: "Software Installation", worker: "Ali", status: "Pending" },
    { id: 7, service: "Data Recovery", worker: "John", status: "Done" },
  ];

  // Filter works by search
  const filtered = works.filter(
    (w) =>
      w.service.toLowerCase().includes(search.toLowerCase()) ||
      w.worker.toLowerCase().includes(search.toLowerCase()) ||
      w.status.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate works
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Manage Works</h2>

      {/* Search */}
      <SearchBar
        placeholder="Search by service, worker, or status..."
        value={search}
        onChange={setSearch}
      />

      {/* Works List */}
      <ul className="space-y-4">
        {paginated.map((w) => (
          <li
            key={w.id}
            className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{w.service}</p>
              <p className="text-sm text-gray-600">Worker: {w.worker}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                w.status === "Done"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {w.status}
            </span>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(filtered.length / perPage))}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}