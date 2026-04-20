import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Incident from "@/models/Incident";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const incidents = await Incident.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const notifications = incidents.map((inc: Record<string, unknown>) => ({
    _id: `notif-${inc._id}`,
    type: (inc.severity === "critical" || inc.severity === "high") ? "alert" : "incident",
    title: `Incidencia: ${inc.title}`,
    message: `${inc.severity === "critical" ? "CRÍTICA" : inc.severity === "high" ? "ALTA" : inc.severity === "medium" ? "MEDIA" : "BAJA"} - ${inc.area}`,
    severity: inc.severity,
    read: inc.status === "resolved" || inc.status === "closed",
    incidentId: inc._id,
    createdAt: inc.createdAt,
  }));

  return NextResponse.json(notifications);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  // In a real app, we'd persist read state. Here we just acknowledge.
  return NextResponse.json({ success: true, ids: body.ids || [] });
}
