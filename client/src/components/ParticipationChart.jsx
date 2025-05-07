import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const ParticipationChart = ({ rawData, loading }) => {
  // derive the years present in rawData.dates
  const availableYears = useMemo(() => {
    if (!rawData?.dates) return [];
    const set = new Set();
    rawData.dates.forEach(ds => {
      const y = new Date(ds).getFullYear();
      if (!isNaN(y)) set.add(y);
    });
    return Array.from(set).sort();
  }, [rawData]);

  // auto-pick the latest year when data arrives
  const [selectedYear, setSelectedYear] = useState(null);
  useEffect(() => {
    if (availableYears.length) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears]);

  // build monthly counts
  const { chartData, maxAttempts } = useMemo(() => {
    if (!rawData?.dates || selectedYear === null) {
      return { chartData: null, maxAttempts: 0 };
    }
    const counts = new Array(12).fill(0);
    rawData.dates.forEach(ds => {
      const d = new Date(ds);
      if (!isNaN(d) && d.getFullYear() === selectedYear) {
        counts[d.getMonth()] += 1;
      }
    });
    const max = Math.max(...counts);
    return {
      chartData: {
        labels: months,
        datasets: [{
          label: "Exam Attempts",
          data: counts,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#3b82f6",
          pointRadius: ctx => ctx.dataIndex % 2 === 0 ? 5 : 3,
          pointHoverRadius: 10,
        }],
      },
      maxAttempts: max,
    };
  }, [rawData, selectedYear]);

  // chart options
  const chartOptions = useMemo(() => {
    const ticks = 6;
    const step = maxAttempts > 0 ? Math.ceil(maxAttempts / ticks) : 1;
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw} attempt${ctx.raw !== 1 ? "s" : ""}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "rgba(255,255,255,0.7)",
            callback(val, idx) {
              return idx % 2 === 0 ? this.getLabelForValue(val) : "";
            },
          },
          title: {
            display: true,
            text: `Months (${selectedYear})`,
            color: "rgba(255,255,255,0.7)",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "rgba(255,255,255,0.7)",
            stepSize: step,
            max: step * ticks,
          },
          title: {
            display: true,
            text: "Number of Attempts",
            color: "rgba(255,255,255,0.7)",
          },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    };
  }, [selectedYear, maxAttempts]);

  // loading state
  if (loading || selectedYear === null) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto">
          {availableYears.map(y => (
            <Skeleton key={y} className="h-8 w-16 rounded-md" />
          ))}
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
      {availableYears.length && chartData ? (
        <>
          <div className="flex gap-2 overflow-x-auto">
            {availableYears.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  selectedYear === y
                    ? "text-white bg-zinc-900"
                    : "text-zinc-300 bg-zinc-800"
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="h-70">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="text-sm text-zinc-400">
            <p>
              Total attempts in {selectedYear}:{" "}
              {chartData.datasets[0].data.reduce((s, v) => s + v, 0)}
            </p>
            <p>
              Peak month:{" "}
              {(() => {
                const data = chartData.datasets[0].data;
                const idx = data.indexOf(Math.max(...data));
                return idx >= 0
                  ? `${months[idx]} (${data[idx]} attempts)`
                  : "N/A";
              })()}
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No records found</p>
      )}
    </div>
  );
};

export default ParticipationChart;
