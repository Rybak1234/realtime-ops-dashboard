import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Incident from "@/models/Incident";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const incidents = await Incident.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const activities: Record<string, unknown>[] = [];

  for (const inc of incidents) {
    const i = inc as Record<string, unknown>;
    activities.push({
      _id: `act-create-${i._id}`,
      action: "incident_created",
      description: `Incidencia creada: "${i.title}"`,
      user: (i.assignedTo as string) || "Sistema",
      area: i.area,
      severity: i.severity,
      incidentId: i._id,
      timestamp: i.createdAt,
    });

    if (i.status === "in_progress") {
      activities.push({
        _id: `act-progress-${i._id}`,
        action: "status_changed",
        description: `"${i.title}" cambiado a En Progreso`,
        user: i.assignedTo || "Sistema",
        area: i.area,
        severity: i.severity,
        incidentId: i._id,
        timestamp: i.updatedAt,
      });
    }

    if (i.status === "resolved" || i.status === "closed") {
      activities.push({
        _id: `act-resolved-${i._id}`,
        action: "incident_resolved",
        description: `"${i.title}" ${i.status === "resolved" ? "resuelta" : "cerrada"}`,
        user: i.assignedTo || "Sistema",
        area: i.area,
        severity: i.severity,
        incidentId: i._id,
        timestamp: i.resolvedAt || i.updatedAt,
      });
    }
  }

  activities.sort((a, b) => new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime());

  return NextResponse.json(activities.slice(0, 100));
}
