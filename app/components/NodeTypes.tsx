import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';

interface IPNodeData {
  label: string;
  ip: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
}

interface AreaNodeData {
  name: string;
  color: string;
}

const IPNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as IPNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(nodeData.label);

  const isOnline = nodeData.status === 'online';
  const bgColor = isOnline ? 'bg-emerald-500' : 'bg-rose-500';
  const borderColor = isOnline ? 'border-emerald-400' : 'border-rose-400';
  const shadowColor = isOnline ? 'shadow-emerald-200' : 'shadow-rose-200';

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      (data as unknown as IPNodeData).label = label;
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLabel(nodeData.label);
    }
  };

  return (
    <div 
      className={`px-3 py-2 rounded-xl border-2 ${bgColor} ${borderColor} text-white shadow-lg ${shadowColor} min-w-[100px] max-w-[120px] cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 relative group`}
      onDoubleClick={handleDoubleClick}
      title={`IP: ${nodeData.ip}\nLocation: ${nodeData.location}\nName: ${nodeData.name}\nStatus: ${nodeData.status}`}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-white border-2 border-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-white border-2 border-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="w-2 h-2 bg-white border-2 border-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-white border-2 border-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      <div className="text-center">
        {/* Status indicator */}
        <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${isOnline ? 'bg-white' : 'bg-gray-300'} shadow-sm`} />
        
        {/* Node content */}
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={() => setIsEditing(false)}
            className="bg-transparent text-white text-xs font-medium text-center outline-none border-b border-white/50 w-full"
            autoFocus
          />
        ) : (
          <div className="text-xs font-medium truncate">
            {nodeData.name || nodeData.label}
          </div>
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        <div className="font-semibold">{nodeData.name}</div>
        <div>IP: {nodeData.ip}</div>
        <div>Location: {nodeData.location}</div>
        <div className={`font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
});

const AreaNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as AreaNodeData;

  return (
    <div 
      className="w-full h-full rounded-2xl border-4 border-dashed flex items-start justify-start p-4 relative overflow-hidden"
      style={{
        backgroundColor: `${nodeData.color}15`,
        borderColor: `${nodeData.color}`,
      }}
    >
      <NodeResizer
        color={nodeData.color}
        isVisible={true}
        minWidth={300}
        minHeight={200}
        handleStyle={{
          backgroundColor: nodeData.color,
          border: '2px solid white',
          borderRadius: '50%',
          width: '12px',
          height: '12px',
        }}
      />
      <div
        className="text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg border-2 border-white/20"
        style={{
          backgroundColor: nodeData.color,
        }}
      >
        {nodeData.name}
      </div>
    </div>
  );
});

IPNode.displayName = 'IPNode';
AreaNode.displayName = 'AreaNode';

export const nodeTypes = {
  ip: IPNode,
  area: AreaNode,
};