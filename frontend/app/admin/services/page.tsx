"use client";
import { useState } from "react";

export default function ManageServices() {
  const [services, setServices] = useState([
    { id: 1, name: "Phone Repair" },
    { id: 2, name: "Laptop Service" },
  ]);
  const [newService, setNewService] = useState("");

  const addService = () => {
    if (!newService.trim()) return;
    setServices([...services, { id: services.length + 1, name: newService }]);
    setNewService("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Add & Manage Services</h2>

      {/* Add Service Form */}
      <div className="flex gap-2 mb-6">
        <input
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          placeholder="New service title"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addService}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add
        </button>
      </div>

      {/* Services List */}
      <ul className="space-y-2">
        {services.map((s) => (
          <li key={s.id} className="bg-white shadow-md rounded-lg p-4">{s.name}</li>
        ))}
      </ul>
    </div>
  );
}