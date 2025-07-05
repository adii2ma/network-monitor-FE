"use client"
import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Node,
  Edge,
  ReactFlowProvider,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Components
import ControlPanel from '../components/ControlPanel';
import { nodeTypes } from '../components/NodeTypes';
import { initialAreas } from '../components/initialData';

// Local storage keys
const NODES_STORAGE_KEY = 'network-monitor-nodes';
const EDGES_STORAGE_KEY = 'network-monitor-edges';

// Utility functions for persistence
const saveToStorage = (key: string, data: Node[] | Edge[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

// Types
interface DeviceData {
  online: string;
  location?: string;
  name?: string;
}

interface DeviceStatusResponse {
  [ip: string]: DeviceData;
}

export interface Area {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Utility function to fetch device data and create nodes
const fetchDeviceData = async () => {
  try {
    const response = await fetch('/api/status');
    const deviceData: DeviceStatusResponse = await response.json();
    
    console.log('Fetched device data:', deviceData);
    
    if (!deviceData || Object.keys(deviceData).length === 0) {
      console.log('No devices found from API');
      return [];
    }
    
    const devices = Object.entries(deviceData).map(([ip, data], index: number) => {
      const location = data.location && data.location !== 'Location not set' ? data.location : null;
      const area = location ? initialAreas.find(a => a.name === location) : null;
      
      console.log(`Processing device ${ip}:`, { location, area: area?.name });
      
      let x, y;
      if (area) {
        const devicesInSameArea = Object.entries(deviceData).filter(([, d]) => 
          d.location === location
        );
        const areaIndex = devicesInSameArea.findIndex(([deviceIp]) => deviceIp === ip);
        
        // Calculate optimal nodes per row based on area width
        const nodeWidth = 120; // Approximate width of each node including spacing
        const areaPadding = 100; // Left and right padding within area
        const availableWidth = area.width - areaPadding;
        const nodesPerRow = Math.max(1, Math.floor(availableWidth / nodeWidth));
        
        // Calculate position within the area
        const row = Math.floor(areaIndex / nodesPerRow);
        const col = areaIndex % nodesPerRow;
        
        // Position nodes with proper spacing and ensure they stay within area bounds
        const startX = area.x + 50; // Left padding
        const startY = area.y + 80; // Top padding for area title
        const spacingX = Math.min(nodeWidth, availableWidth / nodesPerRow);
        const spacingY = 70; // Vertical spacing between rows
        
        x = startX + col * spacingX;
        y = startY + row * spacingY;
        
        // Ensure node doesn't exceed area boundaries
        const maxX = area.x + area.width - 100; // Right boundary with padding
        const maxY = area.y + area.height - 60; // Bottom boundary with padding
        
        if (x > maxX) {
          x = maxX;
        }
        if (y > maxY) {
          y = maxY;
        }
        
      } else {
        // For devices without a specific area
        // For devices without a specific area
        x = 600 + (index % 3) * 150;
        y = 50 + Math.floor(index / 3) * 80;
      }
      
      const deviceName = data.name && data.name !== 'Name not set' ? data.name : ip;
      
      const node = {
        id: `device-${ip}`,
        type: 'ip',
        data: {
          label: deviceName,
          ip: ip,
          name: data.name || ip,
          location: location || 'Unknown',
          status: data.online === 'true' ? 'online' : 'offline'
        },
        position: { x, y }
      };
      
      console.log('Created node:', node);
      return node;
    });
    
    console.log('All devices:', devices);
    return devices;
  } catch (error) {
    console.error('Failed to fetch device data:', error);
    return [];
  }
};

// Create area nodes from initial areas
const createAreaNodes = () => {
  return initialAreas.map(area => ({
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

export default function BroadbandFlow() {
  return (
    <ReactFlowProvider>
      <BroadbandFlowInner />
    </ReactFlowProvider>
  );
}

function BroadbandFlowInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [areas] = useState<Area[]>(initialAreas);
  const [showAreas, setShowAreas] = useState(true);
  const [nodeCounter, setNodeCounter] = useState(20);
  const [loading, setLoading] = useState(true);
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [pendingNodeData, setPendingNodeData] = useState<{
     
    ip: string; 
    name: string;
    location: string; 
    status: 'online' | 'offline'
  } | null>(null);

  // Enhanced onConnect with persistence
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);
      saveToStorage(EDGES_STORAGE_KEY, newEdge);
    },
    [edges, setEdges],
  );

  // Enhanced nodes change handler with persistence
  const handleNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      setTimeout(() => {
        setNodes((currentNodes) => {
          saveToStorage(NODES_STORAGE_KEY, currentNodes);
          return currentNodes;
        });
      }, 50);
    },
    [onNodesChange, setNodes],
  );

  // Enhanced edges change handler with persistence and deletion support
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      setTimeout(() => {
        setEdges((currentEdges) => {
          saveToStorage(EDGES_STORAGE_KEY, currentEdges);
          return currentEdges;
        });
      }, 100);
    },
    [onEdgesChange, setEdges],
  );

  // Toggle placement mode
  const handleTogglePlacementMode = useCallback(() => {
    setIsPlacementMode(prev => !prev);
    setPendingNodeData(null);
  }, []);

  // Handle canvas click for manual placement
  const handlePaneClick = useCallback((event: React.MouseEvent) => {
    if (isPlacementMode && pendingNodeData) {
      const newId = `manual-node-${nodeCounter}`;
      const reactFlowBounds = (event.target as Element).closest('.react-flow')?.getBoundingClientRect();
      
      if (reactFlowBounds) {
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        const newNode: Node = {
          id: newId,
          type: 'ip',
          data: pendingNodeData,
          position,
        };

        setNodes((nds) => {
          const updatedNodes = [...nds, newNode];
          saveToStorage(NODES_STORAGE_KEY, updatedNodes);
          return updatedNodes;
        });
        setNodeCounter(prev => prev + 1);
        setPendingNodeData(null);
        setIsPlacementMode(false);
      }
    }
  }, [isPlacementMode, pendingNodeData, nodeCounter, setNodes]);

  // Enhanced addNewNode to support both automatic and manual placement
  const addNewNode = useCallback(async (nodeData: {  ip: string; name: string; location: string; status: 'online' | 'offline' }) => {
    if (isPlacementMode) {
      setPendingNodeData(nodeData);
      return;
    }

    try {
      const response = await fetch(`/api/add?ip=${encodeURIComponent(nodeData.ip)}&location=${encodeURIComponent(nodeData.location)}&name=${encodeURIComponent(nodeData.name)}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to add device to backend:', error);
        return;
      }
      
      const newId = `node-${nodeCounter}`;
      
      const targetArea = areas.find(area => area.name === nodeData.location);
      let x, y;
      
      if (targetArea) {
        // Use similar logic as fetchDeviceData for consistent positioning
        // For new nodes, place them in the next available spot
        const existingNodesInArea = nodes.filter(node => 
          node.type === 'ip' && node.data?.location === nodeData.location
        ).length;
        
        // Calculate optimal nodes per row based on area width
        const nodeWidth = 120;
        const areaPadding = 100;
        const availableWidth = targetArea.width - areaPadding;
        const nodesPerRow = Math.max(1, Math.floor(availableWidth / nodeWidth));
        
        // Calculate position for the new node
        const row = Math.floor(existingNodesInArea / nodesPerRow);
        const col = existingNodesInArea % nodesPerRow;
        
        const startX = targetArea.x + 50;
        const startY = targetArea.y + 80;
        const spacingX = Math.min(nodeWidth, availableWidth / nodesPerRow);
        const spacingY = 70;
        
        x = startX + col * spacingX;
        y = startY + row * spacingY;
        
        // Ensure node doesn't exceed area boundaries
        const maxX = targetArea.x + targetArea.width - 100;
        const maxY = targetArea.y + targetArea.height - 60;
        
        if (x > maxX) x = maxX;
        if (y > maxY) y = maxY;
      } else {
        // Default position for nodes without specific area
        x = 200;
        y = 200;
      }
      
      const newNode: Node = {
        id: newId,
        type: 'ip',
        data: nodeData,
        position: { x, y },
      };
      
      setNodes((nds) => {
        const updatedNodes = [...nds, newNode];
        saveToStorage(NODES_STORAGE_KEY, updatedNodes);
        return updatedNodes;
      });
      setNodeCounter(prev => prev + 1);
      
      setTimeout(() => {
        const loadDeviceData = async () => {
          const deviceNodes = await fetchDeviceData();
          setNodes((currentNodes) => {
            const nonDeviceNodes = currentNodes.filter(node => node.type !== 'ip');
            const updatedNodes = [...nonDeviceNodes, ...deviceNodes] as Node[];
            saveToStorage(NODES_STORAGE_KEY, updatedNodes);
            return updatedNodes;
          });
        };
        loadDeviceData();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  }, [isPlacementMode, nodeCounter, setNodes, areas]);

  // Delete node function
  const deleteNode = useCallback(async (ip: string) => {
    try {
      // Remove the node from the UI immediately
      setNodes((nds) => {
        const updatedNodes = nds.filter(node => {
          if (node.type === 'ip' && node.data?.ip === ip) {
            return false;
          }
          return true;
        });
        saveToStorage(NODES_STORAGE_KEY, updatedNodes);
        return updatedNodes;
      });

      // Refresh device data from backend to ensure sync
      setTimeout(async () => {
        const deviceNodes = await fetchDeviceData();
        setNodes((currentNodes) => {
          const nonDeviceNodes = currentNodes.filter(node => node.type !== 'ip');
          const updatedNodes = [...nonDeviceNodes, ...deviceNodes] as Node[];
          saveToStorage(NODES_STORAGE_KEY, updatedNodes);
          return updatedNodes;
        });
      }, 500);
      
    } catch (error) {
      console.error('Failed to delete device:', error);
    }
  }, [setNodes]);

  const handleToggleAreas = useCallback(() => {
    setShowAreas(prev => !prev);
  }, []);

  const handleResetLayout = useCallback(() => {
    localStorage.removeItem(NODES_STORAGE_KEY);
    localStorage.removeItem(EDGES_STORAGE_KEY);
    
    setEdges([]);
    const areaNodes = showAreas ? createAreaNodes() : [];
    setNodes(areaNodes as Node[]);
    
    const loadDeviceData = async () => {
      const deviceNodes = await fetchDeviceData();
      const areaNodes = showAreas ? createAreaNodes() : [];
      setNodes([...areaNodes, ...deviceNodes] as Node[]);
    };
    loadDeviceData();
  }, [showAreas, setNodes, setEdges]);

  const getMiniMapNodeColor = (n: Node) => {
    if (n.type === 'ip') {
      const nodeData = n.data as { status?: string };
      return nodeData.status === 'online' ? '#10b981' : '#ef4444';
    }
    return '#6b7280';
  };

  const getMiniMapNodeStroke = (n: Node) => {
    if (n.type === 'ip') {
      const nodeData = n.data as { status?: string };
      return nodeData.status === 'online' ? '#059669' : '#dc2626';
    }
    return '#374151';
  };

  // Load real device data on component mount
  useEffect(() => {
    const loadDeviceData = async () => {
      setLoading(true);
      
      const savedNodes = loadFromStorage(NODES_STORAGE_KEY);
      const savedEdges = loadFromStorage(EDGES_STORAGE_KEY);
      
      if (savedEdges) {
        setEdges(savedEdges);
      }
      
      const deviceNodes = await fetchDeviceData();
      const areaNodes = showAreas ? createAreaNodes() : [];
      
      if (savedNodes && savedNodes.length > 0) {
        const savedAreaNodes = savedNodes.filter((node: Node) => node.type === 'area');
        const updatedAreaNodes = areaNodes.map(newAreaNode => {
          const savedAreaNode = savedAreaNodes.find((saved: Node) => saved.id === newAreaNode.id);
          if (savedAreaNode) {
            // Use position from initialData.ts, but preserve any transform styles from user dragging
            return {
              ...newAreaNode, // This includes the updated position from initialData
              style: {
                ...newAreaNode.style, // Use new dimensions from initialData
                // Only preserve transform if the user manually moved the area
                ...(savedAreaNode.style && savedAreaNode.style.transform ? { transform: savedAreaNode.style.transform } : {})
              }
            };
          }
          return newAreaNode;
        });
        
        const savedOtherNodes = savedNodes.filter((node: Node) => node.type !== 'area' && node.type !== 'ip');
        setNodes([...updatedAreaNodes, ...deviceNodes, ...savedOtherNodes] as Node[]);
      } else {
        setNodes([...areaNodes, ...deviceNodes] as Node[]);
      }
      
      setLoading(false);
    };
    
    loadDeviceData();
    
    const interval = setInterval(async () => {
      const deviceNodes = await fetchDeviceData();
      setNodes((currentNodes) => {
        const nonDeviceNodes = currentNodes.filter(node => node.type !== 'ip');
        return [...nonDeviceNodes, ...deviceNodes] as Node[];
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [setNodes, setEdges, showAreas]);

  // Update nodes when showAreas changes
  useEffect(() => {
    setNodes((currentNodes) => {
      const deviceNodes = currentNodes.filter(node => node.type === 'ip');
      const areaNodes = showAreas ? createAreaNodes() : [];
      return [...areaNodes, ...deviceNodes] as Node[];
    });
  }, [showAreas, setNodes]);

  // Handle edge selection for better visibility
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    console.log('Edge clicked:', edge);
  }, []);

  // Custom edge styling for better visibility
  const edgeOptions = {
    animated: false,
    style: { 
      strokeWidth: 2, 
      stroke: '#3b82f6',
    },
    type: 'smoothstep',
  };

  return (
    <div className="w-screen h-screen relative bg-gray-50">
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
          Loading network data...
        </div>
      )}
      
      {isPlacementMode && (
        <div className="absolute top-4 left-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
          {pendingNodeData ? 'Click anywhere to place the node' : 'Fill out the form and click to place manually'}
        </div>
      )}
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={edgeOptions}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Meta', 'Ctrl']}
        connectionLineStyle={{ strokeWidth: 2, stroke: '#3b82f6' }}
        className={`bg-white ${isPlacementMode ? 'cursor-crosshair' : ''}`}
        onPaneClick={handlePaneClick}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#e5e7eb"
          className="bg-gray-50"
        />
        
        <Controls className="bg-white border border-gray-200 rounded-xl shadow-lg" />
        
        <MiniMap 
          nodeStrokeColor={getMiniMapNodeStroke}
          nodeColor={getMiniMapNodeColor}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white border border-gray-200 rounded-xl shadow-lg"
        />
      </ReactFlow>

      <ControlPanel
        onAddNode={addNewNode}
        onDeleteNode={deleteNode}
        showAreas={showAreas}
        onToggleAreas={handleToggleAreas}
        onResetLayout={handleResetLayout}
        onTogglePlacementMode={handleTogglePlacementMode}
        isPlacementMode={isPlacementMode}
        isOpen={isControlPanelOpen}
        onToggle={() => setIsControlPanelOpen(!isControlPanelOpen)}
      />
    </div>
  );
}