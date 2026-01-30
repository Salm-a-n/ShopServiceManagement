"use client";
import StatsCard from "@/app/components/StatsCard";
import Link from "next/link";

export default function AdminDashboard() {
  // Sample data (replace with API later)
  const services = [
    { id: 1, name: "Phone Repair" },
    { id: 2, name: "Laptop Service" },
    { id: 3, name: "Tablet Screen Replacement" },
  ];
  const questions = [
    { id: 1, question: "Is my phone repair available?", reply: null },
    { id: 2, question: "How long for laptop service?", reply: "2 days" },
  ];
  const workers = [
    { id: 1, name: "Ali", worksDone: 12 },
    { id: 2, name: "Sara", worksDone: 5 },
    { id: 3, name: "John", worksDone: 8 },
  ];
  const users = [
    { id: 1, name: "Muhammed", worksDone: 10 },
    { id: 2, name: "David", worksDone: 3 },
    { id: 3, name: "Emma", worksDone: 7 },
  ];
  const works = [
    { id: 1, service: "Phone Repair", worker: "Ali", status: "Done" },
    { id: 2, service: "Laptop Service", worker: "Sara", status: "Pending" },
  ];

  return (
    <div className="pb-20"> {/* Added padding-bottom for free space */}
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Users" value={users.length} />
        <StatsCard title="Workers" value={workers.length} />
        <StatsCard title="Works Done" value={works.filter(w => w.status === "Done").length} />
        <StatsCard title="Pending Works" value={works.filter(w => w.status === "Pending").length} />
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Services Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">Recent Services</h3>
          <ul className="space-y-2 flex-grow">
            {services.map((s) => (
              <li key={s.id} className="border-b py-2">{s.name}</li>
            ))}
          </ul>
          <Link href="/admin/services" className="text-indigo-600 font-semibold hover:underline mt-4 block">
            Manage Services →
          </Link>
        </div>

        {/* Questions Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">Recent Questions</h3>
          <ul className="space-y-2 flex-grow">
            {questions.map((q) => (
              <li key={q.id} className="border-b py-2">
                <p className="font-semibold">Q: {q.question}</p>
                <p className="text-sm text-gray-600">Reply: {q.reply || "Awaiting reply"}</p>
              </li>
            ))}
          </ul>
          <Link href="/admin/questions" className="text-indigo-600 font-semibold hover:underline mt-4 block">
            Manage Questions →
          </Link>
        </div>

        {/* Workers Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">Top Workers</h3>
          <ul className="space-y-2 flex-grow">
            {workers.map((w) => (
              <li key={w.id} className="border-b py-2 flex justify-between">
                <span>{w.name}</span>
                <span className="text-gray-600">Works Done: {w.worksDone}</span>
              </li>
            ))}
          </ul>
          <Link href="/admin/workers" className="text-indigo-600 font-semibold hover:underline mt-4 block">
            Manage Workers →
          </Link>
        </div>

        {/* Users Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">Recent Users</h3>
          <ul className="space-y-2 flex-grow">
            {users.map((u) => (
              <li key={u.id} className="border-b py-2 flex justify-between">
                <span>{u.name}</span>
                <span className="text-gray-600">Works Done: {u.worksDone}</span>
              </li>
            ))}
          </ul>
          <Link href="/admin/users" className="text-indigo-600 font-semibold hover:underline mt-4 block">
            Manage Users →
          </Link>
        </div>
      </div>
    </div>
  );
}