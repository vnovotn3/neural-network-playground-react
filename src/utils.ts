//get color between yellow and green based on weight
export function getColor(weight: number, opacity: number): string {
  const blue = [109, 105, 247];
  const yellow = [255, 207, 87];
  const neutral = [222, 222, 237];

  const selectedColor = weight > 0 ? blue : yellow;
  var w1 = Math.abs(weight);
  var w2 = 1 - w1;
  var rgb = [
    Math.round(selectedColor[0] * w1 + neutral[0] * w2),
    Math.round(selectedColor[1] * w1 + neutral[1] * w2),
    Math.round(selectedColor[2] * w1 + neutral[2] * w2),
  ];
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
}

export function remToPx(rem: number): number {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
