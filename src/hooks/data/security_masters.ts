import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  SecurityMasterType,
  SecurityMasterFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const SecurityMasterKey = "security_master";
export const SecurityMastersQueryKey = "security_masters";

export const useSecurityMastersQuery: (
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{ securityMaster: SecurityMasterType[] }>,
  unknown
> = (enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [SecurityMastersQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ securityMaster: SecurityMasterType[] }>;
      }>(
        api_routes.securityMasters +
          `?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useSecurityMasterQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<SecurityMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [SecurityMasterKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: SecurityMasterType }>(
        api_routes.securityMasters + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useSecurityMastersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addSecurityMasters = (newSecurityMasterVal: SecurityMasterType) => {
    queryClient.setQueryData<
      PaginationType<{ securityMaster: SecurityMasterType[] }>
    >(
      [
        SecurityMastersQueryKey,
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
            securityMaster: [newSecurityMasterVal, ...prev.securityMaster],
          };
        }
      }
    );
  };

  const updateSecurityMasters = (
    id: number,
    updateSecurityMasterVal: SecurityMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ securityMaster: SecurityMasterType[] }>
    >([SecurityMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          securityMaster: prev.securityMaster.map((securityMaster) =>
            securityMaster.id === id ? updateSecurityMasterVal : securityMaster
          ),
        };
      }
    });
  };

  const deleteSecurityMasters = (id: number) => {
    queryClient.setQueryData<
      PaginationType<{ securityMaster: SecurityMasterType[] }>
    >([SecurityMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          securityMaster: prev.securityMaster.filter(
            (securityMaster) => securityMaster.id !== id
          ),
        };
      }
    });
  };

  return {
    addSecurityMasters,
    updateSecurityMasters,
    deleteSecurityMasters,
  };
};

export const useSecurityMasterQuerySetData = () => {
  const queryClient = useQueryClient();

  const addSecurityMaster = (newSecurityMasterVal: SecurityMasterType) => {
    queryClient.setQueryData<SecurityMasterType>(
      [SecurityMasterKey, newSecurityMasterVal.id],
      newSecurityMasterVal
    );
  };

  const updateSecurityMaster = (
    id: number,
    updateSecurityMasterVal: SecurityMasterType
  ) => {
    queryClient.setQueryData<SecurityMasterType>(
      [SecurityMasterKey, id],
      (prev) => ({ ...prev, ...updateSecurityMasterVal })
    );
  };

  const deleteSecurityMaster = (id: number) => {
    queryClient.setQueryData<SecurityMasterType>(
      [SecurityMasterKey, id],
      undefined
    );
  };

  return {
    addSecurityMaster,
    updateSecurityMaster,
    deleteSecurityMaster,
  };
};

export const useUpdateSecurityMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { updateSecurityMasters } = useSecurityMastersQuerySetData();
  const { updateSecurityMaster } = useSecurityMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateSecurityMasterVal: SecurityMasterFormType) => {
      const response = await axios.put<{ data: SecurityMasterType }>(
        api_routes.securityMasters + `/${id}`,
        updateSecurityMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateSecurityMasterVal) => {
      // ✅ update detail view directly
      updateSecurityMaster(id, updateSecurityMasterVal);
      updateSecurityMasters(id, updateSecurityMasterVal);
      toastSuccess("Security Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddSecurityMasterMutation = () => {
  const { axios } = useAxios();
  const { addSecurityMasters } = useSecurityMastersQuerySetData();
  const { addSecurityMaster } = useSecurityMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newSecurityMasterVal: SecurityMasterFormType) => {
      const response = await axios.post<{ data: SecurityMasterType }>(
        api_routes.securityMasters,
        newSecurityMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newSecurityMasterVal) => {
      // ✅ update detail view directly
      addSecurityMaster(newSecurityMasterVal);
      addSecurityMasters(newSecurityMasterVal);
      toastSuccess("Security Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteSecurityMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { deleteSecurityMasters } = useSecurityMastersQuerySetData();
  const { deleteSecurityMaster } = useSecurityMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: SecurityMasterType }>(
        api_routes.securityMasters + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteSecurityMaster(id);
      deleteSecurityMasters(id);
      toastSuccess("Security Master deleted successfully.");
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
