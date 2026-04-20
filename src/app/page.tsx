"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SeverityChart, AreaChart, TrendChart } from "@/components/Charts";
import {
  HiPlusCircle, HiBell, HiArrowDownTray, HiCheckCircle,
  HiExclamationTriangle, HiArrowPath, HiShieldCheck,
} from "react-icons/hi2";

interface Metrics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  bySeverity: { critical: number; high: number; medium: number; low: number };
  byArea: { area: string; total: number; open: number }[];
  last7Days: { date: string; label: string; count: number }[];
  avgResolutionHours: number;
}

interface Activity {
  _id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
}

const actionIcons: Record<string, React.ReactNode> = {
  incident_created: <HiExclamationTriangle className="w-3.5 h-3.5 text-red-400" />,
  status_changed: <HiArrowPath className="w-3.5 h-3.5 text-yellow-400" />,
  incident_resolved: <HiCheckCircle className="w-3.5 h-3.5 text-green-400" />,
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    fetch("/api/metrics").then((r) => r.json()).then(setMetrics);
    fetch("/api/activity").then((r) => r.json()).then((data) => setActivities(data.slice(0, 5)));
    fetch("/api/alerts").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setAlertCount(data.filter((a: { enabled: boolean }) => a.enabled).length);
    });

    const interval = setInterval(() => {
      fetch("/api/metrics").then((r) => r.json()).then(setMetrics);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Monitoreo Operativo</h1>
          <p className="text-sm text-gray-400">
            Actualización automática cada 30s · Última: {new Date().toLocaleTimeString("es")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-900/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-green-800/30">
            <HiShieldCheck className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            Sistemas Operacionales
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        <Link href="/incidents/new" className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition text-sm">
          <HiPlusCircle className="w-4 h-4" /> Nueva Incidencia
        </Link>
        <Link href="/alerts" className="flex items-center gap-2 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm">
          <HiBell className="w-4 h-4" /> Alertas {alertCount > 0 && <span className="bg-emerald-600 text-white text-xs px-1.5 rounded-full">{alertCount}</span>}
        </Link>
        <a href="/api/export" className="flex items-center gap-2 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm">
          <HiArrowDownTray className="w-4 h-4" /> Exportar CSV
        </a>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
          <p className="text-3xl font-bold text-white">{metrics.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Abiertas</p>
          <p className="text-3xl font-bold text-red-400">{metrics.open}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">En Progreso</p>
          <p className="text-3xl font-bold text-yellow-400">{metrics.inProgress}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Resueltas</p>
          <p className="text-3xl font-bold text-green-400">{metrics.resolved}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Prom. Resolución</p>
          <p className="text-3xl font-bold text-indigo-400">{metrics.avgResolutionHours}h</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Por Severidad</h2>
          <SeverityChart data={metrics.bySeverity} />
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Tendencia - Últimos 7 Días</h2>
          <TrendChart data={metrics.last7Days} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Incidencias por Área</h2>
          <AreaChart data={metrics.byArea} />
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300">Actividad Reciente</h2>
            <Link href="/activity" className="text-xs text-emerald-400 hover:underline">Ver todo</Link>
          </div>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Sin actividad reciente</p>
            ) : (
              activities.map((a) => (
                <div key={a._id} className="flex items-start gap-2">
                  <div className="mt-0.5">{actionIcons[a.action] || actionIcons.incident_created}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-300 truncate">{a.description}</p>
                    <p className="text-[10px] text-gray-500">{new Date(a.timestamp).toLocaleString("es")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
