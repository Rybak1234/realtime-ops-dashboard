"use client";

import { useState } from "react";
import { HiCog6Tooth, HiSun, HiMoon, HiGlobeAlt, HiBell, HiShieldCheck } from "react-icons/hi2";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appName: "OpsBoard",
    timezone: "America/La_Paz",
    theme: "dark",
    emailNotifications: true,
    pushNotifications: false,
    slackNotifications: true,
    criticalAlerts: true,
    weeklyReport: true,
    slaResponseCritical: 1,
    slaResolveCritical: 4,
    slaResponseHigh: 4,
    slaResolveHigh: 24,
    slaResponseMedium: 8,
    slaResolveMedium: 48,
    slaResponseLow: 24,
    slaResolveLow: 72,
  });

  function handleSave() {
    toast.success("Configuración guardada (local)");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <HiCog6Tooth className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
      </div>

      {/* General Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <HiCog6Tooth className="w-4 h-4" /> General
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nombre de la Aplicación</label>
            <input
              value={settings.appName}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
              <HiGlobeAlt className="w-3 h-3" /> Zona Horaria
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            >
              <option value="America/La_Paz">America/La_Paz (BOT)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Chicago">America/Chicago (CST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Madrid">Europe/Madrid (CET)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tema</label>
            <div className="flex gap-3">
              <button
                onClick={() => setSettings({ ...settings, theme: "dark" })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                  settings.theme === "dark" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <HiMoon className="w-4 h-4" /> Oscuro
              </button>
              <button
                onClick={() => setSettings({ ...settings, theme: "light" })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                  settings.theme === "light" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <HiSun className="w-4 h-4" /> Claro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <HiBell className="w-4 h-4" /> Notificaciones
        </h2>
        <div className="space-y-3">
          {[
            { key: "emailNotifications" as const, label: "Notificaciones por Email" },
            { key: "pushNotifications" as const, label: "Notificaciones Push" },
            { key: "slackNotifications" as const, label: "Notificaciones Slack" },
            { key: "criticalAlerts" as const, label: "Alertas Críticas Inmediatas" },
            { key: "weeklyReport" as const, label: "Reporte Semanal" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">{item.label}</span>
              <button
                onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                className={`relative w-10 h-5 rounded-full transition ${settings[item.key] ? "bg-emerald-600" : "bg-gray-600"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings[item.key] ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Configuration */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <HiShieldCheck className="w-4 h-4" /> Configuración SLA (horas)
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-xs text-gray-500 font-semibold uppercase pt-2">Severidad</div>
          <div className="text-xs text-gray-500 font-semibold uppercase pt-2">Respuesta</div>
          <div className="text-xs text-gray-500 font-semibold uppercase pt-2">Resolución</div>

          {(["Critical", "High", "Medium", "Low"] as const).map((sev) => (
            <>
              <div key={`label-${sev}`} className="text-sm text-gray-300 flex items-center">{sev}</div>
              <input
                key={`resp-${sev}`}
                type="number"
                value={settings[`slaResponse${sev}` as keyof typeof settings] as number}
                onChange={(e) => setSettings({ ...settings, [`slaResponse${sev}`]: Number(e.target.value) })}
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-1.5 text-sm w-full"
              />
              <input
                key={`res-${sev}`}
                type="number"
                value={settings[`slaResolve${sev}` as keyof typeof settings] as number}
                onChange={(e) => setSettings({ ...settings, [`slaResolve${sev}`]: Number(e.target.value) })}
                className="bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-3 py-1.5 text-sm w-full"
              />
            </>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  );
}
