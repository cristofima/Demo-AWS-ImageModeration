import React, { useState, useCallback } from "react";
import { postService } from "../../services";
import { useInfiniteScroll } from "../../hooks";
import { ImageModal } from "../../components";
import { Button, Card, CardBody, Image, Spinner } from "@heroui/react";
import "./GalleryPage.css";

const GalleryPage: React.FC = () => {
  const fetchPosts = useCallback(async (page: number) => {
    const response = await postService.fetchPosts(page);
    return response.data;
  }, []);

  const { posts, setPosts, isLoading, observerRef } =
    useInfiniteScroll(fetchPosts);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedPosts, setLoadedPosts] = useState<number[]>([]);

  const toggleBlur = useCallback(
    (id: number) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id
            ? { ...post, imageIsBlurred: !post.imageIsBlurred }
            : post
        )
      );
    },
    [setPosts]
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

  const handlePostDelete = useCallback(() => {
    if (selectedIndex === null) return;
    const updatedPosts = posts.filter((_, index) => index !== selectedIndex);
    setPosts(updatedPosts);
    setSelectedIndex(null);
  }, [posts, selectedIndex, setPosts]);

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

  return (
    <>
      <div className="gap-2 grid sm:grid-cols-2 p-2 sm:p-4 md:grid-cols-3 lg:grid-cols-4">
        {posts.map((post, index) => (
          <Card key={index} shadow="sm">
            <CardBody className="overflow-visible p-0 relative cursor-pointer">
              <Image
                isZoomed={!post.imageIsBlurred}
                className={`w-full object-cover sm:h-[250px] md:h-[300px] lg:h-[400px] ${
                  post.imageIsBlurred ? "filter blur-lg" : ""
                }`}
                radius="lg"
                shadow="sm"
                src={post.imagePath}
                width="100%"
                onClick={() => handleImageClick(index)}
                onLoad={() => handlePostLoad(post.id)}
              />
              {post.imageIsBlurred && loadedPosts.includes(post.id) && (
                <Button
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded z-10"
                  onPress={() => toggleBlur(post.id)}
                >
                  Show Image
                </Button>
              )}
            </CardBody>
          </Card>
        ))}

        <div ref={observerRef} className="gallery__observer"></div>
      </div>

      {isLoading && (
        <div className="gallery__loading-container">
          <Spinner data-testid="loading-spinner" size="lg" />
        </div>
      )}

      {selectedIndex !== null && (
        <ImageModal
          post={posts[selectedIndex]}
          totalPosts={posts.length}
          currentIndex={selectedIndex}
          onClose={handleModalClose}
          onDelete={handlePostDelete}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
};

export default React.memo(GalleryPage);
