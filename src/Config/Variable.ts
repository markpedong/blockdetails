export const HEADER_HEIGHT = 60;
export const chartDays = [
  { label: "1D", value: 1 },
  { label: "30D", value: 30 },
  { label: "60D", value: 60 },
  { label: "90D", value: 90 },
  { label: "1Y", value: 365 },
  { label: "MAX", value: "max" },
];

export const LineOptions = {
  elements: {
    point: {
      radius: 1,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};
