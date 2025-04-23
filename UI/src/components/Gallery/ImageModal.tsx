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
  image: Image;
  onClose: () => void;
  onDelete: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onDelete,
}) => {
  const [isDeleting, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen();
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      size="lg"
    >
      <ModalContent className="max-h-[90vh] flex flex-col">
        {(onModalClose) => (
          <>
            <ModalBody className="flex-1 p-4 overflow-hidden flex flex-col items-center justify-center">
              <div className="w-full h-full flex justify-center overflow-hidden">
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
