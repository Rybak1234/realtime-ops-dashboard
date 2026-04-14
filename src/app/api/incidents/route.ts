import { NextRequest, NextResponse } from "next/server";
import { findAll, create } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const area = searchParams.get("area");
  const severity = searchParams.get("severity");

  const filter: Record<string, string> = {};
  if (status) filter.status = status;
  if (area) filter.area = area;
  if (severity) filter.severity = severity;

  const incidents = findAll(filter);
  return NextResponse.json(incidents);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const incident = create({
    title: body.title,
    description: body.description || "",
    area: body.area,
    severity: body.severity || "medium",
    status: body.status || "open",
    assignedTo: body.assignedTo || "",
  });

  return NextResponse.json(incident, { status: 201 });
}
