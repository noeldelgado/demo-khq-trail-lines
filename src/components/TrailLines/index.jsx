import { string, number } from 'prop-types';
import { memo, useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import './style.css';

gsap.registerPlugin(MotionPathPlugin);

gsap.registerEffect({
  name: 'trail',
  effect(targets, config) {
    const group = targets[0];
    const dot = group.querySelector('.dot');
    const rect = group.querySelector('rect');

    return gsap.timeline({
      defaults: {
        ease: 'none',
        duration: internals.DURATION,
      },
      ...config,
    })
      .set(dot, { opacity: 1 })
      .to(dot, {
        motionPath: {
          path: group.dataset.motionPath,
        },
        onUpdate() {
          rect.x.baseVal.value = gsap.getProperty(this.targets()[0], "x") - rect.width.baseVal.value;
        }
      }, '<')
      .to(rect, { attr: { x: '100%' } }, '>');
  }
});

const internals = {
  LINE_WIDTH: 1.5,
  DURATION: 2,
  TRIAL_SIZE_PERCENTAGE: '100%',
  GRADIENT_SUFFIXES: ['01', '02', '03', '04'],
  COMPACT_VERTICAL_SPACE: 20,
};

const propTypes = {
  id: string.isRequired,
  width: number,
  height: number,
  totalLines: number,
  totalActiveLines: number,
};

function TrailLines({
  id,
  width = 442,
  height = 820,
  totalLines = 19,
  totalActiveLines = 2,
}) {
  const refRoot = useRef();

  useEffect(() => {
    refRoot.current.style.setProperty('--trail-lines-width', `${width}px`);
    refRoot.current.style.setProperty('--trail-lines-height', `${height}px`);
  }, [width, height]);

  useLayoutEffect(() => {
    const animations = new Set();

    const ctx = gsap.context(() => {
      const groups = gsap.utils.toArray('.group-elements');
      let availableGroups = new Set([...groups]);

      function animate(delay = 0) {
        const group = gsap.utils.random([...availableGroups]);
        availableGroups.delete(group);

        if (!group) return;

        return gsap.effects.trail(group, {
          delay,
          onComplete() {
            availableGroups.add(group);
            animations.delete(this);
            animations.add(animate());
          },
        });
      }

      for (let i = 0; i < totalActiveLines; i++)
        animations.add(animate(gsap.utils.random(1, 3)));
    }, refRoot);

    return () => {
      ctx.revert();
      Array.from(animations).forEach(a => a?.revert());
    }
  }, []);

  return (
    <svg
      ref={refRoot}
      className="TrailLines"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="xMaxYMid slice"
    >
    <defs>
      <linearGradient id={`${id}-lgradient-base-lines`}>
        <stop offset="0" stopColor="#d530e0" stopOpacity="0" />
        <stop offset="1" stopColor="#d530e0" />
      </linearGradient>
      <linearGradient id={`${id}-lgradient-01`}>
        <stop offset="0.0" stopColor="rgba(255, 117, 134, 1)" stopOpacity="0" />
        <stop offset="0.5" stopColor="rgba(255, 117, 134, 1)" />
        <stop offset="1.0" stopColor="rgba(0, 217, 255, 1)" />
      </linearGradient>
      <linearGradient id={`${id}-lgradient-02`}>
        <stop offset="0.0" stopColor="rgba(255, 220, 0, 1)" stopOpacity="0" />
        <stop offset="0.5" stopColor="rgba(255, 220, 0, 1)" />
        <stop offset="1.0" stopColor="rgba(0, 255, 215, 1)" />
      </linearGradient>
      <linearGradient id={`${id}-lgradient-03`}>
        <stop offset="0.0" stopColor="rgba(0, 248, 255, 1)" stopOpacity="0" />
        <stop offset="0.5" stopColor="rgba(0, 248, 255, 1)" />
        <stop offset="1.0" stopColor="rgba(249, 253, 83, 1)" />
      </linearGradient>
      <linearGradient id={`${id}-lgradient-04`}>
        <stop offset="0.0" stopColor="rgba(255, 0, 31, 1)" stopOpacity="0" />
        <stop offset="0.5" stopColor="rgba(255, 0, 31, 1)" />
        <stop offset="1.0" stopColor="rgba(96, 255, 236, 1)" />
      </linearGradient>
      <radialGradient id={`${id}-rgradient-dot-back`}>
        <stop offset="0" stopColor="rgba(255, 233, 157, .2)" />
        <stop offset="1" stopColor="rgba(255, 233, 157, 0)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-rgradient-dot-front`}>
        <stop offset="0" stopColor="rgba(173, 68, 255, .96)" />
        <stop offset="1" stopColor="rgba(173, 68, 255, 0)" stopOpacity="0" />
      </radialGradient>
    </defs>
    {renderPaths({ id, width, height, totalLines })}
  </svg>
  );
}

function renderPaths({ id, width, height, totalLines }) {
  const aControlPointX = width / 2;
  const bControlPointX = width - (width / 3);
  const ySpace = height / (totalLines - 1);
  const ySpaceScaled = internals.COMPACT_VERTICAL_SPACE / 100;
  const yMid = Math.round(height / 2);
  const trim = (str) => str.split(/\n/).map(s => s.trim()).join(' ').trim();

  return (
    <>
      {Array.from({ length: totalLines }, (_, i) => {
        const y = ySpace * i;
        const yScaled = Math.round((y - yMid) * ySpaceScaled + yMid);
        const motionPath = trim(`
          M 0 ${y}
          C ${aControlPointX} ${y}
          ${bControlPointX} ${yScaled}
          ${width + 20} ${yScaled}
        `);
        const motionPathReverse = trim(`
          v ${internals.LINE_WIDTH}
          C ${bControlPointX} ${yScaled + internals.LINE_WIDTH}
          ${aControlPointX} ${y + internals.LINE_WIDTH}
          0 ${y + internals.LINE_WIDTH}
        `);

        return (
          <g
            key={`group-${id}-${i}`}
            className="group-elements"
            data-motion-path={motionPath}
          >
            <path
              d={`${motionPath} ${motionPathReverse}`}
              fill={`url(#${id}-lgradient-base-lines)`}
            />
            <clipPath id={`${id}-clip-path-${i}`}>
              <path d={`${motionPath} ${motionPathReverse}`} />
            </clipPath>
            <rect
              id={`${id}-rect-${i}`}
              width={internals.TRIAL_SIZE_PERCENTAGE}
              height="100%"
              fill={`url(#${id}-lgradient-${gsap.utils.random(internals.GRADIENT_SUFFIXES)})`}
              clipPath={`url(#${id}-clip-path-${i})`}
              x={`-${internals.TRIAL_SIZE_PERCENTAGE}`}
            />
            <g
              id="${id}-circles-${i}"
              className="dot"
              style={{ opacity: 0 }}
            >
              <circle r={internals.LINE_WIDTH * 20} fill={`url(#${id}-rgradient-dot-back)`} />
              <circle r={internals.LINE_WIDTH * 10} fill={`url(#${id}-rgradient-dot-front)`} />
              <circle r={internals.LINE_WIDTH * 1.5} fill="white" />
            </g>
          </g>
        );
      })}
    </>
  );
}

TrailLines.propTypes = propTypes;
export default memo(TrailLines);
