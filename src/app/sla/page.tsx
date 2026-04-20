"use client";

import { useEffect, useState } from "react";
import { HiShieldCheck, HiClock, HiExclamationTriangle } from "react-icons/hi2";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface SLAData {
  compliancePercent: number;
  totalChecked: number;
  totalMet: number;
  totalBreaches: number;
  avgResponseHours: number;
  bySeverity: Record<string, { count: number; avgResolutionH: number; breachCount: number; metSLA: number }>;
  breaches: { _id: string; title: string; severity: string; area: string; targetHours: number; actualHours: number; createdAt: string; resolvedAt: string }[];
  targets: Record<string, { responseHours: number; resolveHours: number }>;
}

const sevLabels: Record<string, string> = { critical: "Crítica", high: "Alta", medium: "Media", low: "Baja" };

export default function SLAPage() {
  const [data, setData] = useState<SLAData | null>(null);

  useEffect(() => {
    fetch("/api/sla").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  const complianceColor = data.compliancePercent >= 95 ? "#22c55e" : data.compliancePercent >= 80 ? "#eab308" : "#ef4444";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <HiShieldCheck className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">SLA Tracking</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Cumplimiento SLA</p>
          <p className="text-3xl font-bold" style={{ color: complianceColor }}>{data.compliancePercent}%</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Evaluadas</p>
          <p className="text-3xl font-bold text-white">{data.totalChecked}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Dentro de SLA</p>
          <p className="text-3xl font-bold text-green-400">{data.totalMet}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Incumplimientos</p>
          <p className="text-3xl font-bold text-red-400">{data.totalBreaches}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Compliance Doughnut */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Cumplimiento General</h2>
          <div className="max-w-[250px] mx-auto">
            <Doughnut
              data={{
                labels: ["Dentro de SLA", "Fuera de SLA"],
                datasets: [{
                  data: [data.totalMet, data.totalBreaches],
                  backgroundColor: ["#22c55e", "#ef4444"],
                  borderWidth: 0,
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom", labels: { color: "#9ca3af", font: { size: 11 } } },
                },
              }}
            />
          </div>
        </div>

        {/* Resolution Time by Severity */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Tiempo de Resolución por Severidad</h2>
          <Bar
            data={{
              labels: Object.keys(data.bySeverity).map((s) => sevLabels[s] || s),
              datasets: [
                {
                  label: "Promedio (h)",
                  data: Object.values(data.bySeverity).map((s) => s.avgResolutionH),
                  backgroundColor: "#6366f1",
                  borderRadius: 4,
                },
                {
                  label: "Objetivo (h)",
                  data: Object.keys(data.bySeverity).map((s) => data.targets[s]?.resolveHours || 0),
                  backgroundColor: "#374151",
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: "#9ca3af", font: { size: 11 } } } },
              scales: {
                x: { ticks: { color: "#9ca3af" }, grid: { color: "#374151" } },
                y: { ticks: { color: "#9ca3af" }, grid: { color: "#374151" } },
              },
            }}
          />
        </div>
      </div>

      {/* SLA Targets */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <HiClock className="w-4 h-4" /> Objetivos SLA
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(data.targets).map(([sev, target]) => (
            <div key={sev} className="bg-gray-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 capitalize mb-1">{sevLabels[sev]}</p>
              <p className="text-sm text-gray-200">Respuesta: <span className="font-bold text-white">{target.responseHours}h</span></p>
              <p className="text-sm text-gray-200">Resolución: <span className="font-bold text-white">{target.resolveHours}h</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Breaches Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <HiExclamationTriangle className="w-4 h-4 text-red-400" /> Incumplimientos de SLA
        </h2>
        {data.breaches.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Sin incumplimientos</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Incidencia</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Severidad</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Objetivo</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Real</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Exceso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {data.breaches.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-700/50">
                    <td className="px-4 py-2 text-sm text-gray-200">{b.title}</td>
                    <td className="px-4 py-2"><span className="text-xs capitalize text-gray-300">{sevLabels[b.severity]}</span></td>
                    <td className="px-4 py-2 text-sm text-gray-400">{b.targetHours}h</td>
                    <td className="px-4 py-2 text-sm text-red-400 font-medium">{b.actualHours}h</td>
                    <td className="px-4 py-2 text-sm text-red-400">+{(b.actualHours - b.targetHours).toFixed(1)}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
