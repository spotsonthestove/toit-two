// Task Types
export interface Task {
    id: string;
    title: string;
    description: string;
    node_type: 'task' | 'subtask';
    parent_node_id?: string;
    ai_generated: boolean;
    created_at: string;
}

// API Response Types
export interface TaskSplitResponse {
    success: boolean;
    subtasks: string[];
}

export interface TaskCreateResponse {
    success: boolean;
    task: Task;
    subtasks: string[];
}

// Form Types
export interface ActionResult<T> {
    type: 'success' | 'error' | 'redirect';
    status?: number;
    data?: T;
    error?: {
        message: string;
    };
    location?: string;
}

export interface SubmitEvent<T = Record<string, unknown>> {
    formData: FormData;
    formElement: HTMLFormElement;
    action: URL;
    result: ActionResult<T>;
    update(options?: { reset: boolean }): Promise<void>;
} 