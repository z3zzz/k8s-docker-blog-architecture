export const randomId = (length: number = 5) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};
