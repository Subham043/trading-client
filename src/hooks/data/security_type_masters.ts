import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  SecurityTypeMasterType,
  SecurityTypeMasterFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const SecurityTypeMasterKey = "security_type_master";
export const SecurityTypeMastersQueryKey = "security_type_masters";

export const useSecurityTypeMastersQuery: (
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{ securityTypeMaster: SecurityTypeMasterType[] }>,
  unknown
> = (enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [SecurityTypeMastersQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ securityTypeMaster: SecurityTypeMasterType[] }>;
      }>(
        api_routes.securityTypeMasters +
          `?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useSecurityTypeMasterQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<SecurityTypeMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [SecurityTypeMasterKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: SecurityTypeMasterType }>(
        api_routes.securityTypeMasters + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useSecurityTypeMastersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addSecurityTypeMasters = (
    newSecurityTypeMasterVal: SecurityTypeMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ securityTypeMaster: SecurityTypeMasterType[] }>
    >(
      [
        SecurityTypeMastersQueryKey,
        QueryInitialPageParam.toString(),
        limit,
        search,
      ],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            last_page: prev.last_page + 1,
            total: prev.total + 1,
            current_page: prev.current_page + 1,
            securityTypeMaster: [
              newSecurityTypeMasterVal,
              ...prev.securityTypeMaster,
            ],
          };
        }
      }
    );
  };

  const updateSecurityTypeMasters = (
    id: number,
    updateSecurityTypeMasterVal: SecurityTypeMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ securityTypeMaster: SecurityTypeMasterType[] }>
    >([SecurityTypeMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          securityTypeMaster: prev.securityTypeMaster.map(
            (securityTypeMaster) =>
              securityTypeMaster.id === id
                ? updateSecurityTypeMasterVal
                : securityTypeMaster
          ),
        };
      }
    });
  };

  const deleteSecurityTypeMasters = (id: number) => {
    queryClient.setQueryData<
      PaginationType<{ securityTypeMaster: SecurityTypeMasterType[] }>
    >([SecurityTypeMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          securityTypeMaster: prev.securityTypeMaster.filter(
            (securityTypeMaster) => securityTypeMaster.id !== id
          ),
        };
      }
    });
  };

  return {
    addSecurityTypeMasters,
    updateSecurityTypeMasters,
    deleteSecurityTypeMasters,
  };
};

export const useSecurityTypeMasterQuerySetData = () => {
  const queryClient = useQueryClient();

  const addSecurityTypeMaster = (
    newSecurityTypeMasterVal: SecurityTypeMasterType
  ) => {
    queryClient.setQueryData<SecurityTypeMasterType>(
      [SecurityTypeMasterKey, newSecurityTypeMasterVal.id],
      newSecurityTypeMasterVal
    );
  };

  const updateSecurityTypeMaster = (
    id: number,
    updateSecurityTypeMasterVal: SecurityTypeMasterType
  ) => {
    queryClient.setQueryData<SecurityTypeMasterType>(
      [SecurityTypeMasterKey, id],
      (prev) => ({ ...prev, ...updateSecurityTypeMasterVal })
    );
  };

  const deleteSecurityTypeMaster = (id: number) => {
    queryClient.setQueryData<SecurityTypeMasterType>(
      [SecurityTypeMasterKey, id],
      undefined
    );
  };

  return {
    addSecurityTypeMaster,
    updateSecurityTypeMaster,
    deleteSecurityTypeMaster,
  };
};

export const useUpdateSecurityTypeMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { updateSecurityTypeMasters } = useSecurityTypeMastersQuerySetData();
  const { updateSecurityTypeMaster } = useSecurityTypeMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateSecurityTypeMasterVal: SecurityTypeMasterFormType
    ) => {
      const response = await axios.put<{ data: SecurityTypeMasterType }>(
        api_routes.securityTypeMasters + `/${id}`,
        updateSecurityTypeMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateSecurityTypeMasterVal) => {
      // ✅ update detail view directly
      updateSecurityTypeMaster(id, updateSecurityTypeMasterVal);
      updateSecurityTypeMasters(id, updateSecurityTypeMasterVal);
      toastSuccess("Security Type Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddSecurityTypeMasterMutation = () => {
  const { axios } = useAxios();
  const { addSecurityTypeMasters } = useSecurityTypeMastersQuerySetData();
  const { addSecurityTypeMaster } = useSecurityTypeMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newSecurityTypeMasterVal: SecurityTypeMasterFormType
    ) => {
      const response = await axios.post<{ data: SecurityTypeMasterType }>(
        api_routes.securityTypeMasters,
        newSecurityTypeMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newSecurityTypeMasterVal) => {
      // ✅ update detail view directly
      addSecurityTypeMaster(newSecurityTypeMasterVal);
      addSecurityTypeMasters(newSecurityTypeMasterVal);
      toastSuccess("Security Type Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteSecurityTypeMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { deleteSecurityTypeMasters } = useSecurityTypeMastersQuerySetData();
  const { deleteSecurityTypeMaster } = useSecurityTypeMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: SecurityTypeMasterType }>(
        api_routes.securityTypeMasters + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteSecurityTypeMaster(id);
      deleteSecurityTypeMasters(id);
      toastSuccess("Security Type Master deleted successfully.");
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
