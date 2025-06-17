import { IPagination } from '../types/core.types';

export const paginationWithDefaults = (pagination: IPagination) => ({
  limit: pagination.limit ?? 10,
  offset: pagination.offset ?? 0,
});
