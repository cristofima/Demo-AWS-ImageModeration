import React, { useState, useCallback } from "react";
import apiService from "../../services/api-service";
import ImageModal from "./ImageModal";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { Spinner } from "@heroui/spinner";
import "./Gallery.css";

const Gallery = () => {
  const fetchImages = useCallback(async (page: number) => {
    const response = await apiService.getImages(page);
    return response.data;
  }, []);

  const { images, setImages, isLoading, observerRef } =
    useInfiniteScroll(fetchImages);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<number[]>([]);

  const toggleBlur = useCallback(
    (id: number) => {
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === id ? { ...img, imageIsBlurred: !img.imageIsBlurred } : img
        )
      );
    },
    [setImages]
  );

  const handleImageClick = useCallback(
    (index: number) => {
      if (!images[index].imageIsBlurred) {
        setSelectedIndex(index);
      }
    },
    [images]
  );

  const handleModalClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleImageDelete = useCallback(() => {
    if (selectedIndex === null) return;
    const updatedImages = images.filter((_, index) => index !== selectedIndex);
    setImages(updatedImages);
    setSelectedIndex(null);
  }, [images, selectedIndex, setImages]);

  const handleImageLoad = useCallback((id: number) => {
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, id]);
  }, []);

  const handleNavigate = useCallback(
    (newIndex: number) => {
      if (newIndex >= 0 && newIndex < images.length) {
        setSelectedIndex(newIndex);
      }
    },
    [images.length]
  );

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`gallery-item ${image.imageIsBlurred ? "blurred" : ""}`}
          >
            <img
              src={image.imagePath}
              alt="Uploaded"
              onLoad={() => handleImageLoad(image.id)}
            />
            {image.imageIsBlurred && loadedImages.includes(image.id) && (
              <button
                className="toggle-blur-button"
                onClick={() => toggleBlur(image.id)}
              >
                Show Image
              </button>
            )}
            <div
              className={`click-overlay ${
                !image.imageIsBlurred ? "click-overlay--safe" : ""
              }`}
              onClick={() => handleImageClick(index)}
            ></div>
          </div>
        ))}
        <div ref={observerRef} className="h-10"></div>
      </div>
      {isLoading && (
        <div className="loading-container">
          <Spinner size="lg" />
        </div>
      )}
      {selectedIndex !== null && (
        <ImageModal
          images={images}
          currentIndex={selectedIndex}
          onClose={handleModalClose}
          onDelete={handleImageDelete}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default React.memo(Gallery);
