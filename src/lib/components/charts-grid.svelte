<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { queryCoingecko } from '$lib/utils/coingecko-utils';

    import Chart from '$lib/components/chart.svelte';

    import type { CoinMarketData } from '$lib/types/coingecko-types';

    let marketData: CoinMarketData[] = [];
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
        const response = await queryCoingecko('/coins/markets', {
            vs_currency: 'usd',
            ids: coinIds.join(','),
        });
        let data = await response.json();
        const bittensorIndex = data.findIndex((d: CoinMarketData) => d.id === 'bittensor');

        // ensure bittensor is first 😇
        if (bittensorIndex !== 0) {
            const bittensor = data.splice(bittensorIndex, 1);
            data = bittensor.concat(data);
        }

        marketData = data;
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

<div
    class="grid h-[100svh] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
>
    {#each marketData as data}
        <Chart />
    {/each}
</div>
