"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewIncidentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      description: form.get("description"),
      area: form.get("area"),
      severity: form.get("severity"),
      assignedTo: form.get("assignedTo"),
    };

    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success('Incidencia registrada');
      router.push("/incidents");
      router.refresh();
    } else {
      setSaving(false);
      toast.error("Error al registrar incidencia");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Nueva Incidencia</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
          <input
            name="title"
            required
            className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Descripción breve de la incidencia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
          <textarea
            name="description"
            rows={4}
            className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-y"
            placeholder="Detalles de la incidencia..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Área</label>
            <select
              name="area"
              required
              className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">Seleccionar</option>
              <option value="Infraestructura">Infraestructura</option>
              <option value="Aplicaciones">Aplicaciones</option>
              <option value="Redes">Redes</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Base de Datos">Base de Datos</option>
              <option value="Soporte">Soporte</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Severidad</label>
            <select
              name="severity"
              className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="low">Baja</option>
              <option value="medium" selected>Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Asignado a</label>
          <input
            name="assignedTo"
            className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Nombre del responsable"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Registrando..." : "Registrar Incidencia"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/incidents")}
            className="border border-gray-600 text-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-700 transition text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
