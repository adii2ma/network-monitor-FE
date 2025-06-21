import Image from "next/image";
import { Header } from "./components/header";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
    
      <main className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to Network Monitor</h1>
        <p className="text-lg text-gray-700 mb-6">
          Monitor your network devices, view logs, and keep your system up to date. Use the navigation above to get started.
        </p>
        <div className="flex justify-center gap-8 mt-8">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">Status: Online</span>
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">Devices: 0</span>
        </div>
      </main>
    </div>
  );
}
