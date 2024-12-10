import { writable } from 'svelte/store';
import type { MindMapNode } from '$lib/types/mindmap';

export const nodes = writable<MindMapNode[]>([]);
export const selectedNode = writable<MindMapNode | null>(null); 