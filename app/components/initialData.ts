import { Node, Edge } from '@xyflow/react';
import { Area } from './areas';

export const initialAreas: Area[] = [
  {
    id: 'vlan-1',
    name: 'VLAN-1',
    color: '#1d4ed8', // Bold blue
    x: 20,
    y: 20,
    width: 600,
    height: 400,
  },
  {
    id: 'vlan-100',
    name: 'VLAN 100',
    color: '#dc2626', // Bold red
    x: 640,
    y: 20,
    width: 600,
    height: 400,
  },
  {
    id: 'vlan-200',
    name: 'VLAN 200',
    color: '#047857', // Bold green
    x: 1260,
    y: 20,
    width: 600,
    height: 400,
  },
  {
    id: 'vlan-300',
    name: 'VLAN 300',
    color: '#7c2d12', // Bold brown
    x: 20,
    y: 440,
    width: 600,
    height: 400,
  },
  {
    id: 'vlan-400',
    name: 'VLAN 400',
    color: '#7c3aed', // Bold purple
    x: 640,
    y: 440,
    width: 600,
    height: 400,
  },
  {
    id: 'vlan-500',
    name: 'VLAN 500',
    color: '#ea580c', // Bold orange
    x: 1260,
    y: 440,
    width: 600,
    height: 400,
  },
  {
    id: 'vlan-600',
    name: 'VLAN 600',
    color: '#be185d', // Bold pink
    x: 20,
    y: 860,
    width: 600,
    height: 400,
  },
];

export const initialNodes: Node[] = [
  // No initial nodes - will be loaded from API
];

export const initialEdges: Edge[] = [
  // Initial connections - these will be updated based on network topology
  { 
    id: 'e-admin-switchyard', 
    source: 'admin-gateway', 
    target: 'switchyard-switch', 
    style: { stroke: '#059669', strokeWidth: 2 } 
  },
];
