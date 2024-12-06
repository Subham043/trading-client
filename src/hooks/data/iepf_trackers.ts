import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  IepfTrackerType,
  IepfTrackerFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const IepfTrackerKey = "iepf_tracker";
export const IepfTrackersQueryKey = "iepf_trackers";

export const useIepfTrackersQuery: (
  projectId: string,
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{
    iepfTracker: (IepfTrackerType)[];
  }>,
  unknown
> = (projectId, enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [IepfTrackersQueryKey, page, limit, search, projectId],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          iepfTracker: IepfTrackerType[];
        }>;
      }>(
        api_routes.iepfTrackers +
          `/list/${projectId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useIepfTrackerQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<IepfTrackerType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [IepfTrackerKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: IepfTrackerType }>(
        api_routes.iepfTrackers + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useIepfTrackersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addIepfTrackers = (
    newIepfTrackerVal: IepfTrackerType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ iepfTracker: IepfTrackerType[] }>
    >(
      [
        IepfTrackersQueryKey,
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
            iepfTracker: [
              newIepfTrackerVal,
              ...prev.iepfTracker,
            ],
          };
        }
      }
    );
  };

  const updateIepfTrackers = (
    id: number,
    updateIepfTrackerVal: IepfTrackerType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ iepfTracker: IepfTrackerType[] }>
    >(
      [IepfTrackersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            iepfTracker: prev.iepfTracker.map(
              (iepfTracker) =>
                iepfTracker.id === id
                  ? updateIepfTrackerVal
                  : iepfTracker
            ),
          };
        }
      }
    );
  };

  const deleteIepfTrackers = (id: number, projectId: string) => {
    queryClient.setQueryData<
      PaginationType<{ iepfTracker: IepfTrackerType[] }>
    >(
      [IepfTrackersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            iepfTracker: prev.iepfTracker.filter(
              (iepfTracker) => iepfTracker.id !== id
            ),
          };
        }
      }
    );
  };

  return {
    addIepfTrackers,
    updateIepfTrackers,
    deleteIepfTrackers,
  };
};

export const useIepfTrackerQuerySetData = () => {
  const queryClient = useQueryClient();

  const addIepfTracker = (
    newIepfTrackerVal: IepfTrackerType
  ) => {
    queryClient.setQueryData<IepfTrackerType>(
      [IepfTrackerKey, newIepfTrackerVal.id],
      newIepfTrackerVal
    );
  };

  const updateIepfTracker = (
    id: number,
    updateIepfTrackerVal: IepfTrackerType
  ) => {
    queryClient.setQueryData<IepfTrackerType>(
      [IepfTrackerKey, id],
      (prev) => ({ ...prev, ...updateIepfTrackerVal })
    );
  };

  const deleteIepfTracker = (id: number) => {
    queryClient.setQueryData<IepfTrackerType>(
      [IepfTrackerKey, id],
      undefined
    );
  };

  return {
    addIepfTracker,
    updateIepfTracker,
    deleteIepfTracker,
  };
};

export const useUpdateIepfTrackerMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { updateIepfTrackers } =
    useIepfTrackersQuerySetData();
  const { updateIepfTracker } =
    useIepfTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateIepfTrackerVal: IepfTrackerFormType
    ) => {
      const response = await axios.put<{ data: IepfTrackerType }>(
        api_routes.iepfTrackers + `/${id}`,
        {
          ...updateIepfTrackerVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateIepfTrackerVal) => {
      // ✅ update detail view directly
      updateIepfTracker(id, updateIepfTrackerVal);
      updateIepfTrackers(
        id,
        updateIepfTrackerVal,
        projectId
      );
      toastSuccess("Iepf Tracker updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddIepfTrackerMutation = (projectId: string) => {
  const { axios } = useAxios();
  const { addIepfTrackers } =
    useIepfTrackersQuerySetData();
  const { addIepfTracker } = useIepfTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newIepfTrackerVal: IepfTrackerFormType
    ) => {
      const response = await axios.post<{ data: IepfTrackerType }>(
        api_routes.iepfTrackers + `/create/${projectId}`,
        {
          ...newIepfTrackerVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newIepfTrackerVal) => {
      // ✅ update detail view directly
      addIepfTracker(newIepfTrackerVal);
      addIepfTrackers(newIepfTrackerVal, projectId);
      toastSuccess("Iepf Tracker created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteIepfTrackerMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { deleteIepfTrackers } =
    useIepfTrackersQuerySetData();
  const { deleteIepfTracker } =
    useIepfTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: IepfTrackerType }>(
        api_routes.iepfTrackers + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteIepfTracker(id);
      deleteIepfTrackers(id, projectId);
      toastSuccess("Iepf Tracker deleted successfully.");
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
