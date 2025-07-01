import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';

interface IPNodeData {
  label: string;
  ip: string;
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
  const bgColor = isOnline ? 'bg-green-500' : 'bg-red-500';
  const borderColor = isOnline ? 'border-green-600' : 'border-red-600';

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
      className={`px-4 py-2 rounded-lg border-2 ${bgColor} ${borderColor} text-white shadow-lg min-w-[120px] cursor-pointer transition-all duration-200 hover:shadow-xl relative`}
      onDoubleClick={handleDoubleClick}
    >
      {/* Multiple handles for better connectivity */}
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      
      <div className="text-center">
        {isEditing ? (
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={() => {
              setIsEditing(false);
              (data as unknown as IPNodeData).label = label;
            }}
            className="bg-transparent border-none outline-none text-inherit font-semibold text-center w-full text-sm"
            autoFocus
          />
        ) : (
          <div className="text-sm font-semibold">{nodeData.label}</div>
        )}
        <div className="text-xs opacity-90">{nodeData.ip}</div>
        <div className="text-xs opacity-75">{nodeData.location}</div>
        <div className="text-xs opacity-75 capitalize">{nodeData.status}</div>
      </div>
    </div>
  );
});

const AreaNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as AreaNodeData;

  return (
    <div 
      className="w-full h-full rounded-lg border-4 border-dashed flex items-start justify-start p-2 pointer-events-none"
      style={{
        backgroundColor: `${nodeData.color}40`,
        borderColor: `${nodeData.color}`,
        zIndex: -1, // Put areas behind other nodes
      }}
    >
      <NodeResizer
        color={nodeData.color}
        isVisible={selected}
        minWidth={200}
        minHeight={150}
      />
      <span
        className="text-white px-3 py-1 rounded-md text-sm font-bold shadow-lg pointer-events-auto"
        style={{
          backgroundColor: nodeData.color,
        }}
      >
        {nodeData.name}
      </span>
    </div>
  );
});

IPNode.displayName = 'IPNode';
AreaNode.displayName = 'AreaNode';

export const nodeTypes = {
  ip: IPNode,
  area: AreaNode,
};
