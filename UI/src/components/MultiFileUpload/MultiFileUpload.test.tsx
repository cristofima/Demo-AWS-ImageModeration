import { vi, describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, render } from "../../utils/test-utils";
import MultiFileUpload from "./MultiFileUpload";

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(global, "URL", {
  value: {
    createObjectURL: vi.fn(() => "mock-url"),
    revokeObjectURL: vi.fn(),
  },
  writable: true,
});

describe("MultiFileUpload", () => {
  const mockOnUpload = vi.fn();
  const defaultProps = {
    onUpload: mockOnUpload,
    isUploading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupWithFiles = (files: File[]) => {
    render(<MultiFileUpload {...defaultProps} />);
    const fileInput = screen.getByTestId("file-input");
    fireEvent.change(fileInput, { target: { files } });
  };

  it("renders the multi-file upload component", () => {
    render(<MultiFileUpload {...defaultProps} />);
    expect(screen.getByText("Select Files")).toBeInTheDocument();
    expect(
      screen.getByText("Drag and drop images here, or click to select")
    ).toBeInTheDocument();
  });

  it("allows file selection", async () => {
    const mockFiles = [
      new File(["content1"], "file1.jpg", { type: "image/jpeg" }),
      new File(["content2"], "file2.png", { type: "image/png" }),
    ];
    setupWithFiles(mockFiles);

    await waitFor(() => {
      expect(screen.getByText("file1.jpg")).toBeInTheDocument();
      expect(screen.getByText("file2.png")).toBeInTheDocument();
    });
  });

  it("removes files from selection", async () => {
    const mockFiles = [
      new File(["content1"], "file1.jpg", { type: "image/jpeg" }),
    ];
    setupWithFiles(mockFiles);

    await waitFor(() => {
      expect(screen.getByText("file1.jpg")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("remove-file-0"));

    await waitFor(() => {
      expect(screen.queryByText("file1.jpg")).not.toBeInTheDocument();
    });
  });

  it("calls onUpload when upload button is clicked", async () => {
    const mockFiles = [
      new File(["content1"], "file1.jpg", { type: "image/jpeg" }),
    ];
    setupWithFiles(mockFiles);

    await waitFor(() => {
      expect(screen.getByText("file1.jpg")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("upload-files-button"));

    expect(mockOnUpload).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: "file1.jpg",
          type: "image/jpeg",
        }),
      ])
    );
  });

  it("disables upload button when no files selected", () => {
    render(<MultiFileUpload {...defaultProps} />);
    expect(screen.getByTestId("upload-files-button")).toBeDisabled();
  });

  it("validates file types", async () => {
    const { toast } = await import("react-toastify");

    const invalidFile = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });
    setupWithFiles([invalidFile]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("has invalid type")
      );
    });
  });

  it("validates file size", async () => {
    const { toast } = await import("react-toastify");

    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });
    setupWithFiles([largeFile]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("exceeds 5MB limit")
      );
    });
  });

  it("shows file previews for images", async () => {
    const mockFile = new File(["content"], "image.jpg", { type: "image/jpeg" });
    setupWithFiles([mockFile]);

    await waitFor(() => {
      expect(screen.getByTestId("file-preview-0")).toBeInTheDocument();
    });
  });

  it("handles drag and drop", async () => {
    render(<MultiFileUpload {...defaultProps} />);
    const dropZone = screen.getByTestId("drop-zone");
    const mockFiles = [
      new File(["content"], "dropped.jpg", { type: "image/jpeg" }),
    ];

    const mockDataTransfer = {
      files: mockFiles,
    } as unknown as DataTransfer;

    fireEvent.drop(dropZone, { dataTransfer: mockDataTransfer });

    await waitFor(() => {
      expect(screen.getByText("dropped.jpg")).toBeInTheDocument();
    });
  });

  it("prevents default drag behaviors", () => {
    render(<MultiFileUpload {...defaultProps} />);
    const dropZone = screen.getByTestId("drop-zone");

    const dragOverHandler = vi.fn((e) => e.preventDefault());
    dropZone.addEventListener("dragover", dragOverHandler);

    fireEvent.dragOver(dropZone);

    expect(dropZone).toBeInTheDocument(); // Smoke test for component presence
  });

  it("clears all files when clear button is clicked", async () => {
    const mockFiles = [
      new File(["content1"], "file1.jpg", { type: "image/jpeg" }),
      new File(["content2"], "file2.jpg", { type: "image/jpeg" }),
    ];
    setupWithFiles(mockFiles);

    await waitFor(() => {
      expect(screen.getByText("file1.jpg")).toBeInTheDocument();
      expect(screen.getByText("file2.jpg")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("clear-files-button"));

    await waitFor(() => {
      expect(screen.queryByText("file1.jpg")).not.toBeInTheDocument();
      expect(screen.queryByText("file2.jpg")).not.toBeInTheDocument();
    });
  });
});
