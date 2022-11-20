import { forwardRef, useEffect, useRef } from 'react';
import CanvasStaticLines from '../CanvasStaticLines';
import CanvasAnimatedLines from '../CanvasAnimatedLines';
import { CANVAS_SIZE } from '../../utils/constants';
import './style.css';

const TrailLines = forwardRef(function TrailLines(props, ref) {
  const refRoot = useRef();

  useEffect(() => {
    const { width, height } = CANVAS_SIZE;
    refRoot.current.style.setProperty('--trail-lines-width', `${width}px`);
    refRoot.current.style.setProperty('--trail-lines-height', `${height}px`);
  }, [CANVAS_SIZE.width, CANVAS_SIZE.height]);

  return (
    <div
      ref={refRoot}
      className="TrailLines"
    >
      <CanvasStaticLines />
      <CanvasAnimatedLines ref={ref} />
    </div>
  );
});

export default TrailLines;
