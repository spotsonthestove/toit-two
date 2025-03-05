import { writable } from 'svelte/store';

// Transition state store
export const isTransitioning = writable(false);

// Queue for pending transitions
let transitionQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

/**
 * Executes a theme transition with proper locking
 * @param callback Function to execute during transition
 * @param duration Transition duration in milliseconds
 * @returns Promise that resolves when transition completes
 */
export function transitionTheme(callback: () => void, duration = 300): Promise<void> {
  const transitionPromise = (): Promise<void> => {
    return new Promise<void>(resolve => {
      isTransitioning.set(true);
      
      // Execute the theme change
      callback();
      
      // Wait for transition to complete
      setTimeout(() => {
        isTransitioning.set(false);
        resolve();
      }, duration);
    });
  };
  
  // Add to queue and process
  return queueTransition(transitionPromise);
}

/**
 * Queues a transition to prevent overlapping transitions
 * @param transition Function that returns a promise for the transition
 * @returns Promise that resolves when the queued transition completes
 */
async function queueTransition(transition: () => Promise<void>): Promise<void> {
  return new Promise<void>(resolve => {
    // Add to queue
    transitionQueue.push(async () => {
      await transition();
      resolve();
    });
    
    // Start processing if not already processing
    if (!isProcessingQueue) {
      processQueue();
    }
  });
}

/**
 * Processes the transition queue sequentially
 */
async function processQueue(): Promise<void> {
  if (isProcessingQueue) return;
  
  isProcessingQueue = true;
  
  while (transitionQueue.length > 0) {
    const nextTransition = transitionQueue.shift();
    if (nextTransition) {
      await nextTransition();
    }
  }
  
  isProcessingQueue = false;
}

/**
 * Debounces a function call
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
} 