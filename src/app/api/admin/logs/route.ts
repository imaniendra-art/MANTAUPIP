import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ActivityLog } from "@/models/ActivityLog";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
