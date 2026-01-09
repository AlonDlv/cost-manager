import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// ⚠️ CRITICAL: Register the components or the app crashes!
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ year }) { // Exporting as DEFAULT
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Expenses for ${year}` },
    },
  };

  // Mock data - replace with real props if you want dynamic data later
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Costs (ILS)',
        data: [120, 190, 30, 50, 20, 300, 400, 200, 100, 50, 20, 10], // Partner 2's logic will go here
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return <Bar options={options} data={data} />;
}