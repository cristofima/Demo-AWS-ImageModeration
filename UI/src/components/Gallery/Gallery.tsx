import React, { useState, useCallback } from "react";
import { Image } from "../../models/image.model";
import apiService from "../../services/api-service";
import ImageModal from "./ImageModal";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { ClipLoader } from "react-spinners";

const Gallery = () => {
  const fetchImages = useCallback(async (page: number) => {
    const response = await apiService.getImages(page);
    return response.data;
  }, []);

  const { images, setImages, isLoading, observerRef } =
    useInfiniteScroll(fetchImages);
  const [selectedImage, setSelectedImage] = useState<Image>();
  const [loadedImages, setLoadedImages] = useState<number[]>([]);

  const toggleBlur = useCallback((id: number) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, imageIsBlurred: !img.imageIsBlurred } : img
      )
    );
  }, [setImages]);

  const handleImageClick = useCallback((image: Image) => {
    setSelectedImage(image);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedImage(undefined);
  }, []);

  const handleImageDelete = useCallback(() => {
    const updatedImages = images.filter((img) => img.id !== selectedImage?.id);
    setImages(updatedImages);
  }, [images, selectedImage, setImages]);

  const handleImageLoad = useCallback((id: number) => {
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, id]);
  }, []);

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {images.map((image) => (
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
              className="click-overlay"
              onClick={() => handleImageClick(image)}
            ></div>
          </div>
        ))}
        <div ref={observerRef} className="h-10"></div>
      </div>
      {isLoading && (
        <div className="loading-container">
          <ClipLoader color="#3498db" size={80} />
        </div>
      )}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={handleModalClose}
          onDelete={handleImageDelete}
        />
      )}
    </div>
  );
};

export default React.memo(Gallery);
