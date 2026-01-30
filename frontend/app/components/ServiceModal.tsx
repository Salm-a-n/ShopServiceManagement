"use client";

export default function ServiceModal({
  service,
  onClose,
}: {
  service: any;
  onClose: () => void;
}) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-indigo-600">{service.type}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">ID:</span> {service.id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Status:</span> {service.status}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Date:</span> {service.date}
          </p>

          {/* Device Info */}
          <p className="text-sm text-gray-600 col-span-2">
            <span className="font-semibold">Device:</span> {service.deviceName} (
            {service.deviceModel})
          </p>

          {/* Worker Info */}
          <p className="text-sm text-gray-600 col-span-2">
            <span className="font-semibold">Worker:</span>{" "}
            {service.workerName || service.workerId}
          </p>

          <p className="text-sm text-gray-600 col-span-2">
            <span className="font-semibold">Complaint:</span> {service.complaint}
          </p>
        </div>

        {/* Complaint/Doubt Section */}
        <div className="space-y-4 mb-6">
          <label className="block font-semibold text-gray-700">
            Add Complaint/Doubt
          </label>
          <textarea
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={4}
            placeholder="Write your complaint or doubt..."
          />
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Attach File
            </label>
            <input
              type="file"
              className="border p-2 w-full rounded-lg cursor-pointer focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md">
            Submit
          </button>
        </div>

        {/* Reply Section (Worker/Admin response to complaint) */}
        <div className="border-t pt-4 space-y-3">
          <h3 className="text-lg font-semibold text-indigo-600">Reply from Worker</h3>
          {service.replies && service.replies.length > 0 ? (
            <ul className="space-y-2">
              {service.replies.map((reply: string, idx: number) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 bg-gray-100 p-2 rounded-lg"
                >
                  {reply}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No replies yet</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}