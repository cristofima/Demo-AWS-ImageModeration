import { vi, describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "../../utils/test-utils";
import { render } from "../../utils/test-utils";
import { postService } from "../../services";
import UploadPage from "./UploadPage";
import { toast } from "react-toastify";

// Mock the postService
vi.mock("../../services/postService", () => ({
  postService: {
    uploadPost: vi.fn(),
    uploadMultiplePosts: vi.fn(),
  },
}));

// Mock MultiFileUpload component
vi.mock("../../components", () => ({
  MultiFileUpload: ({ onUpload }: { onUpload: (files: File[]) => void }) => (
    <div data-testid="multi-file-upload">
      <button
        onClick={() =>
          onUpload([new File(["content"], "test.jpg", { type: "image/jpeg" })])
        }
      >
        Mock Upload Multiple
      </button>
    </div>
  ),
}));

describe("UploadPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the upload page with single upload tab", () => {
    render(<UploadPage />);

    expect(screen.getByTestId("file-input")).toBeInTheDocument();
    expect(screen.getByTestId("upload-button")).toBeInTheDocument();
  });

  it("upload button is disabled when no file is selected", () => {
    render(<UploadPage />);

    const uploadButton = screen.getByTestId("upload-button");
    expect(uploadButton).toBeDisabled();
  });

  it("enables upload button when file is selected", async () => {
    render(<UploadPage />);

    const fileInput = screen.getByTestId("file-input");
    const mockFile = new File(["dummy content"], "example.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).not.toBeDisabled();
    });
  });

  it("uploads a file successfully", async () => {
    vi.mocked(postService.uploadPost).mockResolvedValue({
      data: { message: "Success" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    });

    render(<UploadPage />);

    const fileInput = screen.getByTestId("file-input");
    const mockFile = new File(["dummy content"], "example.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId("upload-button"));

    await waitFor(() => {
      expect(postService.uploadPost).toHaveBeenCalled();
    });
  });

  it("shows error for files that are too large", async () => {
    render(<UploadPage />);

    const fileInput = screen.getByTestId("file-input");
    // Create a mock file that's larger than MAX_FILE_SIZE
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        "File size exceeds 5MB"
      );
    });
  });

  it("shows error for invalid file types", async () => {
    render(<UploadPage />);

    const fileInput = screen.getByTestId("file-input");
    const invalidFile = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        "Invalid file type. Only JPEG and PNG are allowed."
      );
    });
  });

  it("handles upload errors gracefully", async () => {
    vi.mocked(postService.uploadPost).mockRejectedValue(
      new Error("Upload failed")
    );

    render(<UploadPage />);

    const fileInput = screen.getByTestId("file-input");
    const mockFile = new File(["dummy content"], "example.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      const uploadButton = screen.getByTestId("upload-button");
      expect(uploadButton).not.toBeDisabled();
    });

    fireEvent.click(screen.getByTestId("upload-button"));

    await waitFor(() => {
      expect(postService.uploadPost).toHaveBeenCalled();
    });
  });

  it("switches between single and multiple upload tabs", async () => {
    render(<UploadPage />);

    // Check if multiple tab content is available
    const multipleButton = screen.getByText("Multiple Upload");
    fireEvent.click(multipleButton);

    await waitFor(() => {
      expect(screen.getByTestId("multi-file-upload")).toBeInTheDocument();
    });
  });

  it("handles multiple file upload", async () => {
    vi.mocked(postService.uploadMultiplePosts).mockResolvedValue({
      data: {
        successful: [
          {
            filename: "test.jpg",
            post: {
              id: 1,
              imagePath: "/test.jpg",
              imageIsBlurred: false,
              createdAt: new Date(),
            },
          },
        ],
        failed: [],
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    });

    render(<UploadPage />);

    // Switch to multiple upload tab
    const multipleButton = screen.getByText("Multiple Upload");
    fireEvent.click(multipleButton);

    await waitFor(() => {
      expect(screen.getByTestId("multi-file-upload")).toBeInTheDocument();
    });

    // Trigger multiple upload
    const mockUploadButton = screen.getByText("Mock Upload Multiple");
    fireEvent.click(mockUploadButton);

    await waitFor(() => {
      expect(postService.uploadMultiplePosts).toHaveBeenCalled();
    });
  });
});
