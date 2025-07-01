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
  Panel,
  Node,
  Edge,
  ReactFlowProvider,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Components
import ControlPanel from '../components/ControlPanel';
import { nodeTypes } from '../components/NodeTypes';
import { initialAreas, initialNodes, initialEdges } from '../components/initialData';

// Local storage keys
const NODES_STORAGE_KEY = 'network-monitor-nodes';
const EDGES_STORAGE_KEY = 'network-monitor-edges';

// Utility functions for persistence
const saveToStorage = (key: string, data: any) => {
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
    const deviceData = await response.json();
    
    console.log('Fetched device data:', deviceData);
    
    // If no devices or empty response, return empty array
    if (!deviceData || Object.keys(deviceData).length === 0) {
      console.log('No devices found from API');
      return [];
    }
    
    // Convert the backend data structure to nodes
    const devices = Object.entries(deviceData).map(([ip, data]: [string, any], index: number) => {
      // Position nodes within their respective areas or in a general area
      const location = data.location && data.location !== 'Location not set' ? data.location : null;
      const area = location ? initialAreas.find(a => a.name === location) : null;
      
      console.log(`Processing device ${ip}:`, { location, area: area?.name });
      
      let x, y;
      if (area) {
        // Position within the specific area
        const devicesInSameArea = Object.entries(deviceData).filter(([_, d]: [string, any]) => 
          d.location === location
        );
        const areaIndex = devicesInSameArea.findIndex(([deviceIp]) => deviceIp === ip);
        x = area.x + 50 + (areaIndex % 4) * 140;
        y = area.y + 80 + Math.floor(areaIndex / 4) * 70;
      } else {
        // Position outside defined areas for devices without location
        x = 600 + (index % 3) * 150;
        y = 50 + Math.floor(index / 3) * 80;
      }
      
      const node = {
        id: `device-${ip}`,
        type: 'ip',
        data: {
          label: ip, // Use IP as label for now
          ip: ip,
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
    return []; // Return empty array instead of initial nodes
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
  // Initialize with empty array but proper Node type
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [showAreas, setShowAreas] = useState(true);
  const [nodeCounter, setNodeCounter] = useState(20);
  const [loading, setLoading] = useState(true);
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [pendingNodeData, setPendingNodeData] = useState<{
    label: string; 
    ip: string; 
    location: string; 
    status: 'online' | 'offline'
  } | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);

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
      // Save nodes after changes to capture position, style, and size updates
      setTimeout(() => {
        setNodes((currentNodes) => {
          saveToStorage(NODES_STORAGE_KEY, currentNodes);
          return currentNodes;
        });
      }, 50); // Reduced timeout for faster persistence
    },
    [onNodesChange, setNodes],
  );

  // Enhanced edges change handler with persistence and deletion support
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      // Save edges after changes
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
    setPreviewPosition(null);
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
        setPreviewPosition(null);
        setIsPlacementMode(false);
      }
    }
  }, [isPlacementMode, pendingNodeData, nodeCounter, setNodes]);

  // Handle mouse movement for placement preview
  const handlePaneMouseMove = useCallback((event: React.MouseEvent) => {
    if (isPlacementMode && pendingNodeData) {
      const reactFlowBounds = (event.target as Element).closest('.react-flow')?.getBoundingClientRect();
      if (reactFlowBounds) {
        setPreviewPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
      }
    }
  }, [isPlacementMode, pendingNodeData]);

  // Enhanced addNewNode to support both automatic and manual placement
  const addNewNode = useCallback(async (nodeData: { label: string; ip: string; location: string; status: 'online' | 'offline' }) => {
    if (isPlacementMode) {
      // Store the node data for manual placement
      setPendingNodeData(nodeData);
      return;
    }

    // Automatic placement (existing logic)
    try {
      // Add to backend first
      const response = await fetch(`/api/add?ip=${encodeURIComponent(nodeData.ip)}&location=${encodeURIComponent(nodeData.location)}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to add device to backend:', error);
        return;
      }
      
      // If backend succeeds, add to frontend
      const newId = `node-${nodeCounter}`;
      
      // Position the node in the correct area
      const targetArea = areas.find(area => area.name === nodeData.location);
      const x = targetArea ? targetArea.x + 50 + Math.random() * (targetArea.width - 100) : 200;
      const y = targetArea ? targetArea.y + 80 + Math.random() * (targetArea.height - 100) : 200;
      
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
      
      // Refresh data to get the latest from backend
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

  const handleToggleAreas = useCallback(() => {
    setShowAreas(prev => !prev);
  }, []);

  const handleResetLayout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(NODES_STORAGE_KEY);
    localStorage.removeItem(EDGES_STORAGE_KEY);
    
    // Reset to default layout
    setEdges([]);
    const areaNodes = showAreas ? createAreaNodes() : [];
    setNodes(areaNodes as Node[]);
    
    // Reload device data
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
      return nodeData.status === 'online' ? '#dcfce7' : '#fee2e2';
    }
    return '#f3f4f6';
  };

  const getMiniMapNodeStroke = (n: Node) => {
    if (n.type === 'ip') {
      const nodeData = n.data as { status?: string };
      return nodeData.status === 'online' ? '#16a34a' : '#dc2626';
    }
    return '#6b7280';
  };

  // Load real device data on component mount
  useEffect(() => {
    const loadDeviceData = async () => {
      setLoading(true);
      
      // Load persisted nodes and edges first
      const savedNodes = loadFromStorage(NODES_STORAGE_KEY);
      const savedEdges = loadFromStorage(EDGES_STORAGE_KEY);
      
      if (savedEdges) {
        setEdges(savedEdges);
      }
      
      // Fetch fresh device data
      const deviceNodes = await fetchDeviceData();
      const areaNodes = showAreas ? createAreaNodes() : [];
      
      // If we have saved nodes, merge them with fresh device data
      if (savedNodes && savedNodes.length > 0) {
        // Keep saved area nodes with their position and style (size) intact
        const savedAreaNodes = savedNodes.filter((node: Node) => node.type === 'area');
        const updatedAreaNodes = areaNodes.map(newAreaNode => {
          const savedAreaNode = savedAreaNodes.find((saved: Node) => saved.id === newAreaNode.id);
          // Preserve position, style, and any other properties from saved node
          return savedAreaNode ? { ...newAreaNode, ...savedAreaNode } : newAreaNode;
        });
        
        // Keep manually placed nodes and other non-device nodes
        const savedOtherNodes = savedNodes.filter((node: Node) => node.type !== 'area' && node.type !== 'ip');
        setNodes([...updatedAreaNodes, ...deviceNodes, ...savedOtherNodes] as Node[]);
      } else {
        // No saved data, use fresh data
        setNodes([...areaNodes, ...deviceNodes] as Node[]);
      }
      
      setLoading(false);
    };
    
    loadDeviceData();
    
    // Set up periodic refresh every 30 seconds (only for device data)
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

  // Load initial state from localStorage
  useEffect(() => {
    const storedNodes = loadFromStorage(NODES_STORAGE_KEY);
    const storedEdges = loadFromStorage(EDGES_STORAGE_KEY);
    
    if (storedNodes) {
      setNodes(storedNodes);
    }
    if (storedEdges) {
      setEdges(storedEdges);
    }
  }, []);

  // Save nodes and edges to localStorage on change
  useEffect(() => {
    saveToStorage(NODES_STORAGE_KEY, nodes);
  }, [nodes]);

  useEffect(() => {
    saveToStorage(EDGES_STORAGE_KEY, edges);
  }, [edges]);

  // Handle edge selection for better visibility
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    // This will select the edge, making it more visible for deletion
    console.log('Edge clicked:', edge);
  }, []);

  // Custom edge styling for better visibility
  const edgeOptions = {
    animated: false,
    style: { 
      strokeWidth: 3, 
      stroke: '#3b82f6',
    },
    type: 'smoothstep',
  };

  return (
    <div className="w-screen h-screen relative bg-gray-50">
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Loading network data...
        </div>
      )}
      
      {isPlacementMode && (
        <div className="absolute top-4 left-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
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
        onPaneMouseMove={handlePaneMouseMove}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#00040a"
          className="bg-gray-50"
        />
        
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-lg" />
        
        <MiniMap 
          nodeStrokeColor={getMiniMapNodeStroke}
          nodeColor={getMiniMapNodeColor}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white border border-gray-200 rounded-lg shadow-lg"
        />
        
        <Panel position="top-right" className="m-4">
          <ControlPanel
            onAddNode={addNewNode}
            showAreas={showAreas}
            onToggleAreas={handleToggleAreas}
            onResetLayout={handleResetLayout}
            onTogglePlacementMode={handleTogglePlacementMode}
            isPlacementMode={isPlacementMode}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
}
