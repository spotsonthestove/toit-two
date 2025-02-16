import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    createTask: async ({ request, fetch, locals }) => {
        const data = await request.formData();
        const taskDescription = data.get('taskDescription')?.toString();

        if (!taskDescription) {
            throw error(400, 'Task description is required');
        }

        try {
            // Get session from locals
            const session = await locals.getSession();
            if (!session) {
                console.error('No session found in locals');
                throw error(401, 'Not authenticated');
            }

            console.log('Session check:', {
                hasSession: !!session,
                hasToken: !!session.access_token,
                userId: session.user.id
            });

            // Call AI service to split task
            const aiResponse = await fetch('/api/task-split', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ task: taskDescription })
            });

            if (!aiResponse.ok) {
                const errorData = await aiResponse.json().catch(() => ({}));
                console.error('AI response error:', {
                    status: aiResponse.status,
                    statusText: aiResponse.statusText,
                    error: errorData
                });
                throw new Error(errorData?.message || 'Failed to get AI response');
            }

            const { subtasks } = await aiResponse.json();

            // Use supabase client from locals
            const supabase = locals.supabase;

            // First create a mindmap
            const { data: mindmap, error: mindmapError } = await supabase
                .from('mindmaps')
                .insert([
                    {
                        name: taskDescription.split('\n')[0] || 'New Task',
                        description: taskDescription,
                        user_id: session.user.id
                    }
                ])
                .select()
                .single();

            if (mindmapError) {
                console.error('Error creating mindmap:', mindmapError);
                throw mindmapError;
            }

            // Create main task node with mindmap_id
            const { data: mainTask, error: mainTaskError } = await supabase
                .from('mindmap_nodes')
                .insert([
                    {
                        mindmap_id: mindmap.mindmap_id,
                        title: taskDescription.split('\n')[0] || 'New Task',
                        description: taskDescription,
                        node_type: 'concept',
                        content: taskDescription,
                        x: 0,
                        y: 0,
                        z: 0
                    }
                ])
                .select()
                .single();

            if (mainTaskError) {
                console.error('Error creating main task:', mainTaskError);
                throw mainTaskError;
            }

            // Create subtask nodes with mindmap_id
            const subtaskNodes = subtasks.map((subtask: string) => ({
                mindmap_id: mindmap.mindmap_id,
                title: subtask,
                description: subtask,
                node_type: 'note',
                parent_node_id: mainTask.node_id,
                content: subtask,
                x: 0,
                y: 0,
                z: 0
            }));

            const { error: subtasksError } = await supabase
                .from('mindmap_nodes')
                .insert(subtaskNodes);

            if (subtasksError) {
                console.error('Error creating subtasks:', subtasksError);
                throw subtasksError;
            }

            return {
                success: true,
                mindmap,
                task: mainTask,
                subtasks
            };
        } catch (err) {
            console.error('Error creating task:', err);
            const message = err instanceof Error ? err.message : 'Failed to create task';
            throw error(500, message);
        }
    }
} satisfies Actions; 