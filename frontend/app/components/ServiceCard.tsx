export default function ServiceCard({
  service,
  onClick,
}: {
  service: any;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer shadow-md hover:shadow-xl transition transform hover:-translate-y-1 w-full h-full"
    >
      <p className="text-sm text-gray-500">{service.id}</p>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.type}</h3>

      {/* Device Info */}
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Device:</span> {service.deviceName} ({service.deviceModel})
      </p>

      <p
        className={`text-sm font-medium ${
          service.status === "Completed"
            ? "text-green-600"
            : service.status === "In Progress"
            ? "text-yellow-600"
            : "text-red-600"
        }`}
      >
        {service.status}
      </p>
      <p className="text-xs text-gray-500 mt-2">{service.date}</p>
    </div>
  );
}