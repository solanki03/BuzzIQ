import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const ParticipationChart = ({ rawData, loading, selectedYear, availableYears, setSelectedYear }) => {
  const { chartData, maxAttempts } = useMemo(() => {
    if (!rawData || !selectedYear) return { chartData: null, maxAttempts: 0 };

    const monthlyAttempts = Array(12).fill(0);
    rawData.forEach((item) => {
      const date = new Date(item.date);
      if (date.getFullYear() === selectedYear) {
        monthlyAttempts[date.getMonth()] += 1;
      }
    });

    const maxAttempts = Math.max(...monthlyAttempts);

    return {
      chartData: {
        labels: months,
        datasets: [
          {
            label: "Exam Attempts",
            data: monthlyAttempts,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.3,
            fill: true,
            pointBackgroundColor: "#3b82f6",
            pointRadius: (ctx) => {
              const index = ctx.dataIndex;
              const showEvery = 2;
              return index % showEvery === 0 ? 5 : 0;
            },
            pointHoverRadius: 10,
          },
        ],
      },
      maxAttempts,
    };
  }, [rawData, selectedYear]);

  const chartOptions = useMemo(() => {
    const desiredTicks = 6;
    const step = maxAttempts > 0 ? Math.ceil(maxAttempts / desiredTicks) : 1;
    const suggestedMax = step * desiredTicks;

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.raw} attempt${context.raw !== 1 ? "s" : ""}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            callback: function (val, index) {
              const showEvery = 2;
              return index % showEvery === 0 ? this.getLabelForValue(val) : "";
            },
          },
          title: {
            display: true,
            text: selectedYear ? `Months (${selectedYear})` : "Months",
            color: "rgba(255, 255, 255, 0.7)",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            stepSize: step,
            max: suggestedMax,
          },
          title: {
            display: true,
            text: "Number of Attempts",
            color: "rgba(255, 255, 255, 0.7)",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    };
  }, [selectedYear, maxAttempts]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex space-x-2 overflow-x-auto">
            {availableYears.map((year) => (
              <Skeleton key={year} className="h-8 w-16 rounded-md" />
            ))}
          </div>
        </div>
        
        <Skeleton className="h-70 w-full rounded-md" />
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rawData?.length ? (
        <>
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex space-x-2 overflow-x-auto">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-300 rounded-md ${
                    selectedYear === year
                      ? "text-white bg-zinc-900 hover:bg-zinc-800"
                      : "text-zinc-300 bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="h-70">
            {chartData && (
              <Line
                data={chartData}
                options={chartOptions}
                key={selectedYear}
              />
            )}
          </div>

          <div className="text-sm text-zinc-400">
            <p>
              Total attempts in {selectedYear}:{" "}
              {chartData?.datasets[0].data.reduce((sum, val) => sum + val, 0)}
            </p>
            <p>
              Peak month:{" "}
              {(() => {
                const data = chartData?.datasets[0].data || [];
                const peakIndex = data.indexOf(Math.max(...data));
                return peakIndex >= 0
                  ? `${months[peakIndex]} (${data[peakIndex]} attempts)`
                  : "N/A";
              })()}
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          {rawData === null
            ? "Re-Open the sheet to load data"
            : "No records found"}
        </p>
      )}
    </div>
  );
};

export default ParticipationChart;