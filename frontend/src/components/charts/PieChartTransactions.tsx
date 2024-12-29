import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Transaction } from '../../models/Transaction';
import { TransactionService } from '../../services/TransactionService';
import { BarChartTransactionsProps } from '../props/BarChartTransactionsProps';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';
import { ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartTransactions = ({ filterDto }: BarChartTransactionsProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await TransactionService.filter(filterDto);
            setTransactions(response.data.transactions);
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
                    '#475ee1', // Blue
                    '#d050c7', // Red
                    '#ff5a9a', // Yellow
                    '#ff8a6e', // Green
                    '#ffc358', // Cyan
                    '#f9f871', // LightPink
                    
                    '#9bde7e', // BrightRed
                    '#4bbc8e', // DarkPurple
                    '#039590', // Purple
                    '#1c6e7d', // LightGreen
                    '#2f4858', // Pink

                    '#79BAFF', // LightBlue
                    '#96FF26', // Lime
                    '#D050C7', // Lilac
                    '#FFC550', // Honey
                ],
                borderRadius: 0,
                borderWidth: 0,
            },
        ],
    };

    const options: ChartOptions<"pie"> = {
        responsive: true,
        aspectRatio: 1.4,
        devicePixelRatio: 4,
        plugins: {
            legend: {
                position: "right",
                labels: {
                    usePointStyle: true,
                    pointStyle: "rect",
                    padding: 20,
                    boxWidth: 30,
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<'pie'>) => {
                        const category = tooltipItem.label;
                        const expense = categoryData[category] || 0;
                        return `${category}: ${expense.toFixed(2)} MKD`;
                    },
                },
            },
        },
    };

    return (
        // <div className='relative p-10'>
        //   <div className='absolute top-[10rem] left-[10rem] transform -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-md'>
        //     <div className='inter'>{formattedTotal}</div>
        //     <div className='text-md font-normal text-2xl'>MKD</div>
        //   </div>
        <div>
            <Pie data={data} options={options} height={30} width={30} />
        </div>
        // </div>
    );
};

export default PieChartTransactions;
