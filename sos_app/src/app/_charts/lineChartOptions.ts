import { ChartOptions } from 'chart.js';

export const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
    zoom: {
      limits: {
        x: { min: 'original', max: 'original' },
        y: { min: 'original', max: 'original' },
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: 'xy',
      },
    },
  },
};
