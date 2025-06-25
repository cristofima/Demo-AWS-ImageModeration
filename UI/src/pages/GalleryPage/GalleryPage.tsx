import React, { useState, useCallback, useMemo } from "react";
import { ImageModal } from "../../components";
import { Button, Card, CardBody, Image, Spinner } from "@heroui/react";
import {
  useInfinitePosts,
  useDeletePost,
  useInfiniteScrollObserver,
} from "../../hooks";
import "./GalleryPage.css";

const GalleryPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedPosts, setLoadedPosts] = useState<number[]>([]);
  const [blurredOverrides, setBlurredOverrides] = useState<
    Record<number, boolean>
  >({});

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();

  const deletePostMutation = useDeletePost();

  // Flatten all posts from all pages
  const posts = useMemo(() => {
    if (!data?.pages) return [];

    const allPosts = data.pages.flatMap((page) => page.data);
    return allPosts.map((post) => ({
      ...post,
      imageIsBlurred:
        blurredOverrides[post.id] !== undefined
          ? blurredOverrides[post.id]
          : post.imageIsBlurred,
    }));
  }, [data?.pages, blurredOverrides]);

  // Infinite scroll observer
  const observerRef = useInfiniteScrollObserver({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin: "100px",
  });

  const toggleBlur = useCallback(
    (id: number) => {
      setBlurredOverrides((prev) => ({
        ...prev,
        [id]:
          !prev[id] && prev[id] !== undefined
            ? false
            : !posts.find((p) => p.id === id)?.imageIsBlurred,
      }));
    },
    [posts]
  );

  const handleImageClick = useCallback(
    (index: number) => {
      if (!posts[index].imageIsBlurred) {
        setSelectedIndex(index);
      }
    },
    [posts]
  );

  const handleModalClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePostDelete = useCallback(async () => {
    if (selectedIndex === null || deletePostMutation.isPending) return;

    const postToDelete = posts[selectedIndex];
    try {
      await deletePostMutation.mutateAsync(postToDelete.id);
      setSelectedIndex(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  }, [posts, selectedIndex, deletePostMutation]);

  const handlePostLoad = useCallback((id: number) => {
    setLoadedPosts((prevLoadedPosts) => [...prevLoadedPosts, id]);
  }, []);

  const handleNavigate = useCallback(
    (newIndex: number) => {
      if (newIndex >= 0 && newIndex < posts.length) {
        setSelectedIndex(newIndex);
      }
    },
    [posts.length]
  );

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Failed to load posts</p>
          <Button
            color="primary"
            variant="ghost"
            onPress={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {/* Gallery Grid */}
        <div className="gap-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {posts.map((post, index) => (
            <Card key={post.id} shadow="sm" className="group">
              <CardBody className="overflow-visible p-0 relative cursor-pointer">
                <Image
                  isZoomed={!post.imageIsBlurred}
                  className={`w-full h-[300px] object-cover transition-all duration-300 ${
                    post.imageIsBlurred ? "filter blur-lg" : ""
                  } group-hover:scale-105`}
                  radius="lg"
                  shadow="sm"
                  src={post.imagePath}
                  width="100%"
                  onClick={() => handleImageClick(index)}
                  onLoad={() => handlePostLoad(post.id)}
                  alt={`Post ${post.id}`}
                />
                {post.imageIsBlurred && loadedPosts.includes(post.id) && (
                  <Button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded z-10 hover:bg-opacity-90 transition-all"
                    onPress={() => toggleBlur(post.id)}
                    size="sm"
                  >
                    Show Image
                  </Button>
                )}
                {/* Overlay with post info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spinner data-testid="loading-spinner" size="lg" color="primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">No posts found</p>
              <p className="text-gray-400 text-sm">
                Upload some images to get started!
              </p>
            </div>
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        {hasNextPage && (
          <div
            ref={observerRef}
            className="flex justify-center items-center py-8"
          >
            {isFetchingNextPage && <Spinner size="md" color="primary" />}
          </div>
        )}

        {/* End of Results */}
        {!hasNextPage && posts.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500 text-sm">
              You've reached the end of the gallery
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedIndex !== null && (
        <ImageModal
          post={posts[selectedIndex]}
          totalPosts={posts.length}
          currentIndex={selectedIndex}
          onClose={handleModalClose}
          onDelete={handlePostDelete}
          onNavigate={handleNavigate}
          isDeleting={deletePostMutation.isPending}
        />
      )}
    </>
  );
};

export default React.memo(GalleryPage);
