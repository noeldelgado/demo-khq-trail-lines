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
    mq.addEventListener('change', setHide);
    setHide(() => ({ matches: window.innerWidth <= hideBefore }));

    return () => mq.removeEventListener('change', setHide);
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
