import { Image } from "./image.model";

export interface Pagination {
  data: Image[];
  metadata: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}
