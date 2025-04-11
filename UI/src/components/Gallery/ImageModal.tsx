import React, { useState, useTransition, useCallback } from "react";
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
  const [isDeleting, startTransition] = useTransition();

  const toggleBlur = useCallback(() => {
    setIsBlurred((prev) => !prev);
  }, []);

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      try {
        await apiService.deleteImage(image.id);
        toast.success("Image deleted successfully");
        onDelete();
        onClose();
      } catch {
        toast.error("Failed to delete image");
      }
    });
  }, [image.id, onDelete, onClose]);

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
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="button delete-button"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button className="button close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(ImageModal);
