import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const DonutChartBudgetProgress = ({ totalAmount, spent }: { totalAmount: number; spent: number }) => {
    const remaining = Math.max(totalAmount - spent, 0);

    const data = {
        labels: ['Spent', 'Remaining'],
        datasets: [
            {
                data: [spent, remaining],
                backgroundColor: ['#2E3FA0', '#C8D0FF'],
                borderWidth: 0,
                spacing: 0,
                borderRadius: 1,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        devicePixelRatio: 4,
        cutout: '93%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rect',
                    generateLabels: (chart) => {
                        const dataset = chart.data.datasets[0];
                        const backgroundColors = dataset.backgroundColor as string[] || [];

                        return chart.data.labels!!.map((label, i) => ({
                            text: `${label}: ${dataset.data[i]} MKD`,
                            fillStyle: backgroundColors[i] || '#000000',
                            strokeStyle: 'transparent',
                            hidden: !chart.getDataVisibility(i),
                            lineCap: 'butt',
                            lineDash: [],
                            lineDashOffset: 0,
                            lineJoin: 'miter',
                            pointStyle: 'rect',
                            rotation: 0,
                        }));
                    },
                    padding: 20,
                    boxWidth: 30,
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const label = tooltipItem.label;
                        const value = tooltipItem.raw;
                        return `${label}: ${value.toFixed(2)} MKD`;
                    },
                },
            },
        },
        layout: {
            padding: {
                bottom: 20,
            },
        },
    };


    const doughnutLabel = {
        id: 'doughnutLabel',
        beforeDatasetsDraw(chart: any) {
            const { ctx } = chart;
            ctx.save();

            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;

            ctx.font = '600 35px Inter';
            ctx.fillStyle = '#2E2B5C';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(`${(spent / totalAmount * 100).toFixed(1)}%`, xCoor + 7, yCoor + 4);
            ctx.font = '500 16px Inter';
        },
    };

    return (
        <div style={{ width: '250px', height: '250px' }}>
            <Doughnut data={data} options={options} plugins={[doughnutLabel]} />
        </div>
    );
};

export default DonutChartBudgetProgress;
