export function getTokenClient() {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : localStorage.getItem('token') || undefined;
}
