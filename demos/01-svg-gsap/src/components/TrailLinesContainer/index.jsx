import { number } from 'prop-types';
import { useEffect, useState } from 'react';
import TrailLines from '../TrailLines';
import ProductPreview from '../ProductPreview';
import './style.css';

const propTypes = {
  hideBefore: number,
};

function TrailLinesContainer({ hideBefore = 600}) {
  const [hide, setHide] = useState({ matches: false });

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
      <TrailLines id="start" />
      <ProductPreview />
      <TrailLines id="end" />
    </div>
  );
}

TrailLinesContainer.propTypes = propTypes;
export default TrailLinesContainer;
