export interface MindMapNode {
    id: number;
    label: string;
    title: string;
    description: string;
    x: number;
    y: number;
    z: number;
    type: 'center' | 'main';
    nodeType: NodeType;
    parentId: number | null;
    color: string;
    isCenter: boolean;
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: number;
    estimatedDuration?: number;
    tags?: string[];
}

export interface Branch {
    id: number;
    startNodeId: number;
    endNodeId: number;
    label: string;
    color: string;
}

export type NodeType = 'concept' | 'note';
