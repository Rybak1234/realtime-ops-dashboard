"use client";

import { useEffect, useState } from "react";
import { HiBell, HiCheck, HiExclamationTriangle, HiShieldExclamation, HiServerStack } from "react-icons/hi2";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  read: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  alert: <HiExclamationTriangle className="w-5 h-5 text-orange-400" />,
  incident: <HiShieldExclamation className="w-5 h-5 text-red-400" />,
  system: <HiServerStack className="w-5 h-5 text-blue-400" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => { setNotifications(data); setLoading(false); });
  }, []);

  function toggleRead(id: string) {
    setNotifications(notifications.map((n) =>
      n._id === id ? { ...n, read: !n.read } : n
    ));
  }

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  }

  const filtered = filter
    ? notifications.filter((n) => n.type === filter)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HiBell className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        <button onClick={markAllRead} className="text-sm text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1">
          <HiCheck className="w-4 h-4" /> Marcar todo como leído
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "", label: "Todas" },
          { value: "incident", label: "Incidencias" },
          { value: "alert", label: "Alertas" },
          { value: "system", label: "Sistema" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              filter === f.value ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <HiBell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Sin notificaciones</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n._id}
              className={`bg-gray-800 rounded-xl border p-4 flex items-start gap-4 cursor-pointer transition hover:bg-gray-700/50 ${
                n.read ? "border-gray-800 opacity-60" : "border-gray-700"
              }`}
              onClick={() => toggleRead(n._id)}
            >
              <div className="flex-shrink-0 mt-0.5">
                {typeIcons[n.type] || typeIcons.incident}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${n.read ? "text-gray-400" : "text-white"}`}>{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-600 mt-1">{new Date(n.createdAt).toLocaleString("es")}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-2" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
