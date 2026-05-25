import { ChartConfiguration } from 'chart.js';

export const barChartOptions: ChartConfiguration<'bar'>['options'] = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {},
    y: {},
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
