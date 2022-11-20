import './style.css';

function ProductPreview() {
  return (
    <div className="ProductPreview">
      <picture className="ProductPreview__glow">
        <img
          className="ProductPreview__glow-image"
          src="/glow.png"
          width="880"
          height="652"
          alt=""
        />
      </picture>
      <div className="ProductPreview__cover">
        <img
          className="ProductPreview__cover-image"
          src="/preview.png"
          srcSet="/preview@2x.png 2x"
          width="678"
          height="468"
          alt="Product UI Placeholder"
        />
      </div>
    </div>
  );
}

export default ProductPreview;
