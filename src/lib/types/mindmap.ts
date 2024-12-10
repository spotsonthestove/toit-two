export interface MindMapNode {
    id: number;
    label: string;
    title?: string;
    description?: string;
    x: number;
    y: number;
    z: number;
    parentId: number | null;
    type: 'center' | 'main' | 'sub';
    nodeType?: NodeType;
    color: string;
    isCenter?: boolean;
}

export interface Branch {
    id: number;
    startNodeId: number;
    endNodeId: number;
    label: string;
    color: string;
}

export type NodeType = 'concept' | 'note';
