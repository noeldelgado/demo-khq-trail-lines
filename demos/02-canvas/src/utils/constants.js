export const CANVAS_SIZE = {
  width: 442,
  height: 820,
};
export const LINE_WIDTH = 1.5;
export const ANIMATION_DURATION = 4000;
export const TOTAL_ACTIVE_LINES = 2;

export const CURVES_DATA = getCurvesData(
  CANVAS_SIZE.width,
  CANVAS_SIZE.height,
  19,
);

export const GRADIENTS_DATA = [
  [
    [0.05, 'rgba(255 117 134 / 0)'],
    [0.5, 'rgba(255 117 134 / 1)'],
    [1.0, 'rgba(0 217 255 / 1)']
  ],
  [
    [0.05, 'rgba(255 220 0 / 0)'],
    [0.5, 'rgba(255 220 0 / 1)'],
    [1.0, 'rgba(0 255 215 / 1)']
  ],
  [
    [0.05, 'rgba(0 248 255 / 0)'],
    [0.5, 'rgba(0 248 255 / 1)'],
    [1.0, 'rgba(249 253 83 / 1)']
  ],
  [
    [0.05, 'rgba(255 0 31 / 0)'],
    [0.5, 'rgba(255 0 31 / 1)'],
    [1.0, 'rgba(96 255 236 / 1)']
  ],
];

function getCurvesData(width, height, total) {
  const controlPoint1 = Math.round(width / 2);
  const controlPoint2 = Math.round(width / 3);
  const ySpace = Math.floor(height / (total - 1));
  const scaledYspace = 20 / 100;
  const yMid = Math.round(height / 2);
  let res = [];

  for (let i = 0; i < total; i++) {
    const y = ySpace * i;
    const yScaled = Math.round((y - yMid) * scaledYspace + yMid);

    res.push([
      { x: 0, y },
      { x: controlPoint1, y },
      { x: width - controlPoint2, y: yScaled },
      { x: width + 20, y: yScaled },
    ]);
  }

  return res;
}
