"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
    notAttempted: {
        label: "Not Attempted",
        color: "var(--chart-1)",
    },
    wrongAnswers: {
        label: "Wrong Answers",
        color: "var(--chart-2)",
    },
    correctAnswers: {
        label: "Correct Answers",
        color: "var(--chart-3)",
    },
};

export function PieChartComponent({
    correctAnswers,
    wrongAnswers,
    notAttempted,
}) {
    const chartData = [
        { label: "notAttempted", value: notAttempted, fill: "var(--chart-1)" },
        { label: "wrongAnswers", value: wrongAnswers, fill: "var(--chart-2)" },
        { label: "correctAnswers", value: correctAnswers, fill: "var(--chart-3)" },
    ];

    return (
        <Card className="flex flex-col bg-transparent">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <Pie data={chartData} dataKey="value" label nameKey="label" />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="label" />}
                            className="translate-y-1 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center text-white"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
