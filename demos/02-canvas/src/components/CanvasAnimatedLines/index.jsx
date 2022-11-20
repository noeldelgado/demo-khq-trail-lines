import { forwardRef, useEffect } from 'react';
import T from '../../lib/tween';
import BezierCurve from '../../lib/curve';
import { getRandomIntInclusive } from '../../utils';
import { CANVAS_SIZE, LINE_WIDTH, ANIMATION_DURATION, TOTAL_ACTIVE_LINES, CURVES_DATA, GRADIENTS_DATA } from '../../utils/constants';

const CanvasAnimatedLines = forwardRef(function CanvasAnimatedLines(props, ref) {
  const { width, height } = CANVAS_SIZE;
  const curves = CURVES_DATA;

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    let linesAvailable = new Set([...curves]);

    ctx.canvas.width = Math.floor(width * devicePixelRatio);
    ctx.canvas.height = Math.floor(height * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.lineWidth = LINE_WIDTH;

    function pickRandomLine(delay = 0) {
      const randomLine = [...linesAvailable][Math.floor(Math.random() * linesAvailable.size)];
      const randomGradient = GRADIENTS_DATA[Math.floor(Math.random() * GRADIENTS_DATA.length)]

      if (!randomLine) return;
      linesAvailable.delete(randomLine);

      new T({
        a: { t1: -1, t2: 0, x1: -width, x2: 0 },
        b: { t1:  1, t2: 2, x1: width,  x2: width * 2 },
        delay,
        duration: ANIMATION_DURATION,
        onUpdate({ t1, t2, x1, x2 }) {
          const [p0, p1, p2, p3] = new BezierCurve(randomLine).split(t1, t2);

          // draw line
          const lineGradient = ctx.createLinearGradient(x1, 0, x2, 0);
          for (let i = 0, len = randomGradient.length; i < len; i++) {
            lineGradient.addColorStop(randomGradient[i][0], randomGradient[i][1]);
          }
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
          ctx.strokeStyle = lineGradient;
          ctx.stroke();

          // draw point
          const glowGradient = ctx.createRadialGradient(p3.x, p3.y, 0, p3.x, p3.y, 20);
          glowGradient.addColorStop(0, 'rgba(173 68 255 / .96)');
          glowGradient.addColorStop(1, 'rgba(173 68 255 / 0)');

          ctx.beginPath();
          ctx.arc(p3.x, p3.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p3.x, p3.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
        },
        onComplete() {
          linesAvailable.add(randomLine);
          pickRandomLine();
        }
      });
    }

    for (let i = 0; i < TOTAL_ACTIVE_LINES; i++) {
      pickRandomLine(getRandomIntInclusive(1000, 3000));
    }

    return () => T.clear();
  }, [width, height, curves]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
    ></canvas>
  );
});

export default CanvasAnimatedLines;
