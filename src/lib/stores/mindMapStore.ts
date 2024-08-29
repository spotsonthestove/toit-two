import { writable } from 'svelte/store';

// Define the Node interface
export interface Node {
  id: number;
  x: number;
  y: number;
  z: number;
  isCenter?: boolean;
}

// Define the MindMap interface
export interface MindMap {
  id: string;
  nodes: Node[];
  // TODO: Add branch information when implemented
}

// Create a writable store for the mind map
// Initially set to null, will be populated with mind map data when available
export const mindMap = writable<MindMap | null>(null);

// Export the nodes store separately if needed
export const nodes = writable<Node[]>([]);