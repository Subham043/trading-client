import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { PaginationType, UserQueryType } from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const UserQueryKey = "user";
export const UsersQueryKey = "users";

export const useUsersQuery: () => UseQueryResult<
  PaginationType<{ user: UserQueryType[] }>,
  unknown
> = () => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
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

export const useUserQuery: (
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

export const useUsersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addUsers = (newUserVal: UserQueryType) => {
    queryClient.setQueryData<PaginationType<{ user: UserQueryType[] }>>(
      [UsersQueryKey, QueryInitialPageParam.toString(), limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            user: [newUserVal, ...prev.user],
          };
        }
      }
    );
  };

  const updateUsers = (id: number, updateUserVal: UserQueryType) => {
    queryClient.setQueryData<PaginationType<{ user: UserQueryType[] }>>(
      [UsersQueryKey, page, limit, search],
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
  };

  const deleteUsers = (id: number) => {
    queryClient.setQueryData<PaginationType<{ user: UserQueryType[] }>>(
      [UsersQueryKey, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            user: prev.user.filter((user) => user.id !== id),
          };
        }
      }
    );
  };

  return {
    addUsers,
    updateUsers,
    deleteUsers,
  };
};

export const useUserQuerySetData = () => {
  const queryClient = useQueryClient();

  const addUser = (newUserVal: UserQueryType) => {
    queryClient.setQueryData<UserQueryType>(
      [UserQueryKey, newUserVal.id],
      newUserVal
    );
  };

  const updateUser = (id: number, updateUserVal: UserQueryType) => {
    queryClient.setQueryData<UserQueryType>([UserQueryKey, id], updateUserVal);
  };

  const deleteUser = (id: number) => {
    queryClient.setQueryData<UserQueryType>([UserQueryKey, id], undefined);
  };

  return {
    addUser,
    updateUser,
    deleteUser,
  };
};

export const useUpdateUserMutation = (id: number) => {
  const { axios } = useAxios();
  const { updateUser } = useUserQuerySetData();
  const { updateUsers } = useUsersQuerySetData();
  const { toastSuccess, toastError } = useToast();

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
      updateUser(id, updateUserVal);
      updateUsers(id, updateUserVal);
      toastSuccess("User updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddUserMutation = () => {
  const { axios } = useAxios();
  const { addUser } = useUserQuerySetData();
  const { addUsers } = useUsersQuerySetData();
  const { toastSuccess, toastError } = useToast();

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
      addUser(newUserVal);
      addUsers(newUserVal);
      toastSuccess("User created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteUserMutation = (id: number) => {
  const { axios } = useAxios();
  const { deleteUser } = useUserQuerySetData();
  const { deleteUsers } = useUsersQuerySetData();
  const { toastSuccess, toastError } = useToast();

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
      deleteUser(id);
      deleteUsers(id);
      toastSuccess("User deleted successfully.");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error?.response?.data?.message) {
          toastError(error.response.data.message);
        }
      } else {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};
