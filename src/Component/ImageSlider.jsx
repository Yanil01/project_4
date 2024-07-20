import { useEffect, useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "./styles.css";

export default function ImageSlider({ url, limit = 5, page = 1 }) {
  const [images, setImages] = useState([]); // State to hold images fetched from API
  const [currentSlide, setCurrentSlide] = useState(0); // State to track the index of the current slide
  const [errorMsg, setErrorMsg] = useState(null); // State to hold error message if fetch fails
  const [loading, setLoading] = useState(false); // State to indicate loading state

  // Function to fetch images from the provided URL
  async function fetchImages(getUrl) {
    try {
      setLoading(true); // Set loading state to true

      // Fetch images with pagination parameters
      const response = await fetch(`${getUrl}list?page=${page}&limit=${limit}`);
      const data = await response.json(); // Parse JSON response

      if (data) {
        setImages(data); // Set fetched images to state
        setLoading(false); // Set loading state to false after successful fetch
      }
    } catch (e) {
      setErrorMsg(e.message); // Capture and set error message on fetch failure
      setLoading(false); // Set loading state to false on error
    }
  }

  // Function to handle clicking on previous button
  function handlePrevious() {
    setCurrentSlide((currentSlide) =>
      currentSlide === 0 ? images.length - 1 : currentSlide - 1
    );
  }

  // Function to handle clicking on next button
  function handleNext() {
    setCurrentSlide((currentSlide) =>
      currentSlide === images.length - 1 ? 0 : currentSlide + 1
    );
  }

  // Effect to fetch images when URL changes
  useEffect(() => {
    if (url !== "") fetchImages(url);
  }, [url]);

  // Render loading state if data is being fetched
  if (loading) {
    return <div className="slider-container">Loading data! Please wait...</div>;
  }

  // Render error message if fetch fails
  if (errorMsg !== null) {
    return <div className="slider-container">Error occurred! {errorMsg}</div>;
  }

  // Render slider with images, arrows, and indicators
  return (
    <div className="slider-container">
      {/* Left arrow button */}
      <div className="arrow arrow-left" onClick={handlePrevious}>
        <BsArrowLeftCircleFill className="arrow-icon" />
      </div>

      {/* Container for displaying current image */}
      <div className="image-container">
        {images && images.length > 0 && (
          <img
            key={images[currentSlide].id}
            alt={images[currentSlide].download_url}
            src={images[currentSlide].download_url}
            className="current-image"
          />
        )}
      </div>

      {/* Right arrow button */}
      <div className="arrow arrow-right" onClick={handleNext}>
        <BsArrowRightCircleFill className="arrow-icon" />
      </div>

      {/* Indicators for each image */}
      <div className="indicators">
        {images &&
          images.length > 0 &&
          images.map((_, index) => (
            <button
              key={index}
              className={
                currentSlide === index
                  ? "indicator active"
                  : "indicator inactive"
              }
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
      </div>
    </div>
  );
}
