//get color between yellow and green based on weight
export function getColor(weight, opacity) {
  const color1 = [43, 209, 128];
  const color2 = [250, 193, 50];
  var w1 = weight;
  var w2 = 1 - w1;
  var rgb = [
    Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2),
  ];
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
}
