import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    rootMargin?: string;
    threshold?: number;
}

export const useInfiniteScrollObserver = ({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin = '100px',
    threshold = 0.1,
}: UseInfiniteScrollOptions) => {
    const observerRef = useRef<HTMLDivElement>(null);

    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    useEffect(() => {
        const element = observerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleIntersection, {
            rootMargin,
            threshold,
        });

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [handleIntersection, rootMargin, threshold]);

    return observerRef;
};
