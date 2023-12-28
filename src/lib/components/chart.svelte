<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { Options } from 'highcharts';
    import highcharts from '$lib/actions/highcharts-action';
    import { formatNearestHour, formatNearestMinute } from '$lib/utils/time-utils';

    import type { ShapedCoinData } from '$lib/types/coingecko-types';
    import throttle from '$lib/utils/throttle';

    export let coinData: ShapedCoinData;

    let chartHeight = Math.floor(window?.innerHeight / 3) ?? 500;
    let config: Options | null = null;
    let resizeListener: null | (() => void) = null;
    let fiatValueText = '';
    let percentChangeText = '';
    let changeAmountText = '';
    let highValueText = '';
    let lowValueText = '';

    $: config = {
        navigator: {
            enabled: false,
        },

        rangeSelector: {
            enabled: false,
        },

        scrollbar: {
            enabled: false,
        },

        tooltip: {
            formatter: function () {
                const msFromEpoch = Number(this.x);

                return `
                    <b>${formatNearestMinute(msFromEpoch)}</b><br>
                    <b>Price:</b> $${this.y?.toFixed(2)}
                `;
            },
        },

        title: {
            text: '',
        },

        chart: {
            height: chartHeight,
            backgroundColor: 'transparent',
        },

        yAxis: {
            gridLineWidth: 0,
            zoomEnabled: false,
            title: {
                text: '',
            },
            labels: {
                enabled: false,
            },
        },

        xAxis: {
            tickWidth: 0,
            lineWidth: 0,
            zoomEnabled: false,
            accessibility: {
                rangeDescription: 'Range: past 24 hours',
            },
            labels: {
                formatter: function () {
                    const msFromEpoch = Number(this.value);

                    return formatNearestHour(msFromEpoch);
                },
            },
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false,
                },
                pointStart: 2010,
            },
        },

        series: [
            {
                name: 'Price in USD',
                data: coinData?.prices ?? [],
                type: 'line',
                showInLegend: false,
            },
        ],

        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500,
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                        },
                    },
                },
            ],
        },

        credits: {
            enabled: false,
        },
    } as Options;

    $: fiatValueText = (coinData?.prices?.[coinData?.prices?.length - 1]?.[1] ?? 0).toLocaleString('en-US', {
        maximumFractionDigits: 4,
    });

    $: percentChangeText = (() => {
        const prices = coinData?.prices ?? [];
        const firstPrice = prices[0]?.[1] ?? 0;
        const lastPrice = prices[prices.length - 1]?.[1] ?? 0;

        const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

        return `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%`;
    })();

    $: changeAmountText = (() => {
        if (!coinData.prices) {
            return '';
        }

        const prices = coinData.prices;
        const firstPrice = prices[0]?.[1] ?? 0;
        const lastPrice = prices[prices.length - 1]?.[1] ?? 0;

        const changeAmount = lastPrice - firstPrice;

        return `${changeAmount.toLocaleString('en-US', { maximumFractionDigits: 4 })}`;
    })();

    $: highValueText = (() => {
        if (!coinData.prices) {
            return '';
        }

        const prices = coinData.prices;
        const highPrice = Math.max(...prices.map((p) => p[1]));

        return `${highPrice.toLocaleString('en-US', { maximumFractionDigits: 4 })}`;
    })();

    $: lowValueText = (() => {
        if (!coinData.prices) {
            return '';
        }
        const prices = coinData.prices;
        const lowPrice = Math.min(...prices.map((p) => p[1]));

        return `${lowPrice.toLocaleString('en-US', { maximumFractionDigits: 4 })}`;
    })();

    onMount(() => {
        resizeListener = throttle(() => {
            if (window.innerWidth < 640) {
                chartHeight = Math.floor(window.innerHeight / 3);
            } else if (window.innerWidth < 1024) {
                chartHeight = Math.floor(window.innerHeight / 4);
            } else if (window.innerWidth < 1280) {
                chartHeight = Math.floor(window.innerHeight / 3);
            }else {
                chartHeight = Math.floor(window.innerHeight / 3) - 64;
            }
        }, 100);
        window.addEventListener('resize', resizeListener);

        resizeListener();
    });

    onDestroy(() => {
        if (resizeListener !== null) {
            window.removeEventListener('resize', resizeListener);
        }
    });
</script>

{#if config}
<div class="relative">
    <div use:highcharts={config} class="mt-16"></div>

    <!-- data overlay -->
    <div class="absolute top-0 left-0 right-0 m-2 columns-2 text-red-50 font-bold">
        <div>
            <h3>{coinData.symbol.toUpperCase()}/USD</h3>
            <h1 class="text-3xl">{fiatValueText}</h1>
        </div>
        <div class="text-right">
            {percentChangeText}
            <span class="text-stone-400">&#8226;</span>
            {changeAmountText}
            <br>
            <span class="text-xs">H {highValueText}</span>
            <br>
            <span class="text-xs">L {lowValueText}</span>
        </div>
    </div>
</div>
{/if }
