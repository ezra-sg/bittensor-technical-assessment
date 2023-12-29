import { queryCoingeckoApi } from '$lib/utils/api-utils';

import type { CoingeckoCoinData } from '$lib/types/coingecko-types';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
    runtime: 'nodejs18.x',
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const apiKey = process.env.COINGECKO_API_KEY;

    const getParam = (name: string) => url.searchParams.get(name);

    const id = getParam('id') ?? '';
    const vsCurrency = getParam('vs_currency') ?? '';
    const days = getParam('days') ?? '';

    const queryParams = {
        days,
        vs_currency: vsCurrency,
    };

    const responseData = await queryCoingeckoApi<CoingeckoCoinData>(
        apiKey,
        `/coins/${id}/market_chart`,
        queryParams
    );

    return new Response(JSON.stringify(responseData));
}
