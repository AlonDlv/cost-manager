import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, 
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ year, chartData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: `Costs in ILS (${year})`,
        data: chartData, // כאן נכנס המערך של ה-12 חודשים שחישבנו!
        backgroundColor: 'rgba(46, 125, 50, 0.5)', // הצבע הירוק של המותג שלכם
        borderColor: '#2e7d32',
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
