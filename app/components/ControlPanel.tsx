import React, { useState } from 'react';

interface ControlPanelProps {
  onAddNode: (nodeData: { label: string; ip: string; name: string; location: string; status: 'online' | 'offline' }) => void;
  showAreas: boolean;
  onToggleAreas: () => void;
  onResetLayout?: () => void;
  isPlacementMode?: boolean;
  onTogglePlacementMode?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const areaInfo = [
  { color: 'text-blue-600', icon: '🔵', name: 'VLAN-1' },
  { color: 'text-red-600', icon: '🔴', name: 'VLAN 100' },
  { color: 'text-green-600', icon: '🟢', name: 'VLAN 200' },
  { color: 'text-yellow-600', icon: '🟤', name: 'VLAN 300' },
  { color: 'text-purple-600', icon: '🟣', name: 'VLAN 400' },
  { color: 'text-orange-600', icon: '🟠', name: 'VLAN 500' },
  { color: 'text-pink-600', icon: '🩷', name: 'VLAN 600' },
];

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onAddNode, 
  showAreas, 
  onToggleAreas, 
  onResetLayout, 
  isPlacementMode = false, 
  onTogglePlacementMode,
  isOpen,
  onToggle
}) => {
  const [label, setLabel] = useState('');
  const [ip, setIp] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState<string>('VLAN-1');
  const [status, setStatus] = useState<'online' | 'offline'>('online');

  const handleAddNode = () => {
    if (label.trim() && ip.trim()) {
      const deviceName = name.trim() || label.trim();
      onAddNode({
        label: deviceName,
        ip: ip.trim(),
        name: deviceName,
        location,
        status
      });
      setLabel('');
      setIp('');
      setName('');
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
                placeholder="Device Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
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
              
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'online' | 'offline')}
                className="w-full px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              
              <button
                onClick={handleAddNode}
                disabled={!label.trim() || !ip.trim()}
                className="w-full py-2 px-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Device
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-3 text-white">VLAN Areas</h4>
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
