import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  CommunicationTrackerType,
  CommunicationTrackerFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const CommunicationTrackerKey = "communication_tracker";
export const CommunicationTrackersQueryKey = "communication_trackers";

export const useCommunicationTrackersQuery: (
  projectId: string,
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{
    communicationTracker: (CommunicationTrackerType)[];
  }>,
  unknown
> = (projectId, enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [CommunicationTrackersQueryKey, page, limit, search, projectId],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          communicationTracker: CommunicationTrackerType[];
        }>;
      }>(
        api_routes.communicationTrackers +
          `/list/${projectId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useCommunicationTrackerQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<CommunicationTrackerType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [CommunicationTrackerKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: CommunicationTrackerType }>(
        api_routes.communicationTrackers + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useCommunicationTrackersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addCommunicationTrackers = (
    newCommunicationTrackerVal: CommunicationTrackerType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ communicationTracker: CommunicationTrackerType[] }>
    >(
      [
        CommunicationTrackersQueryKey,
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
            communicationTracker: [
              newCommunicationTrackerVal,
              ...prev.communicationTracker,
            ],
          };
        }
      }
    );
  };

  const updateCommunicationTrackers = (
    id: number,
    updateCommunicationTrackerVal: CommunicationTrackerType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ communicationTracker: CommunicationTrackerType[] }>
    >(
      [CommunicationTrackersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            communicationTracker: prev.communicationTracker.map(
              (communicationTracker) =>
                communicationTracker.id === id
                  ? updateCommunicationTrackerVal
                  : communicationTracker
            ),
          };
        }
      }
    );
  };

  const deleteCommunicationTrackers = (id: number, projectId: string) => {
    queryClient.setQueryData<
      PaginationType<{ communicationTracker: CommunicationTrackerType[] }>
    >(
      [CommunicationTrackersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            communicationTracker: prev.communicationTracker.filter(
              (communicationTracker) => communicationTracker.id !== id
            ),
          };
        }
      }
    );
  };

  return {
    addCommunicationTrackers,
    updateCommunicationTrackers,
    deleteCommunicationTrackers,
  };
};

export const useCommunicationTrackerQuerySetData = () => {
  const queryClient = useQueryClient();

  const addCommunicationTracker = (
    newCommunicationTrackerVal: CommunicationTrackerType
  ) => {
    queryClient.setQueryData<CommunicationTrackerType>(
      [CommunicationTrackerKey, newCommunicationTrackerVal.id],
      newCommunicationTrackerVal
    );
  };

  const updateCommunicationTracker = (
    id: number,
    updateCommunicationTrackerVal: CommunicationTrackerType
  ) => {
    queryClient.setQueryData<CommunicationTrackerType>(
      [CommunicationTrackerKey, id],
      (prev) => ({ ...prev, ...updateCommunicationTrackerVal })
    );
  };

  const deleteCommunicationTracker = (id: number) => {
    queryClient.setQueryData<CommunicationTrackerType>(
      [CommunicationTrackerKey, id],
      undefined
    );
  };

  return {
    addCommunicationTracker,
    updateCommunicationTracker,
    deleteCommunicationTracker,
  };
};

export const useUpdateCommunicationTrackerMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { updateCommunicationTrackers } =
    useCommunicationTrackersQuerySetData();
  const { updateCommunicationTracker } =
    useCommunicationTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateCommunicationTrackerVal: CommunicationTrackerFormType
    ) => {
      const response = await axios.put<{ data: CommunicationTrackerType }>(
        api_routes.communicationTrackers + `/${id}`,
        {
          ...updateCommunicationTrackerVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateCommunicationTrackerVal) => {
      // ✅ update detail view directly
      updateCommunicationTracker(id, updateCommunicationTrackerVal);
      updateCommunicationTrackers(
        id,
        updateCommunicationTrackerVal,
        projectId
      );
      toastSuccess("Communication Tracker updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddCommunicationTrackerMutation = (projectId: string) => {
  const { axios } = useAxios();
  const { addCommunicationTrackers } =
    useCommunicationTrackersQuerySetData();
  const { addCommunicationTracker } = useCommunicationTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newCommunicationTrackerVal: CommunicationTrackerFormType
    ) => {
      const response = await axios.post<{ data: CommunicationTrackerType }>(
        api_routes.communicationTrackers + `/create/${projectId}`,
        {
          ...newCommunicationTrackerVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newCommunicationTrackerVal) => {
      // ✅ update detail view directly
      addCommunicationTracker(newCommunicationTrackerVal);
      addCommunicationTrackers(newCommunicationTrackerVal, projectId);
      toastSuccess("Communication Tracker created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteCommunicationTrackerMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { deleteCommunicationTrackers } =
    useCommunicationTrackersQuerySetData();
  const { deleteCommunicationTracker } =
    useCommunicationTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: CommunicationTrackerType }>(
        api_routes.communicationTrackers + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteCommunicationTracker(id);
      deleteCommunicationTrackers(id, projectId);
      toastSuccess("Communication Tracker deleted successfully.");
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
