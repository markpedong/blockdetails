import { Button } from "@mantine/core";
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
import { ChartComponent } from "../../../Components/ChartLoader";
import { chartDays, LineOptions } from "../../../Config/Variable";
import { useChartContext } from "../../../Context/ChartContext";
import { StyledPaper } from "../../../Styled Components/StyledChart";

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
  const { data, days, setDays, loading } = useChartContext();

  return loading ? (
    <ChartComponent />
  ) : (
    <>
      <Line
        options={LineOptions}
        data={{
          labels: data?.total_volumes?.map((coin) => {
            let date = new Date(coin[0]);
            let time =
              date.getHours() > 12
                ? `${date.getHours() - 12}: ${date.getMinutes()} PM`
                : `${date.getHours()}: ${date.getMinutes()} AM`;

            return days === 1 ? time : date.toLocaleDateString();
          }),

          datasets: [
            {
              data: data?.total_volumes?.map((coin) => coin[1]),
              borderColor: "#1686c7",
            },
          ],
        }}
      />
      <StyledPaper>
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
      </StyledPaper>
    </>
  );
};
