import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, parent }) => {
    const { session } = await parent();
    return {
        session: session || data.session
    };
}; 