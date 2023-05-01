export const formatNumber = (num: number): number | string => {
  if (num >= 1000) {
    return Math.floor(num / 1000) + "k";
  } else {
    return num;
  }
};
