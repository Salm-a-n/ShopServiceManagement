"use client";

import { useState, useEffect } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  replies?: {
    id: number;
    sender: { username: string };
    message: string;
    created_at: string;
  }[];
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [user_token, setToken] = useState<string | null>(null);

  // token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("user_token");
    setToken(savedToken);
  }, []);

  // Fetch admin notifications
  const fetchNotifications = async () => {
    if (!user_token) return;

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/notifications/admin", {
        headers: {
          Authorization: `Bearer ${user_token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user_token]);

  return (
    <div className="pt-28 px-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">
        Admin Notifications
      </h2>

      {loading && <p className="text-gray-500 text-center">Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500 text-center">No notifications yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <h3 className="font-semibold text-lg text-indigo-700">{n.title}</h3>
            <p className="text-gray-700 mt-1">{n.message}</p>
            <p className="text-gray-400 text-sm mt-1">
              {new Date(n.created_at).toLocaleString()}
            </p>

            {n.replies && n.replies.length > 0 && (
              <div className="mt-2 ml-4 border-l-2 border-indigo-200 pl-4 flex flex-col gap-2">
                {n.replies.map((r) => (
                  <div key={r.id} className="bg-indigo-50 p-2 rounded">
                    <p className="text-gray-700 font-medium">
                      {r.sender.username} replied:
                    </p>
                    <p className="text-gray-600">{r.message}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
