function getPlaceholders(n: number) {
  return new Array(n).fill(0).map((_, index) => index);
};

export default getPlaceholders;