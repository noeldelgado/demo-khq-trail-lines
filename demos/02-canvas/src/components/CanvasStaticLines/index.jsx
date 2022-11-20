import { useEffect, useRef } from 'react';
import { CANVAS_SIZE, LINE_WIDTH, CURVES_DATA } from '../../utils/constants';

function CanvasStaticLines() {
  const refRoot = useRef();
  const { width, height } = CANVAS_SIZE;
  const curves = CURVES_DATA;

  useEffect(() => {
    const ctx = refRoot.current.getContext('2d');

    ctx.canvas.width = Math.floor(width * devicePixelRatio);
    ctx.canvas.height = Math.floor(height * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const g = ctx.createLinearGradient(0, 0, CANVAS_SIZE.width, 0);
    g.addColorStop(0, 'rgba(213 48 224 / 0)');
    g.addColorStop(1, 'rgba(213 48 224 / 1)');
    ctx.strokeStyle = g;
    ctx.lineWidth = LINE_WIDTH;

    for (let i = 0, len = curves.length; i < len; i++) {
      const [p0, p1, p2, p3] = curves[i];
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx.stroke();
    }
  }, [width, height, curves]);

  return (
    <canvas
      ref={refRoot}
      width={width}
      height={height}
    ></canvas>
  );
}

export default CanvasStaticLines;
