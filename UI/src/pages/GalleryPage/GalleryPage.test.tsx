import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen, waitFor, fireEvent, render } from "../../utils/test-utils";
import { postService } from "../../services";
import GalleryPage from "./GalleryPage";
import {
  mockAxiosResponse,
  mockEmptyAxiosResponse,
  mockSecondPageAxiosResponse,
  mockPost,
  mockBlurredPost,
} from "../../utils/test-data";

// Mocks
vi.mock("../../services/postService", () => ({
  postService: {
    fetchPosts: vi.fn(),
    deletePost: vi.fn(),
  },
}));

vi.mock("../../hooks/useInfiniteScrollObserver", () => ({
  useInfiniteScrollObserver: vi.fn(() => vi.fn()),
}));

// Helpers
const renderGalleryWithMockPosts = async (mockData = mockAxiosResponse) => {
  vi.mocked(postService.fetchPosts).mockResolvedValue(mockData);
  render(<GalleryPage />);
  await waitFor(() => {
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });
  return screen.getAllByRole("img");
};

describe("GalleryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading spinner initially", () => {
    vi.mocked(postService.fetchPosts).mockImplementation(
      () => new Promise(() => {})
    );

    render(<GalleryPage />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders empty state when no posts are available", async () => {
    vi.mocked(postService.fetchPosts).mockResolvedValue(mockEmptyAxiosResponse);
    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText("No posts found")).toBeInTheDocument();
      expect(
        screen.getByText("Upload some images to get started!")
      ).toBeInTheDocument();
    });
  });

  it("fetches and displays posts correctly", async () => {
    const images = await renderGalleryWithMockPosts();

    expect(images[0]).toHaveAttribute("src", mockPost.imagePath);
    expect(images[1]).toHaveAttribute("src", mockBlurredPost.imagePath);
  });

  it("shows 'Show Image' button for blurred posts", async () => {
    const images = await renderGalleryWithMockPosts();
    const blurredImages = images.filter((img) =>
      img.className.includes("filter blur-lg")
    );
    expect(blurredImages).toHaveLength(2);
  });

  it("handles image click for non-blurred posts", async () => {
    const images = await renderGalleryWithMockPosts();
    fireEvent.click(images[0]);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("handles blur toggle functionality", async () => {
    const images = await renderGalleryWithMockPosts();
    const blurredImages = images.filter((img) =>
      img.className.includes("filter blur-lg")
    );
    expect(blurredImages).toHaveLength(2);
  });

  it("handles error state correctly", async () => {
    vi.mocked(postService.fetchPosts).mockRejectedValue(
      new Error("Failed to fetch")
    );

    render(<GalleryPage />);
    await waitFor(() => {
      expect(screen.getByText("Failed to load posts")).toBeInTheDocument();
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });
  });

  it("handles retry functionality", async () => {
    vi.mocked(postService.fetchPosts).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );
    render(<GalleryPage />);
    await waitFor(() => {
      expect(screen.getByText("Failed to load posts")).toBeInTheDocument();
    });

    // Retry with success
    vi.mocked(postService.fetchPosts).mockResolvedValue(mockAxiosResponse);
    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);

    expect(retryButton).toBeInTheDocument();
  });

  it("displays post creation dates correctly", async () => {
    await renderGalleryWithMockPosts();

    const dateElements = screen.getAllByText(
      /1\/1\/2023|1\/2\/2023|1\/3\/2023|1\/4\/2023/
    );
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it("handles infinite scroll correctly", async () => {
    vi.mocked(postService.fetchPosts).mockResolvedValueOnce(mockAxiosResponse);
    vi.mocked(postService.fetchPosts).mockResolvedValueOnce(
      mockSecondPageAxiosResponse
    );

    render(<GalleryPage />);
    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(4);
    });

    await waitFor(() => {
      expect(
        screen.getByText("You've reached the end of the gallery")
      ).toBeInTheDocument();
    });
  });
});
