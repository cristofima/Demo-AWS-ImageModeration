import React, { useTransition, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { Post } from "../../interfaces";
import { postService } from "../../services";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { FaTrashCan, FaXmark } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ImageModalProps {
  post: Post;
  totalPosts: number;
  currentIndex: number;
  onClose: () => void;
  onDelete: () => void;
  onNavigate: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  post,
  totalPosts,
  currentIndex,
  onClose,
  onDelete,
  onNavigate,
}) => {
  const [isDeleting, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < totalPosts - 1) {
        onNavigate(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalPosts, onNavigate]);

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      try {
        await postService.deletePost(post.id);
        toast.success("Post deleted successfully");
        onDelete();
        onClose();
      } catch {
        toast.error("Failed to delete post");
      }
    });
  }, [post.id, onDelete, onClose]);

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
                    isIconOnly
                    data-testid="previous-button"
                    onPress={() => onNavigate(currentIndex - 1)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
                    variant="light"
                    size="lg"
                  >
                    <FaChevronLeft />
                  </Button>
                )}

                {currentIndex < totalPosts - 1 && (
                  <Button
                    isIconOnly
                    data-testid="next-button"
                    onPress={() => onNavigate(currentIndex + 1)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
                    variant="light"
                    size="lg"
                  >
                    <FaChevronRight />
                  </Button>
                )}
                <img
                  alt=""
                  src={post.imagePath}
                  className="object-contain max-h-full max-w-full"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Uploaded on: {new Date(post.createdAt).toLocaleString()}
              </p>
            </ModalBody>

            <ModalFooter className="flex justify-end gap-2">
              <Button
                data-testid="close-button"
                onPress={onModalClose}
                isDisabled={isDeleting}
                startContent={!isDeleting && <FaXmark />}
              >
                Close
              </Button>
              <Button
                color="danger"
                data-testid="delete-button"
                onPress={handleDelete}
                isDisabled={isDeleting}
                isLoading={isDeleting}
                startContent={!isDeleting && <FaTrashCan />}
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
