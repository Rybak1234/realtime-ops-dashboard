"use client";

import { useEffect, useState } from "react";
import { HiBookOpen, HiChevronDown, HiChevronUp, HiClock, HiExclamationTriangle } from "react-icons/hi2";

interface Runbook {
  _id: string;
  title: string;
  category: string;
  severity: string;
  estimatedMinutes: number;
  steps: string[];
}

const severityColor: Record<string, string> = {
  critical: "bg-red-900/50 text-red-300 border-red-700",
  high: "bg-orange-900/50 text-orange-300 border-orange-700",
  medium: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  low: "bg-green-900/50 text-green-300 border-green-700",
};

export default function RunbooksPage() {
  const [runbooks, setRunbooks] = useState<Runbook[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runbooks")
      .then((r) => r.json())
      .then((data) => { setRunbooks(data); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <HiBookOpen className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">Runbooks</h1>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Procedimientos operativos estándar para respuesta a incidencias.
      </p>

      <div className="space-y-3">
        {runbooks.map((rb) => (
          <div key={rb._id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === rb._id ? null : rb._id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-700/50 transition"
            >
              <div className="flex items-center gap-4 flex-1">
                <HiBookOpen className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-white">{rb.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{rb.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${severityColor[rb.severity]}`}>
                      {rb.severity}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <HiClock className="w-3 h-3" /> {rb.estimatedMinutes} min
                    </span>
                  </div>
                </div>
              </div>
              {expanded === rb._id ? (
                <HiChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <HiChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expanded === rb._id && (
              <div className="px-5 pb-5 border-t border-gray-700 pt-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pasos del Procedimiento</h4>
                <ol className="space-y-2">
                  {rb.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-300 pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 p-3 bg-gray-700/30 rounded-lg flex items-center gap-2">
                  <HiExclamationTriangle className="w-4 h-4 text-yellow-400" />
                  <p className="text-xs text-gray-400">Tiempo estimado de ejecución: <span className="text-white font-medium">{rb.estimatedMinutes} minutos</span></p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
