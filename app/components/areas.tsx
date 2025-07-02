import React, { memo } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';

export interface Area {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AreaNodeData {
  name: string;
  color: string;
}

const AreaNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as AreaNodeData;

  return (
    <div 
      className="w-full h-full rounded-lg border-4 border-dashed flex items-start justify-start p-2"
      style={{
        backgroundColor: `${nodeData.color}40`,
        borderColor: `${nodeData.color}`,
      }}
    >
      <NodeResizer
        color={nodeData.color}
        isVisible={true}
        minWidth={200}
        minHeight={150}
      />
      <span
        className="text-white px-3 py-1 rounded-md text-sm font-bold shadow-lg"
        style={{
          backgroundColor: nodeData.color,
        }}
      >
        {nodeData.name}
      </span>
    </div>
  );
});

AreaNode.displayName = 'AreaNode';

export const areaNodeTypes = {
  area: AreaNode,
};

// Convert areas to area nodes
export const createAreaNodes = (areas: Area[]) => {
  return areas.map(area => ({
    id: area.id,
    type: 'area',
    data: {
      name: area.name,
      color: area.color,
    },
    position: { x: area.x, y: area.y },
    style: {
      width: area.width,
      height: area.height,
    },
    draggable: false,
    selectable: true,
    deletable: false,
  }));
};
