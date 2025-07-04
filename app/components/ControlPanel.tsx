import React, { useState } from 'react';

interface ControlPanelProps {
  onAddNode: (nodeData: { ip: string; name: string; location: string; status: 'online' | 'offline' }) => void;
  onDeleteNode?: (ip: string) => void;
  showAreas: boolean;
  onToggleAreas: () => void;
  onResetLayout?: () => void;
  isPlacementMode?: boolean;
  onTogglePlacementMode?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const areaInfo = [
  { color: 'text-blue-600', icon: '🔵', name: 'PGCIL' },
  { color: 'text-red-600', icon: '🔴', name: 'Sophos' },
  { color: 'text-green-600', icon: '🟢', name: 'Hop Bung' },
  { color: 'text-yellow-600', icon: '🟤', name: 'SSC Build' },
  { color: 'text-purple-600', icon: '🟣', name: 'Plant Area' },
  { color: 'text-orange-600', icon: '🟠', name: 'IT Dept' },
  { color: 'text-pink-600', icon: '🩷', name: 'Admin Build' },
  { color: 'text-emerald-600', icon: '�', name: 'Sankalp #2' },
  { color: 'text-sky-600', icon: '�', name: 'Township' },
  { color: 'text-amber-600', icon: '�', name: 'ET-Hostel' },
  { color: 'text-indigo-600', icon: '�', name: 'RLI Office' },
];

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onAddNode, 
  onDeleteNode,
  showAreas, 
  onToggleAreas, 
  onResetLayout, 
  isPlacementMode = false, 
  onTogglePlacementMode,
  isOpen,
  onToggle
}) => {
  const [ip, setIp] = useState('');
  const [name, setName] = useState('');
  const [deleteIp, setDeleteIp] = useState('');
  const [location, setLocation] = useState<string>('PGCIL');

  const handleAddNode = () => {
    if (ip.trim()) {
      const deviceName = name.trim();
      onAddNode({
        ip: ip.trim(),
        name: deviceName,
        location,
        status: 'online'
      });
      setIp('');
      setName('');
    }
  };

  const handleDeleteNode = async () => {
    if (!deleteIp.trim()) return;
    
    try {
      const res = await fetch(`/api/delete?ip=${encodeURIComponent(deleteIp.trim())}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        // Call the onDeleteNode callback if provided
        if (onDeleteNode) {
          onDeleteNode(deleteIp.trim());
        }
        setDeleteIp('');
        // You could add a success message here if needed
      } else {
        const data = await res.json();
        console.error('Delete failed:', data.error);
        // You could add error handling UI here
      }
    } catch (error) {
      console.error('Network error during delete:', error);
      // You could add error handling UI here
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-20 right-4 z-60 bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-2xl hover:scale-105 transform transition-all duration-300"
      >
        <svg 
          className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 h-full overflow-y-auto">
          <h3 className="text-lg font-bold mb-4 text-white border-b border-gray-700 pb-2">
            Network Controls
          </h3>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-3 text-white">
              Add IP Device
            </h4>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="IP Address"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <input
                type="text"
                placeholder="Device Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {areaInfo.map(area => (
                  <option key={area.name} value={area.name}>{area.name}</option>
                ))}
              </select>
              
              <button
                onClick={handleAddNode}
                disabled={!ip.trim()}
                className="w-full py-2 px-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Device
              </button>
            </div>
          </div>

          {/* Delete Device Section */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-3 text-white">
              Delete Device
            </h4>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="IP Address to delete"
                value={deleteIp}
                onChange={(e) => setDeleteIp(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              
              <button
                onClick={handleDeleteNode}
                disabled={!deleteIp.trim()}
                className="w-full py-2 px-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Device
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-3 text-white">Areas</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {areaInfo.map((area) => (
                <div key={area.name} className={`${area.color} flex items-center gap-2 p-2 rounded-lg bg-gray-800`}>  
                  <span className="text-lg">{area.icon}</span>
                  <span>{area.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-3 text-white">Instructions</h4>
            <div className="text-sm text-gray-400 space-y-2 bg-gray-800 p-3 rounded-lg">
              <div>• Select edges & press Del/Backspace</div>
              <div>• Drag areas to resize them</div>
              <div>• Drag to connect nodes</div>
              <div>• Hover nodes to see details</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onToggleAreas}
              className={`w-full py-2 px-3 border rounded-lg text-sm font-semibold transition-all duration-200 ${
                showAreas 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {showAreas ? 'Hide Areas' : 'Show Areas'}
            </button>

            {onTogglePlacementMode && (
              <button
                onClick={onTogglePlacementMode}
                className={`w-full py-2 px-3 border rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isPlacementMode 
                    ? 'bg-green-600 border-green-500 text-white hover:bg-green-700' 
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {isPlacementMode ? 'Exit Placement Mode' : 'Manual Placement Mode'}
              </button>
            )}

            {onResetLayout && (
              <button
                onClick={onResetLayout}
                className="w-full py-2 px-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset Layout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
