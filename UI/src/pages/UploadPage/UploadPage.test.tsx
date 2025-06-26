import { vi, describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, render } from "../../utils/test-utils";
import { postService } from "../../services";
import UploadPage from "./UploadPage";
import { toast } from "react-toastify";

// Mocks
vi.mock("../../services/postService", () => ({
  postService: {
    uploadPost: vi.fn(),
    uploadMultiplePosts: vi.fn(),
  },
}));

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

// Helpers
const setup = () => {
  render(<UploadPage />);
  return {
    fileInput: screen.getByTestId("file-input"),
    uploadButton: screen.getByTestId("upload-button"),
  };
};

const uploadMockFile = async (file: File) => {
  const { fileInput, uploadButton } = setup();
  fireEvent.change(fileInput, { target: { files: [file] } });
  await waitFor(() => expect(uploadButton).not.toBeDisabled());
  return { fileInput, uploadButton };
};

describe("UploadPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the upload page with single upload tab", () => {
    const { fileInput, uploadButton } = setup();
    expect(fileInput).toBeInTheDocument();
    expect(uploadButton).toBeInTheDocument();
  });

  it("upload button is disabled when no file is selected", () => {
    const { uploadButton } = setup();
    expect(uploadButton).toBeDisabled();
  });

  it("enables upload button when file is selected", async () => {
    const mockFile = new File(["dummy content"], "example.jpg", {
      type: "image/jpeg",
    });

    await uploadMockFile(mockFile);
  });

  it("uploads a file successfully", async () => {
    vi.mocked(postService.uploadPost).mockResolvedValue({
      data: { message: "Success" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    });

    const mockFile = new File(["dummy content"], "example.jpg", {
      type: "image/jpeg",
    });

    const { uploadButton } = await uploadMockFile(mockFile);

    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(postService.uploadPost).toHaveBeenCalled();
    });
  });

  it("shows error for files that are too large", async () => {
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });

    const { fileInput } = setup();
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        "File size exceeds 5MB"
      );
    });
  });

  it("shows error for invalid file types", async () => {
    const invalidFile = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });

    const { fileInput } = setup();
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

    const mockFile = new File(["dummy content"], "example.jpg", {
      type: "image/jpeg",
    });

    const { uploadButton } = await uploadMockFile(mockFile);
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(postService.uploadPost).toHaveBeenCalled();
    });
  });

  it("switches between single and multiple upload tabs", async () => {
    setup();

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

    setup();

    const multipleButton = screen.getByText("Multiple Upload");
    fireEvent.click(multipleButton);

    await waitFor(() => {
      expect(screen.getByTestId("multi-file-upload")).toBeInTheDocument();
    });

    const mockUploadButton = screen.getByText("Mock Upload Multiple");
    fireEvent.click(mockUploadButton);

    await waitFor(() => {
      expect(postService.uploadMultiplePosts).toHaveBeenCalled();
    });
  });
});
