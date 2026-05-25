import { ChartConfiguration } from 'chart.js';

export const pieChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
    datalabels: {
      color: '#fff',
      font: {
        weight: 'bold',
        size: 14,
      },
      formatter: (value, ctx) => {
        let sum = 0;
        const dataArr = ctx.chart.data.datasets[0].data as number[];
        dataArr.forEach((data) => {
          sum += data;
        });
        if (value === 0 || sum === 0) return '';
        const percentage = ((value * 100) / sum).toFixed(1) + '%';
        return percentage;
      },
    },
  },
  backgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
  ],
};
