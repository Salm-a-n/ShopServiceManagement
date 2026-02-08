
"use client";

import { useState, useEffect, useMemo } from "react";
import Pagination from "@/app/components/pagination";
import SearchBar from "@/app/components/SearchBar";

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
}

export default function ManageUsers() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 2;

  // Fetch all users 
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch("http://127.0.0.1:8000/api/admin/users", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });
        
        const data = await response.json();

        // Check if data is a direct array or wrapped in a 'data' property
        if (Array.isArray(data)) {
          setAllUsers(data);
        } else if (data && Array.isArray(data.data)) {
          setAllUsers(data.data);
        } else {
          console.error("API response is not an array:", data);
          setAllUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  //  Filter logic 
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(allUsers)) return [];
    
    return allUsers.filter(
      (u) =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.toLowerCase().includes(search.toLowerCase())
    );
  }, [allUsers, search]);

  //  Pagination logic 
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / perPage));
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredUsers.slice(start, start + perPage);
  }, [filteredUsers, page]);

  // Handle search input change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1); 
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-indigo-600 mb-6 text-center md:text-left">
        User Management
      </h2>

      <div className="mb-6 w-full max-w-md mx-auto md:mx-0">
        <SearchBar
          placeholder="Search name, email or phone..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-indigo-600 text-white whitespace-nowrap">
                <th className="px-4 md:px-6 py-4 text-left font-semibold text-sm md:text-base">Username</th>
                <th className="px-4 md:px-6 py-4 text-left font-semibold text-sm md:text-base">Email</th>
                <th className="px-4 md:px-6 py-4 text-left font-semibold text-sm md:text-base">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Fetching users...
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors whitespace-nowrap md:whitespace-normal">
                    <td className="px-4 md:px-6 py-4 font-medium text-gray-900 text-sm md:text-base">{u.username}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-600 text-sm md:text-base">{u.email}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-600 text-sm md:text-base">{u.phone || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                    {search ? `No matches found for "${search}"` : "No users available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && filteredUsers.length > perPage && (
        <div className="mt-8 flex justify-center overflow-x-auto pb-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}