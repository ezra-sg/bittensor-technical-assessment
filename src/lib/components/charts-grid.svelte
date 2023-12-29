<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { shapeQueryParams } from '$lib/utils/text-utils';
    import Chart from '$lib/components/chart.svelte';
    import LoadingAnimation from '$lib/components/loading-animation.svelte';

    import type {
        CoingeckoCoinData,
        CoingeckoMarketChartData,
        ShapedCoinData,
    } from '$lib/types/coingecko-types';

    let shapedCoinData: ShapedCoinData[] = [];
    let timeout: null | number = null;
    let loading = true;

    const coinIds = [
        'bittensor',
        'bitcoin',
        'ethereum',
        'telos',
        'wrapped-telos',
        'staked-tlos',
        'eos',
        'monero',
        'tether',
        'usd-coin',
        'binancecoin',
        'solana',
        'matic-network',
        'avalanche-2',
        'litecoin',
    ];

    async function fetchCoinsMarketData() {
        const coinMarketDataPromises: Promise<ShapedCoinData>[] = coinIds.map(async (id) => {
            const coinDataRequestParams = shapeQueryParams({
                id,
                localization: 'false',
                tickers: 'false',
                market_data: 'false',
                community_data: 'false',
                developer_data: 'false',
            });
            const marketChartRequestParams = shapeQueryParams({
                vs_currency: 'usd',
                id,
                days: '1',
            });

            const coinDataResponse = fetch(`/api/coin-data?${coinDataRequestParams}`);
            const marketChartResponse = fetch(`/api/market-data?${marketChartRequestParams}`);

            // eztodo convert to allsettled?
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

        settledCoinDataPromises.filter(
            (settledPromise) => settledPromise.status === 'rejected'
        ).forEach(settledPromise => {
            console.error((settledPromise as PromiseRejectedResult).reason);
        })

        const fulfilledCoinDataPromises = settledCoinDataPromises.filter(
            (settledPromise) => settledPromise.status === 'fulfilled'
        ) as PromiseFulfilledResult<ShapedCoinData>[];

        let newShapedCoinData = fulfilledCoinDataPromises.map(
            (settledPromise) => settledPromise.value
        );

        const bittensorIndex = newShapedCoinData.findIndex((d) => d.id === 'bittensor');

        // ensure bittensor is first 😇
        if (bittensorIndex !== 0) {
            const bittensor = newShapedCoinData.splice(bittensorIndex, 1);
            newShapedCoinData = bittensor.concat(newShapedCoinData);
        }

        shapedCoinData = newShapedCoinData;

        setTimeout(() => {
            loading = false;
        }, 1000);
    }

    onMount(() => {
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

<div
    class="grid h-[100svh] grid-cols-1 gap-1 overflow-y-auto bg-stone-900 p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
>
    {#if loading}
        <LoadingAnimation />
    {:else}
        {#each shapedCoinData as data}
            <Chart coinData={data} />
        {/each}
    {/if}
</div>
