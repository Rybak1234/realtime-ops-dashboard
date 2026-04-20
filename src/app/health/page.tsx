"use client";

import { useEffect, useState } from "react";
import { HiServerStack, HiSignal, HiCheckCircle, HiExclamationCircle, HiXCircle } from "react-icons/hi2";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface HealthData {
  overallStatus: "operational" | "degraded" | "outage";
  uptime: number;
  services: { name: string; status: string; uptime: number }[];
  responseTimeline: { hour: string; ms: number }[];
  impactTimeline: { date: string; incidents: number; critical: number }[];
}

const statusConfig = {
  operational: { label: "Operacional", color: "text-green-400", bg: "bg-green-500", icon: HiCheckCircle },
  degraded: { label: "Degradado", color: "text-yellow-400", bg: "bg-yellow-500", icon: HiExclamationCircle },
  outage: { label: "Interrupción", color: "text-red-400", bg: "bg-red-500", icon: HiXCircle },
};

export default function HealthPage() {
  const [data, setData] = useState<HealthData | null>(null);

  useEffect(() => {
    fetch("/api/health").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  const status = statusConfig[data.overallStatus];
  const StatusIcon = status.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <HiServerStack className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">Estado del Sistema</h1>
      </div>

      {/* Overall Status Banner */}
      <div className={`bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <StatusIcon className={`w-10 h-10 ${status.color}`} />
          <div>
            <h2 className={`text-xl font-bold ${status.color}`}>{status.label}</h2>
            <p className="text-sm text-gray-400">Todos los sistemas monitoreados</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{data.uptime}%</p>
          <p className="text-xs text-gray-400">Uptime (30 días)</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {data.services.map((svc) => {
          const svcStatus = statusConfig[svc.status as keyof typeof statusConfig] || statusConfig.operational;
          const SvcIcon = svcStatus.icon;
          return (
            <div key={svc.name} className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex items-center gap-3">
              <SvcIcon className={`w-6 h-6 ${svcStatus.color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{svc.name}</p>
                <p className={`text-xs ${svcStatus.color}`}>{svcStatus.label}</p>
              </div>
              <span className="text-xs text-gray-500">{svc.uptime}%</span>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <HiSignal className="w-4 h-4" /> Tiempo de Respuesta (24h)
          </h2>
          <Line
            data={{
              labels: data.responseTimeline.map((d) => d.hour),
              datasets: [{
                label: "ms",
                data: data.responseTimeline.map((d) => d.ms),
                borderColor: "#10b981",
                backgroundColor: "rgba(16,185,129,0.1)",
                fill: true,
                tension: 0.3,
                pointRadius: 2,
              }],
            }}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: "#9ca3af", font: { size: 11 } } } },
              scales: {
                x: { ticks: { color: "#9ca3af", maxTicksLimit: 8 }, grid: { color: "#374151" } },
                y: { ticks: { color: "#9ca3af" }, grid: { color: "#374151" } },
              },
            }}
          />
        </div>

        {/* Incident Impact Timeline */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Impacto de Incidencias (7 días)</h2>
          <Line
            data={{
              labels: data.impactTimeline.map((d) => d.date),
              datasets: [
                {
                  label: "Total",
                  data: data.impactTimeline.map((d) => d.incidents),
                  borderColor: "#6366f1",
                  backgroundColor: "rgba(99,102,241,0.1)",
                  fill: true,
                  tension: 0.3,
                  pointRadius: 4,
                },
                {
                  label: "Críticas",
                  data: data.impactTimeline.map((d) => d.critical),
                  borderColor: "#ef4444",
                  backgroundColor: "rgba(239,68,68,0.1)",
                  fill: true,
                  tension: 0.3,
                  pointRadius: 4,
                },
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
      </div>
    </div>
  );
}
