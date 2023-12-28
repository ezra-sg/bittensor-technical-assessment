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
    let fiatValueText = '';
    let resizeListener: null | (() => void) = null;

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

    $: fiatValueText = `${coinData?.prices?.[coinData?.prices?.length - 1]?.[1]?.toFixed(2)}`;

    onMount(() => {
        resizeListener = throttle(() => {
            if (window.innerWidth < 640) {
                chartHeight = Math.floor(window.innerHeight / 3);
            } else if (window.innerWidth < 1024) {
                chartHeight = Math.floor(window.innerHeight / 4);
            } else if (window.innerWidth < 1280) {
                chartHeight = Math.floor(window.innerHeight / 3);
            }else {
                chartHeight = Math.floor(window.innerHeight / 3) - 32;
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
    <div use:highcharts={config} class="mt-8"></div>

    <!-- data overlay -->
    <div class="absolute top-0 left-0 right-0 m-2 columns-2">
        <div>
            <h3 class="text-black">{coinData.symbol.toUpperCase()}/USD</h3>
            <h1 class="text-xl font-bold">{fiatValueText}</h1>
        </div>
        <div>
            text
        </div>
    </div>
</div>
{/if }
