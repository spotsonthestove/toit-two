import { writable } from 'svelte/store';
import type { MindMapNode } from '$lib/types/mindmap';

export const nodes = writable<MindMapNode[]>([]);

export const selectedNode = writable<MindMapNode | null>(null);

export function clearNodes() {
    nodes.set([]);
}

export function initializeNodes(initialNodes: MindMapNode[]) {
    nodes.set(initialNodes.map(node => ({
        ...node,
        isCenter: node.parentId === null,
        nodeType: node.type === 'center' ? 'concept' : 'note',
        status: node.status || 'pending',
        priority: node.priority || 3,
        estimatedDuration: node.estimatedDuration || 0,
        tags: node.tags || [],
        color: node.color || '#2196F3'
    })));
}