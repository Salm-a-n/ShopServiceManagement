
"use client";
import { useEffect, useState } from "react";

type Notification = {
  id: number;
  title: string;
  message: string;
  sender: { id: number; name: string; email: string; is_worker: boolean };
  replies: any[];
  created_at: string;
};

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState<"user" | "worker">("user");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // States for Sending New Notifications
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendTarget, setSendTarget] = useState<"user" | "worker">("user");
  const [newNotif, setNewNotif] = useState({ receiver_id: "", title: "", message: "" });

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
  });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/notifications", { headers: getHeaders() });
      const data: Notification[] = await res.json();
      //filteration
      let filtered = data.filter(n => activeTab === "worker" ? n.sender.is_worker : !n.sender.is_worker);
      // Items with NO replies from Admin come first
      filtered.sort((a, b) => {
        const aHasAdminReply = a.replies.some(r => r.sender.is_admin);
        const bHasAdminReply = b.replies.some(r => r.sender.is_admin);
        if (aHasAdminReply && !bHasAdminReply) return 1;
        if (!aHasAdminReply && bHasAdminReply) return -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setNotifications(filtered);
    } catch (err) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    setCurrentPage(1); 
    fetchNotifications(); 
  }, [activeTab]);
//pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  const handleReply = async (parentId: number) => {
    if (!replyText[parentId]) return;
    const res = await fetch("http://127.0.0.1:8000/api/notifications/reply", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ parent_id: parentId, message: replyText[parentId] })
    });
    if (res.ok) {
      setReplyText({ ...replyText, [parentId]: "" });
      fetchNotifications();
    }
  };

  const handleSendNotification = async () => {
    const endpoint = sendTarget === "user" ? "user" : "worker";
    const res = await fetch(`http://127.0.0.1:8000/api/notifications/${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        ...newNotif,
        receiver_id: newNotif.receiver_id === "" ? null : newNotif.receiver_id
      })
    });
    if (res.ok) {
      setShowSendModal(false);
      setNewNotif({ receiver_id: "", title: "", message: "" });
      fetchNotifications();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-gray-900">Communication Center</h2>
        <button 
          onClick={() => setShowSendModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition"
        >
          + Send New Message
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b">
        {["user", "worker"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 px-4 font-bold capitalize transition ${activeTab === tab ? "border-b-4 border-indigo-600 text-indigo-600" : "text-gray-400"}`}
          >
            {tab} Messages
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : currentItems.length > 0 ? (
          currentItems.map(n => (
            <div key={n.id} className={`bg-white p-6 rounded-2xl shadow-sm border ${n.replies.some(r => r.sender.is_admin) ? 'opacity-75 border-gray-200' : 'border-indigo-200 ring-1 ring-indigo-50'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{n.sender.name}</span>
                  <h4 className="text-xl font-bold">{n.title}</h4>
                </div>
                <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 mb-4">{n.message}</p>

              <div className="bg-gray-50 p-4 rounded-xl space-y-3 mb-4">
                {n.replies.map((r, i) => (
                  <div key={i} className={`text-sm p-2 rounded ${r.sender.is_admin ? "bg-indigo-50 border-l-4 border-indigo-400 ml-4" : "bg-white border"}`}>
                    <span className="font-bold">{r.sender.name}: </span>{r.message}
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <input 
                    className="flex-1 p-2 border rounded-lg text-sm" 
                    placeholder="Type a reply..."
                    value={replyText[n.id] || ""}
                    onChange={(e) => setReplyText({...replyText, [n.id]: e.target.value})}
                  />
                  <button onClick={() => handleReply(n.id)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black">Reply</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-gray-500">No messages found in this section.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 font-bold"
          >
            Previous
          </button>
          <span className="text-sm font-bold text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 font-bold"
          >
            Next
          </button>
        </div>
      )}

      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Compose Notification</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Send To</label>
                <select 
                  className="w-full p-3 border rounded-xl mt-1"
                  value={sendTarget}
                  onChange={(e) => setSendTarget(e.target.value as any)}
                >
                  <option value="user">Users</option>
                  <option value="worker">Workers</option>
                </select>
              </div>
              {/* <input 
                placeholder="Receiver User ID (Leave empty for ALL)" 
                className="w-full p-3 border rounded-xl"
                value={newNotif.receiver_id}
                onChange={e => setNewNotif({...newNotif, receiver_id: e.target.value})}
              /> */}
              <input 
                placeholder="Subject/Title" 
                className="w-full p-3 border rounded-xl font-bold"
                value={newNotif.title}
                onChange={e => setNewNotif({...newNotif, title: e.target.value})}
              />
              <textarea 
                placeholder="Message details..." 
                className="w-full p-3 border rounded-xl h-32"
                value={newNotif.message}
                onChange={e => setNewNotif({...newNotif, message: e.target.value})}
              />
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowSendModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
              <button onClick={handleSendNotification} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Send Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}