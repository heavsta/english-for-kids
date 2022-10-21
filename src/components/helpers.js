function shuffleArray(array) {
  // eslint-disable-next-line no-plusplus
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function percentage(x, y) {
  if (x === 0 && y === 0) return 0;
  return ((x / (x + y)) * 100).toFixed(2);
}

export default { shuffleArray, percentage };
