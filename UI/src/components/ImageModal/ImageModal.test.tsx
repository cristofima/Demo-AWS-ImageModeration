import { vi, describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "../../utils/test-utils";
import { render } from "../../utils/test-utils";
import ImageModal from "./ImageModal";
import { mockPost } from "../../utils/test-data";

describe("ImageModal", () => {
  const mockOnClose = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnNavigate = vi.fn();

  const defaultProps = {
    post: mockPost,
    totalPosts: 5,
    currentIndex: 0,
    onClose: mockOnClose,
    onDelete: mockOnDelete,
    onNavigate: mockOnNavigate,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls onClose when the close button is clicked", async () => {
    render(<ImageModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onDelete when the delete button is clicked", async () => {
    render(<ImageModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it("shows loading state when deleting", async () => {
    render(<ImageModal {...defaultProps} isDeleting={true} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toBeDisabled();
  });

  it("handles navigation with previous button", async () => {
    render(<ImageModal {...defaultProps} currentIndex={2} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const prevButton = screen.getByTestId("previous-button");
    fireEvent.click(prevButton);

    expect(mockOnNavigate).toHaveBeenCalledWith(1);
  });

  it("handles navigation with next button", async () => {
    render(<ImageModal {...defaultProps} currentIndex={2} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);

    expect(mockOnNavigate).toHaveBeenCalledWith(3);
  });

  it("disables previous button on first image", async () => {
    render(<ImageModal {...defaultProps} currentIndex={0} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const prevButton = screen.queryByTestId("previous-button");
    expect(prevButton).not.toBeInTheDocument();
  });

  it("disables next button on last image", async () => {
    render(<ImageModal {...defaultProps} currentIndex={4} totalPosts={5} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const nextButton = screen.queryByTestId("next-button");
    expect(nextButton).not.toBeInTheDocument();
  });

  it("handles keyboard navigation", async () => {
    render(<ImageModal {...defaultProps} currentIndex={2} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Simulate left arrow key
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(mockOnNavigate).toHaveBeenCalledWith(1);

    // Simulate right arrow key
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(mockOnNavigate).toHaveBeenCalledWith(3);
  });

  it("displays post creation date", async () => {
    render(<ImageModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    expect(screen.getByText(/Uploaded on:/)).toBeInTheDocument();
  });
});
