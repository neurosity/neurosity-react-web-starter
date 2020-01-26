// calm probability from 0 to 1 - the higher the more calm
const calmRange = [0, 1];
const choppinessRange = [0, 2.5];
const windRange = [5, 25];
const sizeRange = [400, 1000];

export function mapCalmToWeather(calm) {
  const choppiness = mapRange({
    value: calm,
    fromRange: calmRange,
    toRange: choppinessRange,
    reverse: true
  });
  const wind = mapRange({
    value: calm,
    fromRange: calmRange,
    toRange: windRange,
    reverse: true
  });
  const size = mapRange({
    value: calm,
    fromRange: calmRange,
    toRange: sizeRange,
    reverse: false
  });
  return { choppiness, wind, size };
}

export function mapRange({
  value,
  fromRange,
  toRange,
  reverse = false
}) {
  const number = reverse ? reverseRange(value, fromRange) : value;
  const [fromMin, fromMax] = fromRange;
  const [toMin, toMax] = toRange;
  return (
    ((number - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin
  );
}

export function reverseRange(value, [min, max]) {
  return max + min - value;
}
