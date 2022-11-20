import { number } from 'prop-types';
import { memo, createRef, useEffect, useState } from 'react';
import TrailLines from '../TrailLines';
import ProductPreview from '../ProductPreview';
import T from '../../lib/tween';
import './style.css';

const propTypes = {
  hideBefore: number,
};

function TrailLinesContainer({
  hideBefore = 600,
}) {
  const refCanvasA = createRef();
  const refCanvasB = createRef();
  const [hide, setHide] = useState({ matches: false });

  useEffect(() => {
    const ctxA = refCanvasA.current?.getContext('2d');
    const ctxB = refCanvasB.current?.getContext('2d');
    let raf;

    function loop(t) {
      raf = requestAnimationFrame(loop);
      ctxA.clearRect(0, 0, ctxA.canvas.width, ctxA.canvas.height);
      ctxB.clearRect(0, 0, ctxB.canvas.width, ctxB.canvas.height);
      T.update(t);
    }

    if (ctxA && ctxB) {
      raf = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(raf);
  }, [refCanvasA, refCanvasB]);

  useEffect(() => {
    const mq = matchMedia(`(max-width: ${hideBefore}px)`);
    if (mq?.addEventListener) mq.addEventListener('change', setHide);
    else mq.addListener(setHide);
    setHide(() => ({ matches: window.innerWidth <= hideBefore }));

    return () => {
      if (mq?.removeEventListener) mq.removeEventListener('change', setHide);
      else mq.removeListener(setHide);
    }
  }, [hideBefore]);

  if (hide?.matches) return;

  return (
    <div className="TrailLinesContainer">
      <TrailLines ref={refCanvasA} />
      <ProductPreview />
      <TrailLines ref={refCanvasB} />
    </div>
  );
}

TrailLinesContainer.propTypes = propTypes;
export default memo(TrailLinesContainer);
