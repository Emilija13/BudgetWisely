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
  Filler
} from "chart.js";
import { AccountService } from "../../services/AccountService";
import { FilterDto } from "../../models/dto/FilterDto";
import { BalanceDto } from "../../models/dto/BalanceDto";
import { ChartOptions } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const LineChartAccountBalance = ({ filterDto }: { filterDto: FilterDto }) => {
  const [processedData, setProcessedData] = useState<{ labels: string[]; dataPoints: number[] }>({
    labels: [],
    dataPoints: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date(filterDto.start!);
        const endDate = new Date(filterDto.end!);

        const isSameDay =
          startDate.toDateString() === endDate.toDateString();

        const response = await AccountService.getBalanceHistory(filterDto);
        const balanceHistory: BalanceDto[] = response.data;

        const groupedData = new Map<string, BalanceDto>();

        balanceHistory.forEach((item) => {
          const timestamp = new Date(item.timestamp);

          const dateKey = isSameDay
            ? timestamp.toISOString().slice(0, 13)
            : timestamp.toISOString().split("T")[0];

          const existing = groupedData.get(dateKey);

          if (
            !existing ||
            timestamp.getTime() > new Date(existing.timestamp).getTime() ||
            (timestamp.getTime() === new Date(existing.timestamp).getTime() &&
              new Date(item.createdAt).getTime() > new Date(existing.createdAt).getTime())
          ) {
            groupedData.set(dateKey, item);
          }
        });

        const sortedData = Array.from(groupedData.values()).sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const dateLabels: string[] = [];
        const dataPoints: number[] = [];

        sortedData.forEach((item) => {
          const timestamp = new Date(item.timestamp);

          const label = isSameDay
            ? timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
            : timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          dateLabels.push(label);
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
    labels: processedData.labels,
    datasets: [
      {
        label: "Account Balance (MKD)",
        data: processedData.dataPoints,
        fill: true,
        backgroundColor: "rgba(0, 181, 141, 0.2)",
        borderColor: "#00B58D",
        pointBackgroundColor: "#00B58D",
        pointBorderColor: "#00B58D",
        borderWidth: 2,
        tension: 0,
        pointRadius: 1,
        pointHoverRadius: 4,
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
          label: (tooltipItem: TooltipItem<"line">) => {
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
          text: processedData.labels.length > 0 && processedData.labels[0].includes(":") ? "Hour" : "Date",
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
        },
      },
    },
  };

  return (
    <Line data={data} options={options} height={100} width={350} />
  );
};

export default LineChartAccountBalance;
