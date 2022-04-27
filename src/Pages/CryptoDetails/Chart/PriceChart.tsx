import { Button, Paper } from "@mantine/core";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import { chartDays } from "../../../Config/Variable";
import { useChartContext } from "../../../Context/ChartContext";

type Props = {
  data: number[][];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PriceChart = () => {
  const { chart, days, setDays } = useChartContext();

  return (
    <>
      <Line
        options={{
          elements: {
            point: {
              radius: 1,
            },
          },
        }}
        data={{
          labels: chart.prices?.map((coin) => {
            let date = new Date(coin[0]);
            let time =
              date.getHours() > 12
                ? `${date.getHours() - 12}: ${date.getMinutes()} PM`
                : `${date.getHours()}: ${date.getMinutes()} AM`;

            return days === 1 ? time : date.toLocaleDateString();
          }),

          datasets: [
            {
              data: chart.prices?.map((coin) => coin[1]),
              label: `Price (Past ${days} Days) `,
              borderColor: "#3e95cd",
            },
          ],
        }}
      />
      <Paper
        mt="xl"
        style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}
      >
        {chartDays.map((day) => (
          <Button
            compact
            uppercase
            key={day.label}
            onClick={() => setDays(day.value)}
          >
            {day.label}
          </Button>
        ))}
      </Paper>
    </>
  );
};
