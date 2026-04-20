"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Incident {
  _id: string;
  title: string;
  area: string;
  severity: string;
  status: string;
  assignedTo: string;
  createdAt: string;
}

const severityColor: Record<string, string> = {
  critical: "bg-red-900/50 text-red-300 border-red-700",
  high: "bg-orange-900/50 text-orange-300 border-orange-700",
  medium: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  low: "bg-green-900/50 text-green-300 border-green-700",
};

const severityLabel: Record<string, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const statusColor: Record<string, string> = {
  open: "bg-red-500/20 text-red-300",
  in_progress: "bg-yellow-500/20 text-yellow-300",
  resolved: "bg-green-500/20 text-green-300",
  closed: "bg-gray-500/20 text-gray-400",
};

const statusLabel: Record<string, string> = {
  open: "Abierta",
  in_progress: "En progreso",
  resolved: "Resuelta",
  closed: "Cerrada",
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filterArea, setFilterArea] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterArea) params.set("area", filterArea);
    if (filterStatus) params.set("status", filterStatus);

    fetch(`/api/incidents?${params}`)
      .then((r) => r.json())
      .then(setIncidents);
  }, [filterArea, filterStatus]);

  const areas = [...new Set(incidents.map((i) => i.area))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Incidencias</h1>
        <div className="flex gap-3">
          <a
            href="/api/export"
            className="bg-gray-700 text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            📥 CSV
          </a>
          <Link
            href="/incidents/new"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
          >
            + Nueva
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="open">Abiertas</option>
          <option value="in_progress">En progreso</option>
          <option value="resolved">Resueltas</option>
          <option value="closed">Cerradas</option>
        </select>
        <select
          value={filterArea}
          onChange={(e) => setFilterArea(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="">Todas las áreas</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {incidents.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
          <div className="text-6xl mb-4">🛡️</div>
          <p className="text-gray-400 text-lg">Sin incidencias</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Título</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Área</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Severidad</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Estado</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Asignado</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {incidents.map((inc) => (
                <tr key={inc._id} className="hover:bg-gray-700/50 cursor-pointer" onClick={() => window.location.href = `/incidents/${inc._id}`}>
                  <td className="px-5 py-3 text-sm font-medium text-gray-100">
                    <Link href={`/incidents/${inc._id}`} className="hover:text-emerald-400 transition">
                      {inc.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-300">{inc.area}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${severityColor[inc.severity]}`}>
                      {severityLabel[inc.severity]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[inc.status]}`}>
                      {statusLabel[inc.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">{inc.assignedTo || "—"}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {new Date(inc.createdAt).toLocaleDateString("es")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
