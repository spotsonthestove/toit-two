import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import { browser } from '$app/environment';

// Initialize from localStorage if available
const initialUser = browser ? 
    JSON.parse(localStorage.getItem('user') || 'null') : 
    null;

const createUserStore = () => {
    const { subscribe, set } = writable<User | null>(initialUser);

    return {
        subscribe,
        set: (user: User | null) => {
            if (browser) {
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                } else {
                    localStorage.removeItem('user');
                }
            }
            set(user);
        }
    };
};

export const user = createUserStore();
