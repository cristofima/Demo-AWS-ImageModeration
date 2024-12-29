import { useState } from "react";
import { toast } from "react-toastify";
import { Image } from "../../models/image.model";
import apiService from "../../services/api-service";
import "./Gallery.css";
import "./ImageModal.css";

interface ImageModalProps {
  image: Image;
  onClose: () => void;
  onDelete: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onDelete,
}) => {
  const [isBlurred, setIsBlurred] = useState(image.imageIsBlurred);

  const toggleBlur = () => {
    setIsBlurred((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteImage(image.id);
      toast.success("Image deleted successfully");
      onDelete();
      onClose();
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <>
      <div className="modal-overlay"></div>
      <div className="modal-content">
        <div className={`modal-image-wrapper ${isBlurred ? "blurred" : ""}`}>
          <img src={image.imagePath} alt="Full" />
          {isBlurred && (
            <button className="toggle-blur-button" onClick={toggleBlur}>
              Show Image
            </button>
          )}
        </div>
        <p className="created-at">
          Uploaded on: {new Date(image.createdAt).toLocaleString()}
        </p>
        <div className="modal-actions">
          <button onClick={handleDelete} className="button delete-button">
            Delete
          </button>
          <button className="button close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageModal;