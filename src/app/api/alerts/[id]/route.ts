import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Alert from "@/models/Alert";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();

  const alert = await Alert.findByIdAndUpdate(
    params.id,
    {
      name: body.name,
      condition: body.condition,
      severity: body.severity,
      enabled: body.enabled,
    },
    { new: true, runValidators: true }
  );

  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(alert);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const alert = await Alert.findByIdAndDelete(params.id);
  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
