import { useEffect, useState } from "react";
import { Image } from "../../models/image.model";
import apiService from "../../services/api-service";
import "./Gallery.css";
import ImageModal from "./ImageModal";

const Gallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image>();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const response = await apiService.getImages();
    const updatedImages = response.data;
    setImages(updatedImages);
  };

  const toggleBlur = (id: string) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, imageIsBlurred: !img.imageIsBlurred } : img
      )
    );
  };

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const handleModalClose = () => {
    setSelectedImage(undefined);
  };

  const handleImageDelete = () => {
    const updatedImages = images.filter((img) => img.id !== selectedImage?.id);
    setImages(updatedImages);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {images.map((image) => (
          <div
            key={image.id}
            className={`gallery-item ${image.imageIsBlurred ? "blurred" : ""}`}
          >
            <img src={image.imagePath} alt="Uploaded" />
            {image.imageIsBlurred && (
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
      </div>
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

export default Gallery;
