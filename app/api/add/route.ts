import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ip = searchParams.get('ip');
    const location = searchParams.get('location');
    const name = searchParams.get('name');
    if (!ip) {
      return NextResponse.json({ error: "IP address is required" }, { status: 400 });
    }
    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const backendRes = await fetch(`http://localhost:8080/add?ip=${encodeURIComponent(ip)}&location=${encodeURIComponent(location)}&name=${encodeURIComponent(name)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    
    if (backendRes.ok) {
      const data = await backendRes.text();
      return NextResponse.json({ message: data }, { status: 200 });
    } else {
      const data = await backendRes.text();
      return NextResponse.json({ error: data }, { status: backendRes.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to add IP address" }, { status: 500 });
  }
} 