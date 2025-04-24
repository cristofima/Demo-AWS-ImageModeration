import React, { useTransition, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { Image } from "../../models/image.model";
import apiService from "../../services/api-service";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

interface ImageModalProps {
  images: Image[];
  currentIndex: number;
  onClose: () => void;
  onDelete: () => void;
  onNavigate: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  onClose,
  onDelete,
  onNavigate,
}) => {
  const [isDeleting, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const image = images[currentIndex];

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        onNavigate(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onNavigate]);

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      hideCloseButton={true}
      size="lg"
      scrollBehavior="outside"
      className="!overflow-hidden"
    >
      <ModalContent>
        {(onModalClose) => (
          <>
            <ModalBody className="relative overflow-hidden px-4 pt-2 pb-0">
              <div
                className="relative w-full flex justify-center"
                style={{ maxHeight: "calc(100vh - 12rem)" }}
              >
                {currentIndex > 0 && (
                  <Button
                    onPress={() => onNavigate(currentIndex - 1)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
                    variant="flat"
                    size="sm"
                  >
                    ◀
                  </Button>
                )}

                {currentIndex < images.length - 1 && (
                  <Button
                    onPress={() => onNavigate(currentIndex + 1)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
                    variant="flat"
                    size="sm"
                  >
                    ▶
                  </Button>
                )}
                <img
                  src={image.imagePath}
                  alt="Full"
                  className="object-contain max-h-full max-w-full"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Uploaded on: {new Date(image.createdAt).toLocaleString()}
              </p>
            </ModalBody>

            <ModalFooter className="flex justify-end gap-2">
              <Button onPress={onModalClose} isDisabled={isDeleting}>
                Close
              </Button>
              <Button
                color="danger"
                onPress={handleDelete}
                isDisabled={isDeleting}
                isLoading={isDeleting}
              >
                {isDeleting ? "Deleting" : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default React.memo(ImageModal);
