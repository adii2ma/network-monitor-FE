import React, { useState } from 'react';

interface ControlPanelProps {
  onAddNode: (nodeData: { label: string; ip: string; location: string; status: 'online' | 'offline' }) => void;
  showAreas: boolean;
  onToggleAreas: () => void;
  onResetLayout?: () => void;
  isPlacementMode?: boolean;
  onTogglePlacementMode?: () => void;
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
  onTogglePlacementMode 
}) => {
  const [label, setLabel] = useState('');
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState<string>('VLAN-1');
  const [status, setStatus] = useState<'online' | 'offline'>('online');

  const handleAddNode = () => {
    if (label.trim() && ip.trim()) {
      onAddNode({
        label: label.trim(),
        ip: ip.trim(),
        location,
        status
      });
      setLabel('');
      setIp('');
    }
  };

  return (
    <div className="bg-gray-900 p-3 rounded-lg shadow-lg min-w-[250px] border border-gray-200">
      <h3 className="text-base font-bold mb-3 text-white">
        Network Controls
      </h3>
      
      <div className="mb-3">
        <h4 className="text-xs font-semibold mb-2 text-white">
          Add IP Device
        </h4>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Device name"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-2 py-1.5 border border-white rounded text-xs focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="IP Address"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="VLAN-1">VLAN-1</option>
              <option value="VLAN 100">VLAN 100</option>
              <option value="VLAN 200">VLAN 200</option>
              <option value="VLAN 300">VLAN 300</option>
              <option value="VLAN 400">VLAN 400</option>
              <option value="VLAN 500">VLAN 500</option>
              <option value="VLAN 600">VLAN 600</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'online' | 'offline')}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <button
            onClick={handleAddNode}
            disabled={!label.trim() || !ip.trim()}
            className="w-full px-2 py-1.5 bg-blue-500 text-gray-900 rounded text-xs font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add Device
          </button>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-xs font-semibold mb-2 text-white">
          Network Areas
        </h4>
        <div className="text-xs leading-relaxed space-y-1">
          {areaInfo.map(({ color, icon, name }) => (
            <div key={name} className={`flex items-center gap-2 ${color}`}>
              <span>{icon}</span>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-400">
          Controls
        </h4>
        <div className="text-xs text-gray-400 space-y-1">
          <div>• Select edges & press Del/Backspace</div>
          <div>• Click areas to resize them</div>
          <div>• Drag to connect nodes</div>
        </div>
      </div>

      <button
        onClick={onToggleAreas}
        className={`
          w-full py-1.5 px-2 border rounded text-xs font-semibold transition-all duration-200 mb-2
          ${showAreas 
            ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' 
            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }
        `}
      >
        {showAreas ? 'Hide Areas' : 'Show Areas'}
      </button>

      {onTogglePlacementMode && (
        <button
          onClick={onTogglePlacementMode}
          className={`
            w-full py-1.5 px-2 border rounded text-xs font-semibold transition-all duration-200 mb-2
            ${isPlacementMode 
              ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200' 
              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          {isPlacementMode ? 'Exit Placement Mode' : 'Manual Placement Mode'}
        </button>
      )}

      {onResetLayout && (
        <button
          onClick={onResetLayout}
          className="w-full py-1.5 px-2 border border-red-300 rounded text-xs font-semibold transition-all duration-200 text-red-600 hover:bg-red-50"
        >
          Reset Layout
        </button>
      )}
    </div>
  );
};

export default ControlPanel;
