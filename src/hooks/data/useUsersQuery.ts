import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  ApiPaginationQueryType,
  PaginationType,
  UserQueryType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";

export const UsersQueryKey = "users";

export const useUsersQuery: (
  params: ApiPaginationQueryType
) => UseQueryResult<PaginationType<{ user: UserQueryType[] }>, unknown> = ({
  search = "",
  page = QueryInitialPageParam,
  limit = QueryTotalCount,
}) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [UsersQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ user: UserQueryType[] }>;
      }>(api_routes.users + `?page=${page}&limit=${limit}&search=${search}`);
      return response.data.data;
    },
  });
};
