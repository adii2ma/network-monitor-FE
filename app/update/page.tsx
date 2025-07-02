"use client";
import React, { useState } from "react";

export default function UpdatePage() {
  const [ip, setIp] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState(""); // Add name state
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "add" | "delete") => {
    setLoading(true);
    setMessage("");
    
    if (action === "add" && (!ip || !location)) {
      setMessage("Both IP and location are required for adding a device");
      setLoading(false);
      return;
    }
    
    if (action === "delete" && !ip) {
      setMessage("IP address is required for deletion");
      setLoading(false);
      return;
    }
    
    try {
      let url = `/api/${action}`;
      if (action === "add") {
        // Include name in the URL parameters
        const deviceName = name || ip; // Default to IP if no name provided
        url += `?ip=${encodeURIComponent(ip)}&location=${encodeURIComponent(location)}&name=${encodeURIComponent(deviceName)}`;
      } else {
        url += `?ip=${encodeURIComponent(ip)}`;
      }
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        if (action === "add") {
          setMessage(`Device "${name || ip}" (${ip}) added successfully with location: ${location}!`);
          setIp("");
          setLocation("");
          setName(""); // Clear name field
        } else {
          setMessage(`IP ${ip} deleted successfully!`);
          setIp("");
        }
      } else {
        const data = await res.json();
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setMessage("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Update</h1>
      <p className="text-gray-600 mb-6">Check for updates or manage your network IP addresses below.</p>
      
      {/* Add/Remove IP Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add/Remove IP Address</h2>
        <div className="flex flex-col gap-4 justify-center items-center mb-6">
          <div className="flex flex-col gap-4 w-full">
            <input
              type="text"
              placeholder="Enter IP address"
              value={ip}
              onChange={e => setIp(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder="Enter device name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder="Enter location (required for adding)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleAction("add")}
              disabled={loading || !ip || !location}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Add Device
            </button>
            <button
              onClick={() => handleAction("delete")}
              disabled={loading || !ip}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Remove Device
            </button>
          </div>
        </div>
      </div>

      {message && <div className="mt-4 text-md font-medium text-blue-600">{message}</div>}
      <button className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Check for Updates</button>
    </div>
  );
}