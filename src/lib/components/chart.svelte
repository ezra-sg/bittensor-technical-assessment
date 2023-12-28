<script lang="ts">
    import { onMount } from 'svelte';
    import type { Options } from 'highcharts';
    import highcharts from '$lib/actions/highcharts-action';
    import { formatNearestHour, formatNearestMinute } from '$lib/utils/time-utils';

    import type { ShapedCoinData } from '$lib/types/coingecko-types';

    export let coinData: ShapedCoinData;

    let windowHeight = window?.innerHeight ?? 500;
    let config: Options | null = null;

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
            height: windowHeight,
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
                rangeDescription: 'Range: 2010 to 2017',
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
    };

    onMount(() => {
        windowHeight = Math.floor(window.innerHeight / 3);
    });
</script>

{#if config}
<div use:highcharts={config}></div>
{/if }
