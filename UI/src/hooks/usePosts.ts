import {
    useMutation,
    useQuery,
    useInfiniteQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { postService, UploadResponse } from "../services/postService";
import { toast } from "react-toastify";
import { Pagination, Post } from "../interfaces";
import { AxiosError, AxiosResponse } from "axios";

interface ErrorResponse {
    message: string;
}

// Type for infinite query data
type InfinitePostData = {
    pages: AxiosResponse<Pagination>[];
    pageParams: number[];
};

type MutationContext = {
    previousInfiniteData?: InfinitePostData;
    previousListData?: [unknown, unknown][];
};

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
            const successful = response.data.successful?.length ?? 0;
            const failed = response.data.failed?.length ?? 0;

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

    const cancelQueries = async () => {
        await queryClient.cancelQueries({ queryKey: postKeys.infinite() });
        await queryClient.cancelQueries({ queryKey: postKeys.lists() });
    };

    const snapshotPreviousData = (): MutationContext => {
        const previousInfiniteData = queryClient.getQueryData<InfinitePostData>(
            postKeys.infinite()
        );
        const previousListData = queryClient.getQueriesData({
            queryKey: postKeys.lists(),
        });
        return { previousInfiniteData, previousListData };
    };

    const updateInfiniteData = (deletedId: number) => {
        queryClient.setQueryData<InfinitePostData>(postKeys.infinite(), (old) => {
            if (!old) return old;

            const updatedPages = old.pages.map((page) => ({
                ...page,
                data: {
                    ...page.data,
                    data: page.data.data.filter((post: Post) => post.id !== deletedId),
                    metadata: {
                        ...page.data.metadata,
                        totalRecords: page.data.metadata.totalRecords - 1,
                    },
                },
            }));

            return { ...old, pages: updatedPages };
        });
    };

    const updateListData = (deletedId: number) => {
        queryClient.setQueriesData<AxiosResponse<Pagination>>(
            { queryKey: postKeys.lists() },
            (old) => {
                if (!old?.data) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        data: old.data.data.filter((post: Post) => post.id !== deletedId),
                        metadata: {
                            ...old.data.metadata,
                            totalRecords: old.data.metadata.totalRecords - 1,
                        },
                    },
                };
            }
        );
    };

    const rollbackData = (context: MutationContext | undefined) => {
        if (context?.previousInfiniteData) {
            queryClient.setQueryData(
                postKeys.infinite(),
                context.previousInfiniteData
            );
        }

        if (context?.previousListData) {
            context.previousListData.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey as unknown[], data);
            });
        }
    };

    const handleMutate = async (deletedId: number): Promise<MutationContext> => {
        await cancelQueries();

        const context = snapshotPreviousData();

        updateInfiniteData(deletedId);
        updateListData(deletedId);

        return context;
    };

    const handleSuccess = () => {
        toast.success("Post deleted successfully!");
    };

    const handleError = (
        error: AxiosError<ErrorResponse>,
        _deletedId: number,
        context: MutationContext | undefined
    ) => {
        rollbackData(context);
        const message = error?.response?.data?.message || "Failed to delete post";
        toast.error(message);
    };

    const handleSettled = () => {
        queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    };

    return useMutation<
        AxiosResponse<unknown>,
        AxiosError<ErrorResponse>,
        number,
        MutationContext
    >({
        mutationFn: (id: number) => postService.deletePost(id),
        onMutate: handleMutate,
        onSuccess: handleSuccess,
        onError: handleError,
        onSettled: handleSettled,
    });
};
