import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Transaction } from '../../models/Transaction';
import { TransactionService } from '../../services/TransactionService';
import { BarChartTransactionsProps } from '../props/BarChartTransactionsProps';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';
import { ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChartTransactions = ({ filterDto }: BarChartTransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await TransactionService.filter(filterDto);
      setTransactions(response.data);
    };

    fetchTransactions();
  }, [filterDto]);

  const getCategoryData = () => {
    const categoryData: { [category: string]: number } = {};

    transactions.forEach((transaction) => {
      const category = transaction.category.name || 'Other';

      if (!categoryData[category]) {
        categoryData[category] = 0;
      }

      if (transaction.type === 'EXPENSE') {
        categoryData[category] += transaction.cost;
      }
    });

    return categoryData;
  };

  const categoryData = getCategoryData();

  const labels = Object.keys(categoryData);
  const expenseData = labels.map((category) => categoryData[category]);

  const totalExpense = expenseData.reduce((acc, val) => acc + val, 0);

  const formattedTotal = new Intl.NumberFormat().format(totalExpense);

  const data = {
    labels,
    datasets: [
      {
        data: expenseData,
        backgroundColor: [
          '#475EE1', // Blue
          '#FF9304', // Yellow
          '#FF6161', // Red
          '#00B58D', // Green
          '#F741DF', // Pink
        ],
        borderRadius: 0,
        borderWidth: 0,
        spacing: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    aspectRatio: 1.4,
    cutout: "92%", // Ensures a large center cutout
    devicePixelRatio: 4, // High pixel density for sharper rendering
    plugins: {
      legend: {
        position: "bottom", // Valid value for legend position
        labels: {
          usePointStyle: true,
          pointStyle: "rect", // Use rectangular point style
          padding: 20,
          boxWidth: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>) => {
            const category = tooltipItem.label;
            const expense = categoryData[category] || 0;
            return `${category}: ${expense.toFixed(2)} MKD`; 
          },
        },
      },
    },
  };
  

  return (
    <div className='relative h-70 flex justify-center items-center pt-10  w-full max-w-full'>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-md'>
        <div>{formattedTotal}</div>
        <div className='text-md font-normal text-2xl'>MKD</div>
      </div>
      <Doughnut data={data} options={options} height={100} width={30} />
    </div>
  );
};

export default DonutChartTransactions;