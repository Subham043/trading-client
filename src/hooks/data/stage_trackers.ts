import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  StageTrackerType,
  StageTrackerFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const StageTrackerKey = "stage_tracker";
export const StageTrackersQueryKey = "stage_trackers";

export const useStageTrackersQuery: (
  projectId: string,
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{
    stageTracker: (StageTrackerType)[];
  }>,
  unknown
> = (projectId, enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [StageTrackersQueryKey, page, limit, search, projectId],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          stageTracker: StageTrackerType[];
        }>;
      }>(
        api_routes.stageTrackers +
          `/list/${projectId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useStageTrackerQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<StageTrackerType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [StageTrackerKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: StageTrackerType }>(
        api_routes.stageTrackers + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useStageTrackersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addStageTrackers = (
    newStageTrackerVal: StageTrackerType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ stageTracker: StageTrackerType[] }>
    >(
      [
        StageTrackersQueryKey,
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
            stageTracker: [
              newStageTrackerVal,
              ...prev.stageTracker,
            ],
          };
        }
      }
    );
  };

  const updateStageTrackers = (
    id: number,
    updateStageTrackerVal: StageTrackerType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ stageTracker: StageTrackerType[] }>
    >(
      [StageTrackersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            stageTracker: prev.stageTracker.map(
              (stageTracker) =>
                stageTracker.id === id
                  ? updateStageTrackerVal
                  : stageTracker
            ),
          };
        }
      }
    );
  };

  const deleteStageTrackers = (id: number, projectId: string) => {
    queryClient.setQueryData<
      PaginationType<{ stageTracker: StageTrackerType[] }>
    >(
      [StageTrackersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            stageTracker: prev.stageTracker.filter(
              (stageTracker) => stageTracker.id !== id
            ),
          };
        }
      }
    );
  };

  return {
    addStageTrackers,
    updateStageTrackers,
    deleteStageTrackers,
  };
};

export const useStageTrackerQuerySetData = () => {
  const queryClient = useQueryClient();

  const addStageTracker = (
    newStageTrackerVal: StageTrackerType
  ) => {
    queryClient.setQueryData<StageTrackerType>(
      [StageTrackerKey, newStageTrackerVal.id],
      newStageTrackerVal
    );
  };

  const updateStageTracker = (
    id: number,
    updateStageTrackerVal: StageTrackerType
  ) => {
    queryClient.setQueryData<StageTrackerType>(
      [StageTrackerKey, id],
      (prev) => ({ ...prev, ...updateStageTrackerVal })
    );
  };

  const deleteStageTracker = (id: number) => {
    queryClient.setQueryData<StageTrackerType>(
      [StageTrackerKey, id],
      undefined
    );
  };

  return {
    addStageTracker,
    updateStageTracker,
    deleteStageTracker,
  };
};

export const useUpdateStageTrackerMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { updateStageTrackers } =
    useStageTrackersQuerySetData();
  const { updateStageTracker } =
    useStageTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateStageTrackerVal: StageTrackerFormType
    ) => {
      const response = await axios.put<{ data: StageTrackerType }>(
        api_routes.stageTrackers + `/${id}`,
        {
          ...updateStageTrackerVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateStageTrackerVal) => {
      // ✅ update detail view directly
      updateStageTracker(id, updateStageTrackerVal);
      updateStageTrackers(
        id,
        updateStageTrackerVal,
        projectId
      );
      toastSuccess("Stage Tracker updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddStageTrackerMutation = (projectId: string) => {
  const { axios } = useAxios();
  const { addStageTrackers } =
    useStageTrackersQuerySetData();
  const { addStageTracker } = useStageTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newStageTrackerVal: StageTrackerFormType
    ) => {
      const response = await axios.post<{ data: StageTrackerType }>(
        api_routes.stageTrackers + `/create/${projectId}`,
        {
          ...newStageTrackerVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newStageTrackerVal) => {
      // ✅ update detail view directly
      addStageTracker(newStageTrackerVal);
      addStageTrackers(newStageTrackerVal, projectId);
      toastSuccess("Stage Tracker created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteStageTrackerMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { deleteStageTrackers } =
    useStageTrackersQuerySetData();
  const { deleteStageTracker } =
    useStageTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: StageTrackerType }>(
        api_routes.stageTrackers + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteStageTracker(id);
      deleteStageTrackers(id, projectId);
      toastSuccess("Stage Tracker deleted successfully.");
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
