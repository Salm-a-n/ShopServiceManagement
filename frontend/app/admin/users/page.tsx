"use client";
import { useState } from "react";
import Pagination from "@/app/components/pagination";
import SearchBar from "@/app/components/SearchBar";

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  // Sample users data (replace with API later)
  const users = [
    { id: 1, name: "Muhammed", email: "muhammed@example.com", worksDone: 10 },
    { id: 2, name: "John", email: "john@example.com", worksDone: 5 },
    { id: 3, name: "Sara", email: "sara@example.com", worksDone: 8 },
    { id: 4, name: "Ali", email: "ali@example.com", worksDone: 12 },
    { id: 5, name: "David", email: "david@example.com", worksDone: 3 },
    { id: 6, name: "Emma", email: "emma@example.com", worksDone: 7 },
  ];

  // Filter users by search
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate users
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">All Users</h2>

      {/* Search */}
      <SearchBar
        placeholder="Search users by name or email..."
        value={search}
        onChange={setSearch}
      />

      {/* Users Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-8">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-center">Works Done</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 text-center">{u.worksDone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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