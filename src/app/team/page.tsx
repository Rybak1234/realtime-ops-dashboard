"use client";

import { useEffect, useState } from "react";
import { HiUserGroup, HiTrophy, HiChartBar } from "react-icons/hi2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface TeamMember {
  name: string;
  totalAssigned: number;
  resolved: number;
  open: number;
  avgResolutionHours: number;
  criticalHandled: number;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => {
        setMembers(data.members);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  const medalColors = ["text-yellow-400", "text-gray-300", "text-orange-400"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <HiUserGroup className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">Rendimiento del Equipo</h1>
      </div>

      {/* Performance Ranking */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <HiTrophy className="w-4 h-4 text-yellow-400" /> Ranking de Rendimiento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {members.slice(0, 3).map((m, i) => (
            <div key={m.name} className={`bg-gray-700/50 rounded-xl p-5 text-center ${i === 0 ? "ring-1 ring-yellow-500/30" : ""}`}>
              <div className={`text-3xl mb-2 ${medalColors[i] || "text-gray-400"}`}>
                <HiTrophy className="w-8 h-8 mx-auto" />
              </div>
              <p className="font-bold text-white text-lg">{m.name}</p>
              <p className="text-sm text-gray-400 mt-1">{m.resolved} resueltas · {m.avgResolutionHours}h promedio</p>
              <p className="text-xs text-gray-500 mt-1">{m.criticalHandled} críticas gestionadas</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workload Chart */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <HiChartBar className="w-4 h-4" /> Distribución de Carga
        </h2>
        <Bar
          data={{
            labels: members.map((m) => m.name.split(" ")[0]),
            datasets: [
              { label: "Asignadas", data: members.map((m) => m.totalAssigned), backgroundColor: "#6366f1", borderRadius: 4 },
              { label: "Resueltas", data: members.map((m) => m.resolved), backgroundColor: "#22c55e", borderRadius: 4 },
              { label: "Pendientes", data: members.map((m) => m.open), backgroundColor: "#ef4444", borderRadius: 4 },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { labels: { color: "#9ca3af", font: { size: 11 } } } },
            scales: {
              x: { ticks: { color: "#9ca3af" }, grid: { color: "#374151" } },
              y: { beginAtZero: true, ticks: { color: "#9ca3af", stepSize: 1 }, grid: { color: "#374151" } },
            },
          }}
        />
      </div>

      {/* Team Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50 border-b border-gray-700">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">#</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Miembro</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Asignadas</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Resueltas</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Pendientes</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Prom. Resolución</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Críticas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {members.map((m, i) => (
              <tr key={m.name} className="hover:bg-gray-700/50">
                <td className="px-5 py-3 text-sm font-bold text-gray-500">{i + 1}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      {m.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-100">{m.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-300">{m.totalAssigned}</td>
                <td className="px-5 py-3 text-sm text-green-400 font-medium">{m.resolved}</td>
                <td className="px-5 py-3 text-sm text-yellow-400">{m.open}</td>
                <td className="px-5 py-3 text-sm text-gray-300">{m.avgResolutionHours}h</td>
                <td className="px-5 py-3 text-sm text-red-400">{m.criticalHandled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
