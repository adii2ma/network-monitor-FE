import React from "react";

export default function LogsPage() {
  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Logs</h1>
      <p className="text-gray-600 mb-6">Here you can view the latest network logs and events.</p>
      <div className="bg-gray-100 rounded-lg p-6 min-h-[120px] text-gray-500">
        No logs to display yet.
      </div>
    </div>
  );
} 