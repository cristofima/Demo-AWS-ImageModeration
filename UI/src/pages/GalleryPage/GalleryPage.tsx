import React, { useState, useCallback } from "react";
import { postService } from "../../services";
import { useInfiniteScroll } from "../../hooks";
import { Spinner } from "@heroui/spinner";
import "./GalleryPage.css";
import { ImageModal } from "../../components";

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
    <div className="gallery">
      <div className="gallery__grid">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`gallery__item ${
              post.imageIsBlurred ? "gallery__item--blurred" : ""
            }`}
          >
            <img
              src={post.imagePath}
              alt="Uploaded"
              onLoad={() => handlePostLoad(post.id)}
              className="gallery__image"
            />
            {post.imageIsBlurred && loadedPosts.includes(post.id) && (
              <button
                className="gallery__toggle-blur-button"
                onClick={() => toggleBlur(post.id)}
              >
                Show Image
              </button>
            )}
            <div
              className={`gallery__click-overlay ${
                !post.imageIsBlurred ? "gallery__click-overlay--safe" : ""
              }`}
              onClick={() => handleImageClick(index)}
            ></div>
          </div>
        ))}
        <div ref={observerRef} className="gallery__observer"></div>
      </div>
      {isLoading && (
        <div className="gallery__loading-container">
          <Spinner size="lg" />
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
    </div>
  );
};

export default React.memo(GalleryPage);
