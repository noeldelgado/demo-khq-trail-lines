import { useState } from 'react';
import TrailLinesContainer from './components/TrailLinesContainer';
import './Demo.css'

function Demo() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section id="top">
        <header></header>
        <p>Announcement message goes here</p>
        <hgroup>
          <h1>
            Debug, Design & Test
            <br/>
            every API intuitively
          </h1>
          <p role="doc-subtitle">
            Increase API productivity with the insomnia desktop
            <br/>
            application, end-to-end encrypted by default.
          </p>
        </hgroup>
        <button onClick={() => setCount(count + 1)}>Get Started for Free {count}</button>
        <TrailLinesContainer hideBefore={600} />
      </section>
      <section id="customers">
        <h2>More than 1300,000 developers love insomnia, including:</h2>
        <ul role="list">
          <li>NETFLIX</li>
          <li>Nasdaq</li>
          <li>RedBull</li>
          <li>facebook</li>
          <li>salesforce</li>
          <li>Zillow</li>
          <li>SONOS</li>
          <li>mastercard</li>
          <li>NBCUniversal</li>
          <li>TESLA</li>
          <li>wework</li>
        </ul>
      </section>
    </>
  );
}

export default Demo;
