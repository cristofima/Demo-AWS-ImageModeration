import { useState, useEffect, useRef } from "react";
import { Image } from "../models/image.model";
import { Pagination } from "../models/pagination,model";

export const useInfiniteScroll = (fetchImages: (page: number) => Promise<Pagination>) => {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadImages = async () => {
    if (isLoading) return;

    setIsLoading(true); 
    const pagination = await fetchImages(page);
    
    setImages((prev) => [...prev, ...pagination.data]);
    setHasMore(page < pagination.metadata.totalPages);
    setIsLoading(false);
  };

  useEffect(() => {
    loadImages();
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

  return { images, observerRef, setImages, isLoading };
};
