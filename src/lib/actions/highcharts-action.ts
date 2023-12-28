import Highcharts from 'highcharts';

import type { HTMLDOMElement, Options } from 'highcharts';

export default (node: string | HTMLDOMElement, config: Options) => {
    const redraw = true;
    const oneToOne = true;
    const chart = Highcharts.chart(node, config);

    return {
        update(config: Options) {
            chart.update(config, redraw, oneToOne);
        },
        destroy() {
            chart.destroy();
        },
    };
};
