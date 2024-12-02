import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  StageNameQueryFormType,
  StageNameQueryType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const StageNameQueryKey = "stageName";
export const StageNamesQueryKey = "stageNames";
export const StageNamesSelectQueryKey = "stageNames_select";

export const useStageNamesQuery: () => UseQueryResult<
  PaginationType<{ stageName: StageNameQueryType[] }>,
  unknown
> = () => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [StageNamesQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ stageName: StageNameQueryType[] }>;
      }>(api_routes.stageNames + `?page=${page}&limit=${limit}&search=${search}`);
      return response.data.data;
    },
  });
};

export const useStageNameQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<StageNameQueryType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [StageNameQueryKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: StageNameQueryType }>(
        api_routes.stageNames + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useStageNamesQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addStageNames = (newStageNameVal: StageNameQueryType) => {
    queryClient.setQueryData<PaginationType<{ stageName: StageNameQueryType[] }>>(
      [StageNamesQueryKey, QueryInitialPageParam.toString(), limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            last_page: prev.last_page + 1,
            total: prev.total + 1,
            current_page: prev.current_page + 1,
            stageName: [newStageNameVal, ...prev.stageName],
          };
        }
      }
    );
  };

  const updateStageNames = (id: number, updateStageNameVal: StageNameQueryType) => {
    queryClient.setQueryData<PaginationType<{ stageName: StageNameQueryType[] }>>(
      [StageNamesQueryKey, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            stageName: prev.stageName.map((stageName) =>
              stageName.id === id ? updateStageNameVal : stageName
            ),
          };
        }
      }
    );
  };

  const deleteStageNames = (id: number) => {
    queryClient.setQueryData<PaginationType<{ stageName: StageNameQueryType[] }>>(
      [StageNamesQueryKey, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            stageName: prev.stageName.filter((stageName) => stageName.id !== id),
          };
        }
      }
    );
  };

  return {
    addStageNames,
    updateStageNames,
    deleteStageNames,
  };
};

export const useStageNameQuerySetData = () => {
  const queryClient = useQueryClient();

  const addStageName = (newStageNameVal: StageNameQueryType) => {
    queryClient.setQueryData<StageNameQueryType>(
      [StageNameQueryKey, newStageNameVal.id],
      newStageNameVal
    );
  };

  const updateStageName = (id: number, updateStageNameVal: StageNameQueryType) => {
    queryClient.setQueryData<StageNameQueryType>(
      [StageNameQueryKey, id],
      updateStageNameVal
    );
  };

  const deleteStageName = (id: number) => {
    queryClient.setQueryData<StageNameQueryType>(
      [StageNameQueryKey, id],
      undefined
    );
  };

  return {
    addStageName,
    updateStageName,
    deleteStageName,
  };
};

export const useUpdateStageNameMutation = (id: number) => {
  const { axios } = useAxios();
  const { updateStageName } = useStageNameQuerySetData();
  const { updateStageNames } = useStageNamesQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateStageNameVal: StageNameQueryFormType) => {
      const response = await axios.put<{ data: StageNameQueryType }>(
        api_routes.stageNames + `/${id}`,
        updateStageNameVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateStageNameVal) => {
      // ✅ update detail view directly
      updateStageName(id, updateStageNameVal);
      updateStageNames(id, updateStageNameVal);
      toastSuccess("StageName updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddStageNameMutation = () => {
  const { axios } = useAxios();
  const { addStageName } = useStageNameQuerySetData();
  const { addStageNames } = useStageNamesQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newStageNameVal: StageNameQueryFormType) => {
      const response = await axios.post<{ data: StageNameQueryType }>(
        api_routes.stageNames,
        newStageNameVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newStageNameVal) => {
      // ✅ update detail view directly
      addStageName(newStageNameVal);
      addStageNames(newStageNameVal);
      toastSuccess("StageName created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteStageNameMutation = (id: number) => {
  const { axios } = useAxios();
  const { deleteStageName } = useStageNameQuerySetData();
  const { deleteStageNames } = useStageNamesQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: StageNameQueryType }>(
        api_routes.stageNames + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteStageName(id);
      deleteStageNames(id);
      toastSuccess("StageName deleted successfully.");
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

export const useStageNamesSelectQuery: ({
  search,
  enabled,
}: {
  search?: string;
  enabled?: boolean;
}) => UseQueryResult<
  StageNameQueryType[],
  unknown
> = ({ search = "", enabled = false }) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [StageNamesSelectQueryKey, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: StageNameQueryType[];
      }>(api_routes.stageNames + `/all?search=${search}`);
      return response.data.data;
    },
    enabled: enabled,
  });
};
