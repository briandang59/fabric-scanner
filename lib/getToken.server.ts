import 'server-only';

import { cookies } from 'next/headers';

export async function getTokenServer() {
    try {
        const cookieStore = await cookies();
        return cookieStore.get('token')?.value;
    } catch {
        return undefined;
    }
}
