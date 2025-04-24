import { useState, useEffect, useRef, useCallback } from "react";
import { Post, Pagination } from "../interfaces";

export const useInfiniteScroll = (
  fetchPosts: (page: number) => Promise<Pagination>
) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadPosts = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const pagination = await fetchPosts(page);

      setPosts((prev) => {
        const newPosts = pagination.data.filter(
          (newPost) => !prev.some((post) => post.id === newPost.id)
        );
        return [...prev, ...newPosts];
      });

      setHasMore(page < pagination.metadata.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts, isLoading, page]);

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  return { posts, observerRef, setPosts, isLoading };
};
