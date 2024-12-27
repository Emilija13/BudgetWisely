import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { AccountService } from "../../services/AccountService";
import { FilterDto } from "../../models/dto/FilterDto";
import { BalanceDto } from "../../models/dto/BalanceDto";
import { ChartOptions } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChartAccountBalance = ({ filterDto }: { filterDto: FilterDto }) => {
  const [processedData, setProcessedData] = useState<{ labels: string[]; dataPoints: number[] }>({
    labels: [],
    dataPoints: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch balance history using the provided filterDto
        const response = await AccountService.getBalanceHistory(filterDto);
        const balanceHistory: BalanceDto[] = response.data; // Ensure response data matches BalanceDto[]

        // Group data by date
        const groupedData = new Map<string, BalanceDto>();

        balanceHistory.forEach((item) => {
          const dateKey = new Date(item.timestamp).toISOString().split("T")[0]; // Extract the date part (yyyy-MM-dd)
          const existing = groupedData.get(dateKey);

          // Determine whether to replace the existing entry
          if (
            !existing || 
            new Date(item.timestamp).getTime() > new Date(existing.timestamp).getTime() ||
            (new Date(item.timestamp).getTime() === new Date(existing.timestamp).getTime() &&
              new Date(item.createdAt).getTime() > new Date(existing.createdAt).getTime())
          ) {
            groupedData.set(dateKey, item);
          }
        });

        // Sort grouped data by date
        const sortedData = Array.from(groupedData.values()).sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        // Prepare data points
        const dateLabels: string[] = [];
        const dataPoints: number[] = [];

        sortedData.forEach((item) => {
          const timestamp = new Date(item.timestamp);

          // Format the label as "MMM DD" (e.g., "Dec 19")
          const dateLabel = timestamp.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
          });

          dateLabels.push(dateLabel);
          dataPoints.push(item.totalBalance);
        });

        setProcessedData({ labels: dateLabels, dataPoints });
      } catch (error) {
        console.error("Error fetching balance history:", error);
      }
    };

    fetchData();
  }, [filterDto]);

  const data = {
    labels: processedData.labels, // X-axis labels (dates)
    datasets: [
      {
        label: "Account Balance (MKD)",
        data: processedData.dataPoints, // Y-axis data (balances)
        backgroundColor: "rgba(0, 181, 141, 0.2)", // Light green fill
        borderColor: "#475EE1", // Green line
        pointBackgroundColor: "#475EE1",
        pointBorderColor: "#475EE1",
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        pointRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    devicePixelRatio: 4,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'line'>) => {
            const value = tooltipItem.raw as number;
            return `Balance: ${value.toFixed(2)} MKD`;
          },
        },
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 4,
          // callback: (value: number) => value.toFixed(0),
        },
      },
    },
  };
  
  

  return (
    <div className="mt-4">
      <Line data={data} options={options} height={300} width={500} />
    </div>
  );
};

export default LineChartAccountBalance;