import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { postService } from "../../services";
import UploadPage from "./UploadPage";
import { vi } from "vitest";

vi.mock("../../services/postService");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("UploadPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the upload page", () => {
    render(<UploadPage />);
    expect(screen.getByTestId("upload-button")).toBeInTheDocument();
  });

  it("upload button is disabled when no file is selected", async () => {
    render(<UploadPage />);

    const uploadButton = screen.getByTestId("upload-button");
    expect(uploadButton).toHaveAttribute("disabled", "");
  });

  it("uploads a file successfully", async () => {
    const mockFile = new File(["dummy content"], "example.jpg", {
      type: "image/jpeg",
    });
    vi.mocked(postService.uploadPost).mockResolvedValue({} as any);

    render(<UploadPage />);
    const fileInput = screen.getByTestId("file-input");
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    fireEvent.click(screen.getByTestId("upload-button"));

    await waitFor(() => {
      expect(postService.uploadPost).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Post created successfully");
    });
  });

  it("shows an error toast when upload fails", async () => {
    const mockFile = new File(["dummy content"], "example.jpg", {
      type: "image/jpeg",
    });
    vi.mocked(postService.uploadPost).mockRejectedValue(
      new Error("Upload failed")
    );

    render(<UploadPage />);
    const fileInput = screen.getByTestId("file-input");
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    fireEvent.click(screen.getByText("Upload"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to upload image");
    });
  });
});
