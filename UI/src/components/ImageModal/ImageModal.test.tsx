import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ImageModal from "./ImageModal";
import { Post } from "../../interfaces";
import { postService } from "../../services";

vi.mock("../../services/postService");

describe("ImageModal", () => {
  const mockPost: Post = {
    id: 1,
    imagePath: "path/to/image.jpg",
    imageIsBlurred: false,
    createdAt: new Date(),
  };

  const mockOnClose = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnNavigate = vi.fn();

  it("renders the modal with the image", () => {
    render(
      <ImageModal
        post={mockPost}
        totalPosts={5}
        currentIndex={0}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    render(
      <ImageModal
        post={mockPost}
        totalPosts={5}
        currentIndex={0}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        onNavigate={mockOnNavigate}
      />
    );

    fireEvent.click(screen.getByTestId("close-button"));
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it("calls onDelete when the delete button is clicked", async () => {
    vi.mocked(postService.deletePost).mockResolvedValueOnce({} as any);

    render(
      <ImageModal
        post={mockPost}
        totalPosts={5}
        currentIndex={0}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        onNavigate={mockOnNavigate}
      />
    );

    fireEvent.click(screen.getByTestId("delete-button"));
    await waitFor(() => expect(mockOnDelete).toHaveBeenCalled());
  });

  it("navigates to the next image when the next button is clicked", async () => {
    render(
      <ImageModal
        post={mockPost}
        totalPosts={5}
        currentIndex={0}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        onNavigate={mockOnNavigate}
      />
    );

    fireEvent.click(screen.getByTestId("next-button"));
    await waitFor(() => expect(mockOnNavigate).toHaveBeenCalledWith(1));
  });

  it("navigates to the previous image when the previous button is clicked", async () => {
    render(
      <ImageModal
        post={mockPost}
        totalPosts={5}
        currentIndex={1}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        onNavigate={mockOnNavigate}
      />
    );

    fireEvent.click(screen.getByTestId("previous-button"));
    await waitFor(() => expect(mockOnNavigate).toHaveBeenCalledWith(0));
  });
});
