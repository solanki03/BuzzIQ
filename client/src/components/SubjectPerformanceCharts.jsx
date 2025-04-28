import React, { useEffect, useState } from "react";
import axios from "axios";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Skeleton } from "./ui/skeleton";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const SubjectPerformanceAccordion = ({ topic, userId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    totalQuestions: 0,
  });

  const fetchTopicData = async () => {
    try {
      setLoading(true);
      setError(null);

      const formattedTopic = topic.toLowerCase().replace(/\s+/g, "_");

      const response = await axios.get(
        `http://localhost:5000/v1/results/${userId}/${formattedTopic}`
      );

      if (response.data.success) {
        const {
          totalCorrectAnswers,
          totalWrongAnswers,
          totalNotAttemptedAnswers,
          totalQuestions,
          totalAttempts,
        } = response.data.data;

        const percentageCorrect =
          totalQuestions > 0
            ? Math.round(
                (totalCorrectAnswers / (totalQuestions * totalAttempts)) * 100
              )
            : 0;
        const percentageWrong =
          totalQuestions > 0
            ? Math.round(
                (totalWrongAnswers / (totalQuestions * totalAttempts)) * 100
              )
            : 0;
        const percentageUnattempted =
          totalQuestions > 0
            ? Math.round(
                (totalNotAttemptedAnswers / (totalQuestions * totalAttempts)) *
                  100
              )
            : 0;

        const chartData = {
          labels: ["Correct", "Wrong", "Unattempted"],
          datasets: [
            {
              data: [
                totalCorrectAnswers,
                totalWrongAnswers,
                totalNotAttemptedAnswers,
              ],
              backgroundColor: [
                "rgba(75, 192, 192, 0.7)",
                "rgba(255, 99, 132, 0.7)",
                "rgba(153, 102, 255, 0.7)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 2,
            },
          ],
        };

        setChartData(chartData);
        setStats({
          totalAttempts,
          totalQuestions,
          percentageCorrect,
          percentageWrong,
          percentageUnattempted,
          totalCorrectAnswers,
          totalWrongAnswers,
          totalNotAttemptedAnswers,
        });
      } else {
        setError("No data found for this topic.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicData();
  }, [topic, userId]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {loading && (
        <div className="w-full py-2 flex flex-col items-center justify-center">
          <div className="w-64 h-64 rounded-full overflow-hidden">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
          <div className="flex justify-between w-full">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
        </div>
      )}

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      {chartData && (
        <div className="w-full">
          <div className="relative w-full h-72 mx-auto py-2">
            <PolarArea
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    min: 0,
                    max: stats.totalQuestions,
                    ticks: {
                      stepSize: Math.max(
                        1,
                        Math.ceil(stats.totalQuestions / 5)
                      ),
                      backdropColor: "transparent",
                      color: "#888",
                      font: {
                        weight: "bold",
                        size: 13,
                      },
                      padding: 18,
                    },
                    angleLines: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    pointLabels: {
                      padding: 20,
                      font: {
                        size: 14,
                        weight: "bold",
                      },
                      color: "#fff",
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    titleMarginBottom: 8,
                    bodySpacing: 2,
                    titleFont: {
                      size: 12,
                      weight: "bold",
                    },
                    bodyFont: {
                      size: 12,
                    },
                    backgroundColor: "rgba(0, 0, 0, 0.8)", // Tooltip background
                    titleColor: "#ffffff", // Title text color
                    bodyColor: "#cccccc", // Body text color
                    padding: 10,
                    boxPadding: 10,
                    borderWidth: 1,
                    borderColor: "#fff",
                    callbacks: {
                      label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;

                        // Get the corresponding percentage based on the label
                        let percentage;
                        switch (label) {
                          case "Correct":
                            percentage = stats.percentageCorrect;
                            break;
                          case "Wrong":
                            percentage = stats.percentageWrong;
                            break;
                          case "Unattempted":
                            percentage = stats.percentageUnattempted;
                            break;
                          default:
                            percentage = 0;
                        }

                        return [
                          `percentage: ${percentage}%`,
                          `number: ${value}`,
                        ];
                      },
                    },
                  },
                },
                elements: {
                  arc: {
                    borderWidth: 2,
                    borderColor: "#111",
                  },
                },
              }}
            />
          </div>

          <div className="text-sm w-full font-medium text-gray-600 flex justify-between">
            <span>Total attempts: {stats.totalAttempts}</span>
            <span>
              Questions/attempt: {stats.totalQuestions / stats.totalAttempts}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectPerformanceAccordion;
