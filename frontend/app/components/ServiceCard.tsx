
"use client";

type Service = {
  id: number;
  complaint: string;
  brand: string;
  model: string;
  status: "pending" | "in_progress" | "completed";
  expected_delivery?: string | null;
};

export default function ServiceCard({
  service,
  onClick,
}: {
  service: Service;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-xl p-5 cursor-pointer shadow hover:shadow-lg transition"
    >
      {/* Problem */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {service.complaint}
      </h3>

      {/* Device */}
      <p className="text-sm text-gray-600">
        {service.brand} • {service.model}
      </p>

      {/* Expected delivery */}
      <p className="text-xs text-gray-500 mt-1">
        Expected delivery:{" "}
        {service.expected_delivery
          ? new Date(service.expected_delivery).toDateString()
          : "Not set"}
      </p>

      {/* Status */}
      <span
        className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
          service.status === "completed"
            ? "bg-green-100 text-green-700"
            : service.status === "in_progress"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {service.status.replace("_", " ")}
      </span>
    </div>
  );
}
