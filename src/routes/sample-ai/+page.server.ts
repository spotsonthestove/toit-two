import type { PageServerLoad, Actions } from './$types';

declare global {
  namespace App {
    interface Platform {
      env: {
        AI: any;
      };
    }
  }
}

const SYSTEM_PROMPT = `Break down the given task into numbered subtasks. Format each subtask as a numbered list like:
1. First subtask
2. Second subtask
etc.`;

export const load: PageServerLoad = async () => {
  return { answer: null };
};

export const actions: Actions = {
  default: async ({ request, platform }) => {
    console.log('Form action triggered');
    
    if (!platform?.env?.AI) {
      console.error('AI platform not available');
      return { error: 'AI service not configured properly' };
    }

    try {
      const formData = await request.formData();
      const userTask = formData.get('task')?.toString() || '';
      console.log('Received task:', userTask);

      if (!userTask.trim()) {
        return { error: 'Please enter a task' };
      }

      const response = await platform.env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', {
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userTask
          }
        ],
        stream: false,
        max_tokens: 256,
        temperature: 0.3
      });

      console.log('AI Response:', response);
      return { 
        data: { response: response.response }
      };
      
    } catch (error) {
      console.error('AI Error:', error);
      return { error: 'AI processing failed' };
    }
  }
};
