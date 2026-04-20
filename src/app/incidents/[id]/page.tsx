"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft, HiPencilSquare, HiCheck, HiXMark, HiClock, HiUser, HiExclamationTriangle, HiChatBubbleLeft } from "react-icons/hi2";
import toast from "react-hot-toast";

interface Incident {
  _id: string;
  title: string;
  description: string;
  area: string;
  severity: string;
  status: string;
  assignedTo: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const severityColor: Record<string, string> = {
  critical: "bg-red-900/50 text-red-300 border-red-700",
  high: "bg-orange-900/50 text-orange-300 border-orange-700",
  medium: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  low: "bg-green-900/50 text-green-300 border-green-700",
};

const statusColor: Record<string, string> = {
  open: "bg-red-500/20 text-red-300",
  in_progress: "bg-yellow-500/20 text-yellow-300",
  resolved: "bg-green-500/20 text-green-300",
  closed: "bg-gray-500/20 text-gray-400",
};

const statusLabel: Record<string, string> = {
  open: "Abierta",
  in_progress: "En Progreso",
  resolved: "Resuelta",
  closed: "Cerrada",
};

const severityLabel: Record<string, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", area: "", severity: "", status: "", assignedTo: "" });
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ text: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/incidents/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setIncident(data);
        setForm({
          title: data.title,
          description: data.description,
          area: data.area,
          severity: data.severity,
          status: data.status,
          assignedTo: data.assignedTo || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  async function handleSave() {
    const res = await fetch(`/api/incidents/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setIncident(updated);
      setEditing(false);
      toast.success("Incidencia actualizada");
    } else {
      toast.error("Error al actualizar");
    }
  }

  function addComment() {
    if (!comment.trim()) return;
    setComments([{ text: comment, time: new Date().toISOString() }, ...comments]);
    setComment("");
    toast.success("Comentario agregado");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg">Incidencia no encontrada</p>
        <Link href="/incidents" className="text-emerald-400 hover:underline mt-4 inline-block">Volver a incidencias</Link>
      </div>
    );
  }

  const timeline = [
    { action: "Creada", time: incident.createdAt, icon: <HiExclamationTriangle className="w-4 h-4" /> },
    ...(incident.status !== "open"
      ? [{ action: "En Progreso", time: incident.updatedAt, icon: <HiClock className="w-4 h-4" /> }]
      : []),
    ...(incident.resolvedAt
      ? [{ action: incident.status === "closed" ? "Cerrada" : "Resuelta", time: incident.resolvedAt, icon: <HiCheck className="w-4 h-4" /> }]
      : []),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/incidents" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition mb-6">
        <HiArrowLeft className="w-4 h-4" /> Volver a incidencias
      </Link>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {editing ? (
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 w-full text-lg font-bold"
              />
            ) : (
              <h1 className="text-xl font-bold text-white">{incident.title}</h1>
            )}
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className="flex items-center gap-1 text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition ml-4"
          >
            {editing ? <><HiCheck className="w-4 h-4" /> Guardar</> : <><HiPencilSquare className="w-4 h-4" /> Editar</>}
          </button>
          {editing && (
            <button onClick={() => setEditing(false)} className="ml-2 text-gray-400 hover:text-red-400 transition">
              <HiXMark className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${severityColor[incident.severity]}`}>
            {severityLabel[incident.severity]}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[incident.status]}`}>
            {statusLabel[incident.status]}
          </span>
        </div>

        {editing ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Área</label>
              <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm">
                {["Infraestructura", "Aplicaciones", "Redes", "Seguridad", "Base de Datos", "Soporte"].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
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
            <div>
              <label className="block text-xs text-gray-400 mb-1">Estado</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm">
                <option value="open">Abierta</option>
                <option value="in_progress">En Progreso</option>
                <option value="resolved">Resuelta</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Asignado a</label>
              <input
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            <p className="text-sm text-gray-300">{incident.description || "Sin descripción"}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <HiUser className="w-4 h-4" /> <span>Asignado: <span className="text-gray-200">{incident.assignedTo || "Sin asignar"}</span></span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <HiClock className="w-4 h-4" /> <span>Área: <span className="text-gray-200">{incident.area}</span></span>
              </div>
              <div className="text-gray-400">Creada: <span className="text-gray-200">{new Date(incident.createdAt).toLocaleString("es")}</span></div>
              {incident.resolvedAt && (
                <div className="text-gray-400">Resuelta: <span className="text-gray-200">{new Date(incident.resolvedAt).toLocaleString("es")}</span></div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Línea de Tiempo</h2>
        <div className="space-y-4">
          {timeline.map((t, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-emerald-400 flex-shrink-0">
                {t.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">{t.action}</p>
                <p className="text-xs text-gray-500">{new Date(t.time).toLocaleString("es")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <HiChatBubbleLeft className="w-4 h-4" /> Comentarios
        </h2>
        <div className="flex gap-2 mb-4">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
            placeholder="Agregar un comentario..."
            className="flex-1 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <button onClick={addComment} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition text-sm">
            Enviar
          </button>
        </div>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">Sin comentarios aún</p>
        ) : (
          <div className="space-y-3">
            {comments.map((c, i) => (
              <div key={i} className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-200">{c.text}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(c.time).toLocaleString("es")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
