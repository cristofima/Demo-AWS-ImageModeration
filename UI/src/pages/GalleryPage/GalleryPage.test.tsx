import { render, screen, waitFor } from "@testing-library/react";
import { postService } from "../../services";
import GalleryPage from "./GalleryPage";
import { vi } from "vitest";
import { Pagination } from "../../interfaces";
import { AxiosResponse } from "axios";

vi.mock("../../services/postService");

describe("GalleryPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the gallery page", () => {
    render(<GalleryPage />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("fetches and displays posts", async () => {
    vi.mocked(postService.fetchPosts).mockResolvedValueOnce({
      data: {
        data: [
          { id: 1, imagePath: "path/to/image1.jpg", imageIsBlurred: false },
          { id: 2, imagePath: "path/to/image2.jpg", imageIsBlurred: true },
        ],
        metadata: { page: 1, limit: 12, totalRecords: 2, totalPages: 1 },
      },
    } as unknown as AxiosResponse<Pagination>);

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });
  });
});
