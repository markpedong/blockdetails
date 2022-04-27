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

export const VolumeChart = () => {
  const { chart, days } = useChartContext();

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
          labels: chart.total_volumes?.map((coin) => {
            let date = new Date(coin[0]);
            let time =
              date.getHours() > 12
                ? `${date.getHours() - 12}: ${date.getMinutes()} PM`
                : `${date.getHours()}: ${date.getMinutes()} AM`;

            return days === 1 ? time : date.toLocaleDateString();
          }),

          datasets: [
            {
              data: chart.total_volumes?.map((coin) => coin[1]),
              label: `Price (Past ${days} Days) `,
              borderColor: "#3e95cd",
            },
          ],
        }}
      />
    </>
  );
};
