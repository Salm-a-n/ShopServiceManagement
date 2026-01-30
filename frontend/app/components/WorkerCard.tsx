"use client";

export default function WorkerCard({
  worker,
  onToggleBlock,
}: {
  worker: { id: number; name: string; email: string; phone: string; blocked: boolean; worksDone: number };
  onToggleBlock: (id: number) => void;
}) {
  return (
    <li className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{worker.name}</p>
        <p className="text-sm text-gray-600">{worker.email} | {worker.phone}</p>
        <p className="text-sm text-gray-500">Works Done: {worker.worksDone}</p>
      </div>
      <button
        onClick={() => onToggleBlock(worker.id)}
        className={`px-4 py-2 rounded ${worker.blocked ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
      >
        {worker.blocked ? "Unblock" : "Block"}
      </button>
    </li>
  );
}