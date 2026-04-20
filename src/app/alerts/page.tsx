"use client";

import { useEffect, useState } from "react";
import { HiBell, HiShieldCheck, HiPlusCircle, HiTrash, HiExclamationTriangle } from "react-icons/hi2";
import toast from "react-hot-toast";

interface Alert {
  _id: string;
  name: string;
  condition: { metric: string; operator: string; threshold: number };
  severity: string;
  enabled: boolean;
  createdAt: string;
}

const severityColor: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-green-400",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", metric: "incidents_critical", operator: ">", threshold: 5, severity: "high" });

  useEffect(() => {
    fetch("/api/alerts").then((r) => r.json()).then(setAlerts);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        condition: { metric: form.metric, operator: form.operator, threshold: form.threshold },
        severity: form.severity,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setAlerts([created, ...alerts]);
      setShowForm(false);
      setForm({ name: "", metric: "incidents_critical", operator: ">", threshold: 5, severity: "high" });
      toast.success("Alerta creada");
    }
  }

  async function toggleEnabled(id: string, enabled: boolean) {
    const res = await fetch(`/api/alerts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    });
    if (res.ok) {
      setAlerts(alerts.map((a) => (a._id === id ? { ...a, enabled: !enabled } : a)));
      toast.success(enabled ? "Alerta desactivada" : "Alerta activada");
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAlerts(alerts.filter((a) => a._id !== id));
      toast.success("Alerta eliminada");
    }
  }

  const metricLabels: Record<string, string> = {
    incidents_critical: "Incidencias críticas",
    incidents_total: "Total incidencias",
    response_time_ms: "Tiempo de respuesta (ms)",
    cpu_usage: "Uso de CPU (%)",
    error_rate: "Tasa de errores (%)",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HiBell className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Alertas</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition text-sm"
        >
          <HiPlusCircle className="w-4 h-4" /> Nueva Alerta
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Crear Regla de Alerta</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm" placeholder="Ej: Alto número de incidencias críticas" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Métrica</label>
              <select value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })} className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm">
                {Object.entries(metricLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="w-20">
                <label className="block text-xs text-gray-400 mb-1">Op.</label>
                <select value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })} className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm">
                  <option value=">">{">"}</option>
                  <option value="<">{"<"}</option>
                  <option value=">=">{">="}</option>
                  <option value="<=">{"<="}</option>
                  <option value="==">{"=="}</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Umbral</label>
                <input type="number" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })} className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Severidad</label>
              <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm">
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-200 text-sm px-4 py-2">Cancelar</button>
            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition text-sm">Crear</button>
          </div>
        </form>
      )}

      {/* Alert Rules */}
      <div className="space-y-3 mb-8">
        {alerts.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <HiShieldCheck className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No hay alertas configuradas</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert._id} className={`bg-gray-800 rounded-xl border ${alert.enabled ? "border-gray-700" : "border-gray-800 opacity-60"} p-5 flex items-center justify-between`}>
              <div className="flex items-center gap-4 flex-1">
                <HiExclamationTriangle className={`w-5 h-5 ${severityColor[alert.severity]}`} />
                <div>
                  <h3 className="text-sm font-medium text-white">{alert.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {metricLabels[alert.condition.metric] || alert.condition.metric} {alert.condition.operator} {alert.condition.threshold}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${severityColor[alert.severity]} bg-gray-700`}>
                  {alert.severity}
                </span>
                <button
                  onClick={() => toggleEnabled(alert._id, alert.enabled)}
                  className={`relative w-10 h-5 rounded-full transition ${alert.enabled ? "bg-emerald-600" : "bg-gray-600"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${alert.enabled ? "left-5" : "left-0.5"}`} />
                </button>
                <button onClick={() => handleDelete(alert._id)} className="text-gray-500 hover:text-red-400 transition">
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert History */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Historial de Alertas</h2>
        <div className="space-y-2">
          {alerts.filter((a) => a.enabled).slice(0, 5).map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${a.severity === "critical" ? "bg-red-500" : a.severity === "high" ? "bg-orange-500" : "bg-yellow-500"}`} />
                <span className="text-sm text-gray-300">{a.name} disparada</span>
              </div>
              <span className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString("es")}</span>
            </div>
          ))}
          {alerts.filter((a) => a.enabled).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">Sin historial de alertas</p>
          )}
        </div>
      </div>
    </div>
  );
}
