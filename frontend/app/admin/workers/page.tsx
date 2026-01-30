"use client";
import { useState } from "react";
import Pagination from "@/app/components/pagination";
import SearchBar from "@/app/components/SearchBar";

export default function ManageWorkers() {
  const [search, setSearch] = useState("");
  const [workers, setWorkers] = useState([
    { id: 1, name: "Ali", email: "ali@example.com", phone: "9876543210", blocked: false, worksDone: 12 },
    { id: 2, name: "Sara", email: "sara@example.com", phone: "9876543211", blocked: true, worksDone: 5 },
  ]);

  const [newWorker, setNewWorker] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const toggleBlock = (id: number) => {
    setWorkers(workers.map((w) => (w.id === id ? { ...w, blocked: !w.blocked } : w)));
  };

  const filtered = workers.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.name || !newWorker.email || !newWorker.password || !newWorker.phone) return;

    const newEntry = {
      id: workers.length + 1,
      name: newWorker.name,
      email: newWorker.email,
      phone: newWorker.phone,
      blocked: false,
      worksDone: 0,
    };

    setWorkers([...workers, newEntry]);
    setNewWorker({ name: "", email: "", password: "", phone: "" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Manage Workers</h2>

      {/* Search */}
      <SearchBar
        placeholder="Search workers..."
        value={search}
        onChange={setSearch}
      />

      {/* Worker Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-8">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-center">Works Done</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{w.name}</td>
                <td className="px-4 py-2">{w.email}</td>
                <td className="px-4 py-2">{w.phone}</td>
                <td className="px-4 py-2 text-center">{w.worksDone}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => toggleBlock(w.id)}
                    className={`px-3 py-1 rounded ${
                      w.blocked
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {w.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mb-10">
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      </div>

      {/* Add Worker Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">Add New Worker</h3>
        <form onSubmit={handleAddWorker} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-500"
            value={newWorker.name}
            onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-500"
            value={newWorker.email}
            onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-500"
            value={newWorker.password}
            onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-500"
            value={newWorker.phone}
            onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Register Worker
          </button>
        </form>
      </div>
    </div>
  );
}