import { Doughnut } from 'react-chartjs-2';
import { Transaction } from '../../models/Transaction';
import { FilteredTransactionsDto } from '../../models/dto/FilteredTransactionsDto'; // Import the interface
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChartTransactions = ({ filteredTransactionsDto }: { filteredTransactionsDto?: FilteredTransactionsDto }) => {
  // Check if filteredTransactionsDto is undefined or not
  const transactions = filteredTransactionsDto?.transactions || [];
  const totalAmount = filteredTransactionsDto?.totalAmount ?? 0;

  const getCategoryData = () => {
    const transactionData: { [category: string]: number } = {};

    transactions.forEach((transaction: Transaction) => {
      const category = transaction.category.name || 'Other';

      if (!transactionData[category]) {
        transactionData[category] = 0;
      }

      if (transaction.type === 'EXPENSE') {
        transactionData[category] += transaction.cost;
      }
    });

    return transactionData;
  };

  const transactionData = getCategoryData();
  const labels = Object.keys(transactionData);
  const expenseData = labels.map((category) => transactionData[category]);

  // Add a default "No Expenses" case when there are no transactions
  const chartLabels = transactions.length > 0 ? labels : ['No Expenses'];
  const chartData = transactions.length > 0 ? expenseData : [1]; // Placeholder value to render the chart

  const backgroundColors = [
    '#475EE1', '#FF6161', '#00B58D', '#FF9304', '#19CFFC', '#FFC3D2', '#EA132F', '#273B7A', '#FFE370',
    '#9076FB', '#00EC9D', '#F741DF', '#79BAFF', '#96FF26', '#D050C7', '#FFC550',
  ];

  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: transactions.length > 0 ? backgroundColors.slice(0, chartLabels.length) : ['#D3D3D3'], // Gray for "No Expenses"
        borderRadius: 0,
        borderWidth: 0,
        spacing: 0,
        totalAmount, // Pass the totalAmount here
      },
    ],
  };

  const legendMargin = {
    id: 'legendMargin',
    beforeInit: function (chart: any) {
      const fitValue = chart.legend.fit;
      chart.legend.fit = function fit() {
        fitValue.bind(chart.legend)();
        return (this.height += 40);
      };
    },
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    aspectRatio: 1.9,
    maintainAspectRatio: true,
    cutout: '94%',
    devicePixelRatio: 4,
    plugins: {
      legend: {
        maxHeight: 1,
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 20,
          boxWidth: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const category = tooltipItem.label;
            const value = transactions.length > 0 ? transactionData[category] || 0 : 0;
            return `${category}: ${value.toFixed(2)} MKD`;
          },
        },
      },
    },
  };

  const doughnutLabel = {
    id: 'doughnutLabel',
    beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
      const { ctx } = chart;
      ctx.save();

      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;

      ctx.font = '600 38px inter';
      ctx.fillStyle = '#2E2B5C';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Ensure totalAmount is always defined and set it to 0 if not provided
      const totalAmount = chart.data.datasets[0].totalAmount ?? 0;

      // Ensure that totalAmount is a valid number before drawing
      ctx.fillText(`${totalAmount}`, xCoor, yCoor - 5);
      ctx.font = '500 22px inter';
      ctx.fillText(`MKD`, xCoor, yCoor + 25);
    },
  };

  return (
    <div>
      <Doughnut className='' data={data} options={options} plugins={[legendMargin, doughnutLabel]} height={100} width={30} style={{ width: '300px', height: '300px' }} />
    </div>
  );
};

export default DonutChartTransactions;
