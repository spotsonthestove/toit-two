import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

// Set runtime config for longer execution
export const config = {
    runtime: 'edge',
    maxDuration: 60 // Allow up to 60 seconds
};

declare global {
    namespace App {
        interface Platform {
            env: {
                AI: any;
            }
        }
    }
}

// Maximum number of retries for AI requests
const MAX_RETRIES = 3;
// Base delay for exponential backoff (in ms)
const BASE_DELAY = 1000;

const SYSTEM_PROMPT = `Break down the given task into 3 logical subtasks. Format each subtask as a numbered list like:
1. First subtask
2. Second subtask
3. Third subtask`;

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function callAI(platform: App.Platform, task: string, retryCount = 0): Promise<string[]> {
    try {
        console.log('Calling AI with task:', { taskLength: task.length, retryCount });
        
        const response = await platform.env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', {
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: `Break this task into 3 subtasks: ${task}`
                }
            ],
            stream: false,
            max_tokens: 256,
            temperature: 0.3
        });

        console.log('Raw AI response:', response);

        if (!response) {
            throw new Error('No response received from AI');
        }

        // The response format is { response: string }
        const content = response.response;
        if (!content) {
            throw new Error('Invalid AI response format: missing content');
        }

        // Parse the response into subtasks
        const subtasks = content
            .split('\n')
            .filter((line: string) => line.trim())
            .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

        if (subtasks.length === 0) {
            throw new Error('No valid subtasks found in AI response');
        }

        console.log('Parsed subtasks:', subtasks);
        return subtasks;
    } catch (err) {
        console.error(`AI request failed (attempt ${retryCount + 1}):`, err);

        if (retryCount < MAX_RETRIES - 1) {
            console.log(`Retrying AI request (attempt ${retryCount + 2} of ${MAX_RETRIES})...`);
            // Exponential backoff
            const backoffDelay = BASE_DELAY * Math.pow(2, retryCount);
            await delay(backoffDelay);
            return callAI(platform, task, retryCount + 1);
        }

        throw new Error(`AI request failed after ${MAX_RETRIES} attempts: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
}

export async function POST(event: RequestEvent) {
    try {
        // Extract and validate token
        const authHeader = event.request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            throw error(401, 'Missing or invalid authorization header');
        }
        const token = authHeader.substring(7);

        // Use server-side Supabase client from locals
        const supabase = event.locals.supabase;
        
        // Verify user
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError || !user) {
            console.error('User verification failed:', userError);
            throw error(401, 'Invalid authentication token');
        }

        const requestData = await event.request.json();
        const { task } = requestData;

        if (!task || typeof task !== 'string') {
            throw error(400, 'Task description is required');
        }

        // Enhanced platform checking
        if (!event.platform) {
            console.error('Platform not available in event');
            throw error(500, 'Server configuration error: Platform not available');
        }

        if (!event.platform.env?.AI) {
            console.error('AI service not configured in platform environment');
            throw error(500, 'Server configuration error: AI service not available');
        }

        console.log('Processing task split request:', {
            userId: user.id,
            taskLength: task.length,
            platform: !!event.platform,
            ai: !!event.platform.env.AI
        });

        try {
            const subtasks = await callAI(event.platform, task);

            if (!subtasks || !Array.isArray(subtasks) || subtasks.length === 0) {
                console.error('Invalid AI response format:', subtasks);
                throw error(500, 'Invalid AI response format');
            }

            console.log('AI response received:', {
                userId: user.id,
                subtasksCount: subtasks.length,
                subtasks // Log the actual subtasks for debugging
            });

            return json({
                success: true,
                subtasks
            });
        } catch (aiError: unknown) {
            console.error('AI processing error:', aiError);
            const errorMessage = aiError instanceof Error ? aiError.message : 'Unknown AI error';
            throw error(500, `AI processing failed: ${errorMessage}`);
        }
    } catch (err: unknown) {
        console.error('Error processing task split:', err);
        // Enhanced error response
        if (err && typeof err === 'object' && 'status' in err && 'body' in err) {
            throw err; // Rethrow SvelteKit errors
        }
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        throw error(500, `Failed to process task split request: ${errorMessage}`);
    }
} 