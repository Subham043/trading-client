import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  ApiPaginationQueryType,
  PaginationType,
  UserQueryType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";

export const UserQueryKey = "user";
export const UsersQueryKey = "users";

export const useUsers: (
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

export const useUser: (
  id: number,
  enabled: boolean
) => UseQueryResult<UserQueryType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [UserQueryKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: UserQueryType }>(
        api_routes.users + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useUpdateUser = (id: number) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  return useMutation({
    mutationFn: async (updateUserVal: {
      email: string;
      name: string;
      password: string;
      confirm_password: string;
    }) => {
      const response = await axios.put<{ data: UserQueryType }>(
        api_routes.users + `/${id}`,
        updateUserVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateUserVal) => {
      // ✅ update detail view directly
      queryClient.setQueryData([UserQueryKey, id], updateUserVal);
      queryClient.setQueryData<PaginationType<{ user: UserQueryType[] }>>(
        [
          UsersQueryKey,
          searchParams.get("page") || QueryInitialPageParam.toString(),
          searchParams.get("limit") || QueryTotalCount.toString(),
          searchParams.get("search") || "",
        ],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              user: prev.user.map((user) =>
                user.id === id ? updateUserVal : user
              ),
            };
          }
        }
      );
    },
  });
};

export const useAddUser = () => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  return useMutation({
    mutationFn: async (newUserVal: {
      email: string;
      name: string;
      password: string;
      confirm_password: string;
    }) => {
      const response = await axios.post<{ data: UserQueryType }>(
        api_routes.users,
        newUserVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newUserVal) => {
      // ✅ update detail view directly
      queryClient.setQueryData<UserQueryType>(
        [UserQueryKey, newUserVal.id],
        newUserVal
      );
      queryClient.setQueryData<PaginationType<{ user: UserQueryType[] }>>(
        [
          UsersQueryKey,
          QueryInitialPageParam.toString(),
          searchParams.get("limit") || QueryTotalCount.toString(),
          searchParams.get("search") || "",
        ],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              user: [newUserVal, ...prev.user],
            };
          }
        }
      );
    },
  });
};

export const useDeleteUser = (id: number) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: UserQueryType }>(
        api_routes.users + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.setQueryData<PaginationType<{ user: UserQueryType[] }>>(
        [
          UsersQueryKey,
          searchParams.get("page") || QueryInitialPageParam.toString(),
          searchParams.get("limit") || QueryTotalCount.toString(),
          searchParams.get("search") || "",
        ],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              user: prev.user.filter((user) => user.id !== id),
            };
          }
        }
      );
    },
  });
};
