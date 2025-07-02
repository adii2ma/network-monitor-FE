"use client";
import React, { useState, useEffect } from "react";

interface LogsData {
  logs: string[];
}

export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data: LogsData = await res.json();
        setLogs(data.logs || []);
        setError("");
      } else {
        setError("Failed to fetch logs");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Refresh every 5 seconds
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Network Logs</h1>
        <p className="text-gray-600 mb-6 text-center">Real-time device status changes and events</p>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading logs...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No logs available yet. Add some devices and wait for status updates.</p>
          </div>
        )}

        {!loading && !error && logs.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="py-2 border-b border-gray-200 last:border-b-0">
                <p className="text-sm font-mono text-gray-800">{log}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 