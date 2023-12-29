import Highcharts from 'highcharts';
import Highstock from 'highcharts/modules/stock';
import 'highcharts/modules/accessibility';

import type { HTMLDOMElement, Options } from 'highcharts';

export default (node: string | HTMLDOMElement, config: Options) => {
    Highstock(Highcharts);

    const redraw = true;
    const oneToOne = true;
    const chart = Highcharts.stockChart(node, config);

    return {
        update(config: Options) {
            chart.update(config, redraw, oneToOne);
        },
        destroy() {
            chart.destroy();
        },
    };
};
