"use client";
import { useState, useEffect } from "react";

interface DeviceStatus {
  online: string;
  last_seen: string;
}

interface StatusData {
  [ip: string]: DeviceStatus;
}

export default function Home() {
  const [devices, setDevices] = useState<StatusData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const data = await res.json();
        setDevices(data);
        setError("");
      } else {
        setError("Failed to fetch device status");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh every 2 seconds
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto mt-16 p-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">My Network</h1>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading devices...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && Object.keys(devices).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No devices found. Add some IP addresses in the Update section.</p>
            </div>
          )}

          {!loading && !error && Object.keys(devices).length > 0 && (
            <div className="grid gap-4">
              {Object.entries(devices).map(([ip, status]) => (
                <div key={ip} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{ip}</h3>
                    <p className="text-sm text-gray-600">
                      Last seen: {formatLastSeen(status.last_seen)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      status.online === "true" ? "bg-green-500" : "bg-red-500"
                    }`}></span>
                    <span className={`font-medium ${
                      status.online === "true" ? "text-green-600" : "text-red-600"
                    }`}>
                      {status.online === "true" ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
