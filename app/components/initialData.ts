import { Node, Edge } from '@xyflow/react';
import { Area } from './areas';

export const initialAreas: Area[] = [
  // First row - 4 areas
  {
    id: 'PGCIL',
    name: 'PGCIL',
    color: '#1d4ed8', // Bold blue
    x: 20,
    y: 20,
    width: 300, // Small area for 3 IPs
    height: 250,
  },
  {
    id: 'sophos',
    name: 'Sophos',
    color: '#dc2626', // Bold red
    x: 340,
    y: 20,
    width: 200, // Very small area for 1 IP
    height: 180,
  },
  {
    id: 'hop-bung',
    name: 'Hop Bung',
    color: '#047857', // Bold green
    x: 560,
    y: 20,
    width: 200, // Very small area for 1 IP
    height: 180,
  },
  {
    id: 'ssc-build',
    name: 'SSC Build',
    color: '#7c2d12', // Bold brown
    x: 780,
    y: 20,
    width: 300, // Small area for 3 IPs
    height: 250,
  },
  
  // Second row - 3 areas
  {
    id: 'plant-area',
    name: 'Plant Area',
    color: '#7c3aed', // Bold purple
    x: 20,
    y: 290,
    width: 500, // Large area for 10 IPs
    height: 350,
  },
  {
    id: 'it-dept',
    name: 'IT Dept',
    color: '#ea580c', // Bold orange
    x: 540,
    y: 290,
    width: 400, // Medium-large area for 7 IPs
    height: 300,
  },
  {
    id: 'admin-build',
    name: 'Admin Build',
    color: '#be185d', // Bold pink
    x: 960,
    y: 290,
    width: 450, // Large area for 8 IPs
    height: 320,
  },
  
  // Third row - 4 areas
  {
    id: 'sankalp-2',
    name: 'Sankalp #2',
    color: '#059669', // Bold emerald
    x: 20,
    y: 660,
    width: 400, // Medium-large area for 7 IPs
    height: 300,
  },
  {
    id: 'township',
    name: 'Township',
    color: '#0369a1', // Bold sky blue
    x: 440,
    y: 660,
    width: 350, // Medium area for 6 IPs
    height: 280,
  },
  {
    id: 'et-hostel',
    name: 'ET-Hostel',
    color: '#7c2d12', // Bold amber
    x: 810,
    y: 660,
    width: 320, // Medium area for 5 IPs
    height: 260,
  },
  {
    id: 'rli-office',
    name: 'RLI Office',
    color: '#4338ca', // Bold indigo
    x: 1150,
    y: 660,
    width: 500, // Large area for 10 IPs
    height: 350,
  },
   
];

export const initialNodes: Node[] = [
  // No initial nodes - will be loaded from API
];

export const initialEdges: Edge[] = [
  // Initial connection - Sophos to PGCIL
  { 
    id: 'e-sophos-pgcil', 
    source: 'sophos', 
    target: 'pgcil', 
    style: { stroke: '#059669', strokeWidth: 3 } 
  },
];
