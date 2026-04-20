import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Incident from "@/models/Incident";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const incidents = await Incident.find().lean();

  const recentCritical = incidents.filter(
    (i) => i.severity === "critical" && (i.status === "open" || i.status === "in_progress")
  ).length;

  let overallStatus: "operational" | "degraded" | "outage" = "operational";
  if (recentCritical >= 3) overallStatus = "outage";
  else if (recentCritical >= 1) overallStatus = "degraded";

  const services = [
    { name: "API Gateway", status: recentCritical >= 3 ? "degraded" : "operational", uptime: 99.95 },
    { name: "Base de Datos", status: "operational", uptime: 99.99 },
    { name: "Autenticación", status: "operational", uptime: 99.98 },
    { name: "Almacenamiento", status: "operational", uptime: 99.97 },
    { name: "CDN", status: "operational", uptime: 99.99 },
    { name: "Cola de Mensajes", status: "operational", uptime: 99.96 },
  ];

  // Response time simulated data (last 24 hours)
  const responseTimeline = [];
  for (let i = 23; i >= 0; i--) {
    const h = new Date();
    h.setHours(h.getHours() - i);
    responseTimeline.push({
      hour: h.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
      ms: Math.floor(40 + Math.random() * 60),
    });
  }

  // Incident impact timeline (last 7 days)
  const impactTimeline = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().slice(0, 10);
    const dayIncidents = incidents.filter(
      (inc) => new Date(inc.createdAt).toISOString().slice(0, 10) === dayStr
    );
    const criticalCount = dayIncidents.filter((inc) => inc.severity === "critical").length;
    impactTimeline.push({
      date: d.toLocaleDateString("es", { weekday: "short", day: "numeric" }),
      incidents: dayIncidents.length,
      critical: criticalCount,
    });
  }

  return NextResponse.json({
    overallStatus,
    uptime: 99.95,
    services,
    responseTimeline,
    impactTimeline,
  });
}
