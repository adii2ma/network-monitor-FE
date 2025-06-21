"use client";
import React, { useState } from "react";

export default function UpdatePage() {
  const [ip, setIp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "add" | "delete") => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`IP ${action === "add" ? "added" : "deleted"} successfully!`);
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Update</h1>
      <p className="text-gray-600 mb-6">Check for updates or manage your network IP addresses below.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <input
          type="text"
          placeholder="Enter IP address"
          value={ip}
          onChange={e => setIp(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full sm:w-64"
        />
        <button
          onClick={() => handleAction("add")}
          disabled={loading || !ip}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Add IP
        </button>
        <button
          onClick={() => handleAction("delete")}
          disabled={loading || !ip}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Remove IP
        </button>
      </div>
      {message && <div className="mt-4 text-md font-medium text-blue-600">{message}</div>}
      <button className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Check for Updates</button>
    </div>
  );
} 