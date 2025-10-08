import { computed } from "vue";
import {type InfiniteData, type QueryKey, useInfiniteQuery} from "@tanstack/vue-query";
import { fetchUsersPage } from "@/api/user";
import type { User, UsersResponse } from "@/types/user";

type Opts = {
  firstLimit?: number;   // первый запрос
  pageLimit?: number;    // последующие запросы
  initialOffset?: number;
  extraKey?: unknown[];  // чтоб ключ запроса был уникальным при разных лимитах
};

type PageParam = { offset?: number; limit?: number };

export function useUsersInfiniteQuery(opts: Opts = {}) {
  const firstLimit = opts.firstLimit ?? 10;   // по умолчанию 10
  const pageLimit  = opts.pageLimit ?? 5;     // пагинация +5
  const initialOffset = opts.initialOffset ?? 0;

  const query = useInfiniteQuery<
    UsersResponse,                        // TQueryFnData
    Error,                                // TError
    InfiniteData<UsersResponse, PageParam>, // TData
    QueryKey,                             // TQueryKey
    PageParam                             // TPageParam
  >({
    queryKey: ["users", initialOffset, firstLimit, pageLimit, ...(opts.extraKey ?? [])],
    initialPageParam: { offset: initialOffset, limit: firstLimit },
    queryFn: ({ pageParam }) => fetchUsersPage(pageParam.offset, pageParam.limit),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore
        ? {
          offset: lastPage.meta.nextOffset ?? (lastPage.meta.offset + lastPage.meta.limit),
          limit: pageLimit,
        }
        : undefined,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const users = computed<User[]>(() =>
    (query.data.value?.pages ?? []).flatMap((p) => p.users)
  );

  return {
    users,
    // состояния
    status: query.status,
    error: query.error,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    // методы
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}
