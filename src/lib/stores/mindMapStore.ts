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
        nodeType: node.type === 'center' ? 'concept' : 'note'
    })));
}