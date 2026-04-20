"use client";

import { useEffect, useState } from "react";
import { HiDocumentText, HiCalendarDays, HiArrowTrendingUp, HiArrowTrendingDown, HiArrowDownTray } from "react-icons/hi2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Incident {
  _id: string;
  title: string;
  area: string;
  severity: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
}

export default function ReportsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/incidents")
      .then((r) => r.json())
      .then((data) => { setIncidents(data); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10);

  const todayCount = incidents.filter((i) => i.createdAt.slice(0, 10) === today).length;
  const weekCount = incidents.filter((i) => i.createdAt.slice(0, 10) >= weekAgo).length;
  const monthCount = incidents.filter((i) => i.createdAt.slice(0, 10) >= monthStart).length;
  const lastMonthCount = incidents.filter((i) => i.createdAt.slice(0, 10) >= lastMonthStart && i.createdAt.slice(0, 10) <= lastMonthEnd).length;

  const diff = monthCount - lastMonthCount;
  const trend = diff >= 0;

  // Top recurring areas
  const areaCount: Record<string, number> = {};
  incidents.forEach((i) => { areaCount[i.area] = (areaCount[i.area] || 0) + 1; });
  const topAreas = Object.entries(areaCount).sort(([, a], [, b]) => b - a).slice(0, 6);

  // Comparison chart: this month vs last month by severity
  const sevs = ["critical", "high", "medium", "low"];
  const sevLabels: Record<string, string> = { critical: "Crítica", high: "Alta", medium: "Media", low: "Baja" };
  const thisMonthBySev = sevs.map((s) => incidents.filter((i) => i.severity === s && i.createdAt.slice(0, 10) >= monthStart).length);
  const lastMonthBySev = sevs.map((s) => incidents.filter((i) => i.severity === s && i.createdAt.slice(0, 10) >= lastMonthStart && i.createdAt.slice(0, 10) <= lastMonthEnd).length);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HiDocumentText className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Reportes</h1>
        </div>
        <a
          href="/api/export"
          className="flex items-center gap-2 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
        >
          <HiArrowDownTray className="w-4 h-4" /> Exportar CSV
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-2">
            <HiCalendarDays className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-400 uppercase">Hoy</p>
          </div>
          <p className="text-3xl font-bold text-white">{todayCount}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase mb-2">Esta Semana</p>
          <p className="text-3xl font-bold text-white">{weekCount}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase mb-2">Este Mes</p>
          <p className="text-3xl font-bold text-white">{monthCount}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase mb-2">vs Mes Anterior</p>
          <div className="flex items-center gap-2">
            {trend ? <HiArrowTrendingUp className="w-5 h-5 text-red-400" /> : <HiArrowTrendingDown className="w-5 h-5 text-green-400" />}
            <p className={`text-2xl font-bold ${trend ? "text-red-400" : "text-green-400"}`}>
              {diff > 0 ? "+" : ""}{diff}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Month Comparison Chart */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Comparación Mensual por Severidad</h2>
          <Bar
            data={{
              labels: sevs.map((s) => sevLabels[s]),
              datasets: [
                { label: "Este Mes", data: thisMonthBySev, backgroundColor: "#6366f1", borderRadius: 4 },
                { label: "Mes Anterior", data: lastMonthBySev, backgroundColor: "#374151", borderRadius: 4 },
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

        {/* Top Areas */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Áreas con Más Incidencias</h2>
          <div className="space-y-3">
            {topAreas.map(([area, count], i) => (
              <div key={area} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-5">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-200">{area}</span>
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (count / incidents.length) * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
