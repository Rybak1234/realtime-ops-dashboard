import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Incident from "@/models/Incident";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const incidents = await Incident.find().lean();

  const assignees = [...new Set(incidents.map((i) => i.assignedTo).filter(Boolean))];

  const members = assignees.map((name) => {
    const assigned = incidents.filter((i) => i.assignedTo === name);
    const resolved = assigned.filter((i) => i.resolvedAt);
    const open = assigned.filter((i) => i.status === "open" || i.status === "in_progress");

    const avgResolutionH =
      resolved.length > 0
        ? resolved.reduce((sum, i) => {
            const diff = new Date(i.resolvedAt!).getTime() - new Date(i.createdAt).getTime();
            return sum + diff / (1000 * 60 * 60);
          }, 0) / resolved.length
        : 0;

    return {
      name,
      totalAssigned: assigned.length,
      resolved: resolved.length,
      open: open.length,
      avgResolutionHours: Math.round(avgResolutionH * 10) / 10,
      criticalHandled: assigned.filter((i) => i.severity === "critical").length,
    };
  });

  members.sort((a, b) => b.resolved - a.resolved);

  return NextResponse.json({ members });
}
