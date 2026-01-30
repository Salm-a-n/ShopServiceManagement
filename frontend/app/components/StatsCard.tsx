"use client";

export default function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  );
}