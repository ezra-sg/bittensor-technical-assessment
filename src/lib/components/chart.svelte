<script lang="ts">
    import { onMount } from 'svelte';
    import highcharts from '$lib/actions/highcharts-action';

    import type { Options } from 'highcharts';

    const config: Options = {
        navigator: {
            enabled: false,
        },

        rangeSelector: {
            enabled: false,
        },

        scrollbar: {
            enabled: false,
        },

        title: {
            text: '',
        },

        chart: {
            height: 500,
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
                    let value = Number(this.value);

                    if (value >= 1000) {
                        return value / 1000 + 'k'; // Converts 1000 to '1k'
                    }
                    return String(value);
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
                name: 'Installation',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
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
        config.chart!.height = Math.floor(window.innerHeight / 3);
    });
</script>

<div use:highcharts={config} class=""></div>
