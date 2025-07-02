import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendRes = await fetch("http://localhost:8080/status", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!backendRes.ok) {
      return NextResponse.json({ error: "Failed to fetch status" }, { status: backendRes.status });
    }
    
    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
} 