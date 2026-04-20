"use client";

import { useEffect, useState } from "react";
import { HiClipboardDocumentList, HiAdjustmentsHorizontal, HiUser, HiExclamationTriangle, HiCheckCircle, HiArrowPath } from "react-icons/hi2";

interface Activity {
  _id: string;
  action: string;
  description: string;
  user: string;
  area: string;
  severity: string;
  timestamp: string;
}

const actionIcons: Record<string, React.ReactNode> = {
  incident_created: <HiExclamationTriangle className="w-4 h-4 text-red-400" />,
  status_changed: <HiArrowPath className="w-4 h-4 text-yellow-400" />,
  incident_resolved: <HiCheckCircle className="w-4 h-4 text-green-400" />,
};

const actionLabels: Record<string, string> = {
  incident_created: "Creación",
  status_changed: "Cambio de estado",
  incident_resolved: "Resolución",
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filterAction, setFilterAction] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((data) => { setActivities(data); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  const users = [...new Set(activities.map((a) => a.user).filter(Boolean))];

  const filtered = activities.filter((a) => {
    if (filterAction && a.action !== filterAction) return false;
    if (filterUser && a.user !== filterUser) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <HiClipboardDocumentList className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">Registro de Actividad</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center gap-2">
          <HiAdjustmentsHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="">Todas las acciones</option>
            <option value="incident_created">Creación</option>
            <option value="status_changed">Cambio de estado</option>
            <option value="incident_resolved">Resolución</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <HiUser className="w-4 h-4 text-gray-400" />
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="">Todos los usuarios</option>
            {users.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <HiClipboardDocumentList className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Sin actividad registrada</p>
          </div>
        ) : (
          filtered.map((a) => (
            <div key={a._id} className="flex items-start gap-3 py-3 border-b border-gray-800 hover:bg-gray-800/50 rounded-lg px-3 transition">
              <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                {actionIcons[a.action] || actionIcons.incident_created}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200">{a.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">{a.user}</span>
                  <span className="text-xs text-gray-600">·</span>
                  <span className="text-xs text-gray-500">{actionLabels[a.action] || a.action}</span>
                  <span className="text-xs text-gray-600">·</span>
                  <span className="text-xs text-gray-500">{a.area}</span>
                </div>
              </div>
              <span className="text-xs text-gray-600 flex-shrink-0 mt-1">
                {new Date(a.timestamp).toLocaleString("es")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
