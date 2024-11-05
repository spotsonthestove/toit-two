export interface MindMapNode {
    id: number;
    label: string;
    x: number;
    y: number;
    z: number;
    parentId: number | null;
    type: 'center' | 'main' | 'sub';
    color: string;
}

export interface Branch {
    id: number;
    startNodeId: number;
    endNodeId: number;
    label: string;
    color: string;
}
