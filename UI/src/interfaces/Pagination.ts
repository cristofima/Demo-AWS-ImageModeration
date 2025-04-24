import { Post } from "./Post";

export interface Pagination {
  data: Post[];
  metadata: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}
