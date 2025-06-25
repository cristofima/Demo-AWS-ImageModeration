import {
    useMutation,
    useQuery,
    useInfiniteQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { postService, UploadResponse } from "../services/postService";
import { toast } from "react-toastify";
import { Pagination } from "../interfaces";
import { AxiosError, AxiosResponse } from "axios";

// Error response interface
interface ErrorResponse {
    message: string;
}

// Query keys
export const postKeys = {
    all: ["posts"] as const,
    lists: () => [...postKeys.all, "list"] as const,
    list: (page: number) => [...postKeys.lists(), { page }] as const,
    infinite: () => [...postKeys.all, "infinite"] as const,
};

// Fetch posts with React Query (single page)
export const usePosts = (page: number = 1) => {
    return useQuery({
        queryKey: postKeys.list(page),
        queryFn: () => postService.fetchPosts(page),
        select: (data) => data.data as Pagination,
    });
};

// Infinite scroll posts with React Query
export const useInfinitePosts = () => {
    return useInfiniteQuery({
        queryKey: postKeys.infinite(),
        queryFn: ({ pageParam = 1 }) => postService.fetchPosts(pageParam),
        getNextPageParam: (lastPage) => {
            const data = lastPage.data as Pagination;
            const currentPage = data.metadata.page;
            const totalPages = data.metadata.totalPages;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 1,
        select: (data) => ({
            pages: data.pages.map((page) => page.data as Pagination),
            pageParams: data.pageParams,
        }),
    });
};

// Upload single post mutation
export const useUploadPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => postService.uploadPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
            toast.success("Post uploaded successfully!");
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            const message = error?.response?.data?.message || "Failed to upload post";
            toast.error(message);
        },
    });
};

// Upload multiple posts mutation
export const useUploadMultiplePosts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (files: FormData) => postService.uploadMultiplePosts(files),
        onSuccess: (response: AxiosResponse<UploadResponse>) => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
            const successful = response.data.successful?.length || 0;
            const failed = response.data.failed?.length || 0;

            if (successful > 0) {
                toast.success(`${successful} post(s) uploaded successfully!`);
            }
            if (failed > 0) {
                toast.warning(`${failed} post(s) failed to upload`);
            }
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            const message =
                error?.response?.data?.message || "Failed to upload posts";
            toast.error(message);
        },
    });
};

// Delete post mutation
export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => postService.deletePost(id),
        onMutate: async (deletedId: number) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: postKeys.infinite() });
            await queryClient.cancelQueries({ queryKey: postKeys.lists() });

            // Snapshot the previous value
            const previousInfiniteData = queryClient.getQueryData(
                postKeys.infinite()
            );
            const previousListData = queryClient.getQueriesData({
                queryKey: postKeys.lists(),
            });

            // Optimistically update infinite query data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(postKeys.infinite(), (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: {
                            ...page.data,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            data: page.data.data.filter((post: any) => post.id !== deletedId),
                            metadata: {
                                ...page.data.metadata,
                                total: page.data.metadata.total - 1,
                            },
                        },
                    })),
                };
            });

            // Optimistically update paginated queries
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueriesData({ queryKey: postKeys.lists() }, (old: any) => {
                if (!old?.data) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data: old.data.data.filter((post: any) => post.id !== deletedId),
                        metadata: {
                            ...old.data.metadata,
                            total: old.data.metadata.total - 1,
                        },
                    },
                };
            });

            // Return a context object with the snapshotted value
            return { previousInfiniteData, previousListData };
        },
        onSuccess: () => {
            toast.success("Post deleted successfully!");
        },
        onError: (error: AxiosError<ErrorResponse>, _deletedId, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousInfiniteData) {
                queryClient.setQueryData(
                    postKeys.infinite(),
                    context.previousInfiniteData
                );
            }
            if (context?.previousListData) {
                context.previousListData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }

            const message = error?.response?.data?.message || "Failed to delete post";
            toast.error(message);
        },
        onSettled: () => {
            // Always refetch after error or success to ensure we have correct data
            queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
};
