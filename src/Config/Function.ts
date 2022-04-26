export const numberWithCommas = (x: number) =>
  x > 1
    ? x
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : x;

export const removeHTTP = (url: string) => {
  return url
    ?.replace(/^https?:\/\//, "")
    ?.replace("www.", "")
    ?.split("/")[0];
};
