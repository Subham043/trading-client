import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  SuretyType,
  SuretyFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const SuretyKey = "surety";
export const SuretysQueryKey = "suretys";

export const useSuretysQuery: (
  projectId: string,
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{
    suretys: (SuretyType)[];
  }>,
  unknown
> = (projectId, enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [SuretysQueryKey, page, limit, search, projectId],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          surety: SuretyType[];
        }>;
      }>(
        api_routes.suretys +
          `/list/${projectId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useSuretyQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<SuretyType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [SuretyKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: SuretyType }>(
        api_routes.suretys + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useSuretysQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addSuretys = (
    newSuretyVal: SuretyType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ suretys: SuretyType[] }>
    >(
      [
        SuretysQueryKey,
        QueryInitialPageParam.toString(),
        limit,
        search,
        projectId,
      ],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            last_page: prev.last_page + 1,
            total: prev.total + 1,
            current_page: prev.current_page + 1,
            suretys: [
              newSuretyVal,
              ...prev.suretys,
            ],
          };
        }
      }
    );
  };

  const updateSuretys = (
    id: number,
    updateSuretyVal: SuretyType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ suretys: SuretyType[] }>
    >(
      [SuretysQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            suretys: prev.suretys.map(
              (surety) =>
                surety.id === id
                  ? updateSuretyVal
                  : surety
            ),
          };
        }
      }
    );
  };

  const deleteSuretys = (id: number, projectId: string) => {
    queryClient.setQueryData<
      PaginationType<{ suretys: SuretyType[] }>
    >(
      [SuretysQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            suretys: prev.suretys.filter(
              (surety) => surety.id !== id
            ),
          };
        }
      }
    );
  };

  return {
    addSuretys,
    updateSuretys,
    deleteSuretys,
  };
};

export const useSuretyQuerySetData = () => {
  const queryClient = useQueryClient();

  const addSurety = (
    newSuretyVal: SuretyType
  ) => {
    queryClient.setQueryData<SuretyType>(
      [SuretyKey, newSuretyVal.id],
      newSuretyVal
    );
  };

  const updateSurety = (
    id: number,
    updateSuretyVal: SuretyType
  ) => {
    queryClient.setQueryData<SuretyType>(
      [SuretyKey, id],
      (prev) => ({ ...prev, ...updateSuretyVal })
    );
  };

  const deleteSurety = (id: number) => {
    queryClient.setQueryData<SuretyType>(
      [SuretyKey, id],
      undefined
    );
  };

  return {
    addSurety,
    updateSurety,
    deleteSurety,
  };
};

export const useUpdateSuretyMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { updateSuretys } =
    useSuretysQuerySetData();
  const { updateSurety } =
    useSuretyQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateSuretyVal: SuretyFormType
    ) => {
      const response = await axios.put<{ data: SuretyType }>(
        api_routes.suretys + `/${id}`,
        {
          ...updateSuretyVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateSuretyVal) => {
      // ✅ update detail view directly
      updateSurety(id, updateSuretyVal);
      updateSuretys(
        id,
        updateSuretyVal,
        projectId
      );
      toastSuccess("Surety updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddSuretyMutation = (projectId: string) => {
  const { axios } = useAxios();
  const { addSuretys } =
    useSuretysQuerySetData();
  const { addSurety } = useSuretyQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newSuretyVal: SuretyFormType
    ) => {
      const response = await axios.post<{ data: SuretyType }>(
        api_routes.suretys + `/create/${projectId}`,
        {
          ...newSuretyVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newSuretyVal) => {
      // ✅ update detail view directly
      addSurety(newSuretyVal);
      addSuretys(newSuretyVal, projectId);
      toastSuccess("Surety created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteSuretyMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { deleteSuretys } =
    useSuretysQuerySetData();
  const { deleteSurety } =
    useSuretyQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: SuretyType }>(
        api_routes.suretys + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteSurety(id);
      deleteSuretys(id, projectId);
      toastSuccess("Surety deleted successfully.");
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
