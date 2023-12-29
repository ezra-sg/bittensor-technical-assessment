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
    const localization = getParam('localization') ?? '';
    const tickers = getParam('tickers') ?? '';
    const marketData = getParam('market_data') ?? '';
    const communityData = getParam('community_data') ?? '';
    const developerData = getParam('developer_data') ?? '';

    const queryParams = {
        localization,
        tickers,
        market_data: marketData,
        community_data: communityData,
        developer_data: developerData,
    };

    const responseData = await queryCoingeckoApi<CoingeckoCoinData>(
        apiKey,
        `/coins/${id}`,
        queryParams
    );

    return new Response(JSON.stringify(responseData));
}
