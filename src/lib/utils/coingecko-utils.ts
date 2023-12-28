export function queryCoingecko(
    endpoint: string,
    params?: Record<string, string>
): Promise<Response> {
    // API key is public in this case, as it is a demo key
    const key = import.meta.env.VITE_COINGECKO_API_KEY;
    const url = 'https://api.coingecko.com/api/v3';
    const paramString = Object.entries(params ?? {})
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    // eztodo: add error handling
    return fetch(
        `${url}/${endpoint}?x_cg_demo_api_key=${key}${paramString ? '&' + paramString : ''}`
    );
}
