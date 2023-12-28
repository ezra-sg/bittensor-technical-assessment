<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { queryCoingecko } from '$lib/utils/coingecko-utils';

    import Chart from '$lib/components/chart.svelte';

    import type { CoingeckoCoinData, CoingeckoMarketChartData, ShapedCoinData } from '$lib/types/coingecko-types';

    let shapedCoinData: ShapedCoinData[] = [];
    let timeout: null | number = null;

    const coinIds = [
        'bittensor',
        'bitcoin',
        'ethereum',
        'eos',
        'monero',
        'telos',
        'staked-tlos',
        'tether',
        'usd-coin',
        'binancecoin',
        'solana',
        'matic-network',
        'avalanche-2',
        'litecoin',
        'shiba',
    ];

    async function fetchCoinsMarketData() {
        const coinMarketDataPromises: Promise<ShapedCoinData>[] = coinIds.map(async (id) => {
            const coinDataResponse = queryCoingecko(`/coins/${id}`, {
                localization: 'false',
                tickers: 'false',
                market_data: 'false',
                community_data: 'false',
                developer_data: 'false',
            });
            const marketChartResponse = queryCoingecko('/market_chart', {
                vs_currency: 'usd',
                id,
                days: '7',
            });

            const [coinDataResponseData, marketChartDataResponseData] = await Promise.all([
                coinDataResponse,
                marketChartResponse,
            ]);

            const [coinData, marketChartData] = (await Promise.all([
                coinDataResponseData.json(),
                marketChartDataResponseData.json(),
            ])) as [CoingeckoCoinData, CoingeckoMarketChartData];

            return {
                id,
                name: coinData.name,
                symbol: coinData.symbol,
                prices: marketChartData.prices,
                marketCaps: marketChartData.market_caps,
                totalVolumes: marketChartData.total_volumes,
            } as ShapedCoinData;
        });

        const settledCoinDataPromises = await Promise.allSettled(coinMarketDataPromises);
        // eztodo: handle errors
        const fulfilledCoinDataPromises = settledCoinDataPromises.filter(
            settledPromise => settledPromise.status === 'fulfilled'
        ) as PromiseFulfilledResult<ShapedCoinData>[];

        let shapedCoinData = fulfilledCoinDataPromises.map(
            settledPromise => settledPromise.value
        );

        const bittensorIndex = shapedCoinData.findIndex(
            d => d.id === 'bittensor'
        );

        // ensure bittensor is first 😇
        if (bittensorIndex !== 0) {
            const bittensor = shapedCoinData.splice(bittensorIndex, 1);
            shapedCoinData = bittensor.concat(shapedCoinData);
        }

        shapedCoinData = shapedCoinData;
    }

    onMount(() => {
        // eztodo include coingecko attribution
        // eztodo: add loading state

        fetchCoinsMarketData();

        // refresh data every 10 seconds
        timeout = setInterval(fetchCoinsMarketData, 10000);
    });

    onDestroy(() => {
        if (timeout !== null) {
            clearInterval(timeout);
        }
    });
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:h-[100svh] xl:grid-cols-5">
    {#each shapedCoinData as data}
        { data }
        <Chart />
    {/each}
</div>
