import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ip } = await req.json();
    if (!ip) {
      return NextResponse.json({ error: "IP address is required" }, { status: 400 });
    }
    const backendRes = await fetch(`http://localhost:8080/delete?ip=${encodeURIComponent(ip)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete IP address" }, { status: 500 });
  }
} 