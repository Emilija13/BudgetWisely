import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Transaction } from '../../models/Transaction';
import { TransactionService } from '../../services/TransactionService';
import { BarChartTransactionsProps } from '../props/BarChartTransactionsProps';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TooltipItem } from 'chart.js';
import { ChartOptions } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const BarChartTransactions = ({ filterDto }: BarChartTransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await TransactionService.filter(filterDto);
      setTransactions(response.data.transactions);
    };

    fetchTransactions();
  }, [filterDto]);

  const getGroupedData = () => {
    const groupedData: { [date: string]: { income: number; expense: number } } = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!groupedData[date]) {
        groupedData[date] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'INCOME') {
        groupedData[date].income += transaction.cost;
      } else if (transaction.type === 'EXPENSE') {
        groupedData[date].expense += transaction.cost;
      }
    });

    return groupedData;
  };

  const groupedData = getGroupedData();

  const xLabels = Object.keys(groupedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const incomeData = xLabels.map((date) => groupedData[date].income);
  const expenseData = xLabels.map((date) => groupedData[date].expense);

  const data = {
    labels: xLabels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#00B58D',
        borderColor: '#00B58D',
        borderWidth: 1,
        borderRadius: 10,
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: '#FF6161',
        borderColor: '#FF6161',
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    animation: false,
    devicePixelRatio: 4,
    plugins: {
      legend: {
        position: 'bottom' as const, 
        labels: {
            usePointStyle: true,
            pointStyle: 'rect', 
            padding: 20, 
          },
      },
      tooltip: {
        callbacks: {
            label: (tooltipItem: TooltipItem<'bar'>) => {
              const datasetIndex = tooltipItem.datasetIndex;
              const date = tooltipItem.label; 
              
              const income = groupedData[date]?.income || null;
              const expense = groupedData[date]?.expense || null;
      
              let tooltipText = '';
              
              if (datasetIndex === 0 && income !== null) {
                tooltipText += `Income: ${income.toFixed(2)} MKD`;
              } 
              
              if (datasetIndex === 1 && expense !== null) {
                if (tooltipText) tooltipText += ' / ';
                tooltipText += `Expense: ${expense.toFixed(2)} MKD`;
              }
              
              return tooltipText;
            },
          }, 
        mode: 'index', 
        intersect: false, 
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
            display: true, 
            // borderColor: '#ddd', 
            // borderWidth: 1,
            lineWidth: 1,
            color: 'rgba(0, 0, 0, 0.1)', 
          },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (MKD)',
        },
        grid: {
          display: false,
        },
        beginAtZero: true
      },
    },
  };

  return (
    <div className='mt-[3rem]'>
      <Bar data={data} options={options} height={300} width={600} />
    </div>
  );
};

export default BarChartTransactions;