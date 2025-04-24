import { Card, CardContent } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useRef } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartConfig = {
  notAttempted: { label: "Not Attempted", color: "#94a3b8" },
  wrongAnswers:  { label: "Wrong Answers", color: "#f87171" },
  correctAnswers:{ label: "Correct Answers", color: "#4ade80" },
};

export function PieChartComponent({ correctAnswers, wrongAnswers, notAttempted }) {
  const chartRef = useRef(null);
  const total = notAttempted + wrongAnswers + correctAnswers;

  const data = {
    labels: Object.values(chartConfig).map(c => c.label),
    datasets: [{
      data: [notAttempted, wrongAnswers, correctAnswers],
      backgroundColor: Object.values(chartConfig).map(c => c.color),
      borderColor: "#1e293b",
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // we’ll render our own legend
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#334155",
        borderWidth: 1,
        callbacks: {
          label: ctx => {
            const v = ctx.parsed;
            const pct = total ? ((v / total) * 100).toFixed(1) : 0;
            return `${ctx.label}: ${v} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="bg-slate-800 shadow-lg rounded-xl overflow-hidden py-0">
      <CardContent className="p-6 bg-slate-900 flex flex-col items-center space-y-6">
        <div className="w-48 h-48">
          <Pie ref={chartRef} data={data} options={options} />
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          {Object.entries(chartConfig).map(([key, cfg]) => {
            const val = { notAttempted, wrongAnswers, correctAnswers }[key];
            const pct = total ? ((val / total) * 100).toFixed(1) : 0;
            return (
              <div key={key} className="flex flex-col items-center">
                <span
                  className="w-4 h-4 rounded-full mb-1"
                  style={{ backgroundColor: cfg.color }}
                />
                <p className="text-white font-medium text-nowrap">{cfg.label}</p>
                <p className="text-gray-400 text-sm text-nowrap">{val} ({pct}%)</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
