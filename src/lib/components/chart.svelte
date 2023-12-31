<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import highcharts from '$lib/actions/highcharts-action';
    import { formatNearestHour, formatNearestMinute } from '$lib/utils/time-utils';
    import throttle from '$lib/utils/throttle';
    import { formatCurrency } from '$lib/utils/text-utils';

    import type { Options } from 'highcharts';
    import type { ShapedCoinData } from '$lib/types/coingecko-types';

    export let coinData: ShapedCoinData;

    let chartHeight = window?.innerHeight ? Math.floor(window?.innerHeight / 3) : 500;
    let config: Options | null = null;
    let resizeListener: null | (() => void) = null;
    let rootElStyle = '';
    let fiatValueText = '';
    let percentChangeText = '';
    let changeAmountText = '';
    let highValueText = '';
    let lowValueText = '';

    $: config = {
        accessibility: {
            enabled: true,
            description: `This chart shows the price of ${coinData.name} (${coinData.symbol}) in USD over the last 24 hours`,
            keyboardNavigation: {
                enabled: true,
                focusBorder: {
                    enabled: true,
                    hideBrowserFocusOutline: true,
                },
                seriesNavigation: {
                    mode: 'serialize',
                },
            },
        },

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
                    <b>Price:</b> $${formatCurrency(this.y)}
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
                style: {
                    color: '#f2f2f2',
                    fontSize: '10px',
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
                color: '#f2f2f2',
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

    $: rootElStyle = (() => {
        if (!coinData.prices) {
            return '';
        }

        const prices = coinData.prices;
        const firstPrice = prices[0]?.[1] ?? 0;
        const lastPrice = prices[prices.length - 1]?.[1] ?? 0;

        // base colors, obtained from design
        const greenHex = '#42594F';
        const redHex = '#92484E';

        const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
        // Calculate opacity, maxing out when percentChange is 10% or more
        let opacity = Math.abs(percentChange / 10);
        opacity = Math.min(Math.max(opacity, 0.3), 1); // clamp opacity between 0.3 and 1

        // Convert the opacity to a hex value
        const opacityHex = Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, '0');
        const colorHex = (percentChange > 0 ? greenHex : redHex) + opacityHex;

        return `background-color: ${colorHex};`;
    })();

    $: fiatValueText = formatCurrency((coinData?.prices?.[coinData?.prices?.length - 1]?.[1] ?? 0));

    $: percentChangeText = (() => {
        if (!coinData.prices) {
            return '';
        }

        const prices = coinData.prices;
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

        return `${formatCurrency(changeAmount)}`;
    })();

    $: highValueText = (() => {
        if (!coinData.prices) {
            return '';
        }

        const prices = coinData.prices;
        const highPrice = Math.max(...prices.map((p) => p[1]));

        return `${formatCurrency(highPrice)}`;
    })();

    $: lowValueText = (() => {
        if (!coinData.prices) {
            return '';
        }
        const prices = coinData.prices;
        const lowPrice = Math.min(...prices.map((p) => p[1]));

        return `${formatCurrency(lowPrice)}`;
    })();

    onMount(() => {
        resizeListener = throttle(() => {
            // set the number of charts to display based on screen size
            if (window.innerWidth < 640) {
                chartHeight = Math.floor(window.innerHeight / 3);
            } else if (window.innerWidth < 1024) {
                chartHeight = Math.floor(window.innerHeight / 4);
            } else if (window.innerWidth < 1280) {
                chartHeight = Math.floor(window.innerHeight / 3);
            } else {
                const chartMarginTop = 64;
                const gridPadding = 16;
                chartHeight = Math.floor(window.innerHeight / 3) - chartMarginTop - gridPadding;
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
    <figure class="relative" style={rootElStyle}>
        <div use:highcharts={config} class="mt-16"></div>

        <!-- data overlay -->
        <div class="absolute left-0 top-0 m-2 font-bold text-red-50">
            <h3>{coinData.symbol.toUpperCase()}/USD</h3>
            <h1 class="text-2xl">{fiatValueText}</h1>
        </div>
        <div
            class="absolute right-0 top-0 m-2 whitespace-nowrap text-right font-bold text-red-50"
            aria-label="Price change data"
        >
            {percentChangeText}
            <span class="text-stone-400">&#8226;</span>
            {changeAmountText}
            <br />
            <p class="text-xs">H {highValueText}</p>
            <p class="text-xs">L {lowValueText}</p>
        </div>
    </figure>
{/if}
