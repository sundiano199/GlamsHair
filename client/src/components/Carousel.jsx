import React, { useState, useEffect } from "react";

const Carousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  // Optional: auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 3000);
    return () => clearInterval(interval);
  }, [length]);

  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);
  const nextSlide = () => setCurrent((current + 1) % length);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {images.map((img, idx) => (
        <div key={idx} className={`${idx === current ? "block" : "hidden"}`}>
          <img src={img} alt={`Slide ${idx}`} className="w-full" />
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
