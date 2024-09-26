import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  ShareHolderMasterType,
  ShareHolderMasterFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const ShareHolderMasterKey = "share_holder_master";
export const ShareHolderMasterInfoKey = "share_holder_master_info";
export const ShareHolderMastersQueryKey = "share_holder_masters";

export const useShareHolderMastersQuery: (
  projectId: string,
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{
    shareHolderMaster: ShareHolderMasterType[];
  }>,
  unknown
> = (projectId, enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [ShareHolderMastersQueryKey, page, limit, search, projectId],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          shareHolderMaster: ShareHolderMasterType[];
        }>;
      }>(
        api_routes.shareHolderMasters +
          `/list/${projectId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useShareHolderMasterQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<ShareHolderMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [ShareHolderMasterKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: ShareHolderMasterType }>(
        api_routes.shareHolderMasters + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useShareHolderMasterInfoQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<ShareHolderMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [ShareHolderMasterInfoKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: ShareHolderMasterType }>(
        api_routes.shareHolderMasters + `/info/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useShareHolderMastersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addShareHolderMasters = (
    newShareHolderMasterVal: ShareHolderMasterType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ shareHolderMaster: ShareHolderMasterType[] }>
    >(
      [
        ShareHolderMastersQueryKey,
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
            shareHolderMaster: [
              newShareHolderMasterVal,
              ...prev.shareHolderMaster,
            ],
          };
        }
      }
    );
  };

  const updateShareHolderMasters = (
    id: number,
    updateShareHolderMasterVal: ShareHolderMasterType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ shareHolderMaster: ShareHolderMasterType[] }>
    >(
      [ShareHolderMastersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            shareHolderMaster: prev.shareHolderMaster.map(
              (shareHolderMaster) =>
                shareHolderMaster.id === id
                  ? updateShareHolderMasterVal
                  : shareHolderMaster
            ),
          };
        }
      }
    );
  };

  const deleteShareHolderMasters = (id: number, projectId: string) => {
    queryClient.setQueryData<
      PaginationType<{ shareHolderMaster: ShareHolderMasterType[] }>
    >(
      [ShareHolderMastersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            shareHolderMaster: prev.shareHolderMaster.filter(
              (shareHolderMaster) => shareHolderMaster.id !== id
            ),
          };
        }
      }
    );
  };

  return {
    addShareHolderMasters,
    updateShareHolderMasters,
    deleteShareHolderMasters,
  };
};

export const useShareHolderMasterQuerySetData = () => {
  const queryClient = useQueryClient();

  const addShareHolderMaster = (
    newShareHolderMasterVal: ShareHolderMasterType
  ) => {
    queryClient.setQueryData<ShareHolderMasterType>(
      [ShareHolderMasterKey, newShareHolderMasterVal.id],
      newShareHolderMasterVal
    );
  };

  const updateShareHolderMaster = (
    id: number,
    updateShareHolderMasterVal: ShareHolderMasterType
  ) => {
    queryClient.setQueryData<ShareHolderMasterType>(
      [ShareHolderMasterKey, id],
      (prev) => ({ ...prev, ...updateShareHolderMasterVal })
    );
  };

  const deleteShareHolderMaster = (id: number) => {
    queryClient.setQueryData<ShareHolderMasterType>(
      [ShareHolderMasterKey, id],
      undefined
    );
  };

  return {
    addShareHolderMaster,
    updateShareHolderMaster,
    deleteShareHolderMaster,
  };
};

export const useUpdateShareHolderMasterMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { updateShareHolderMasters } =
    useShareHolderMastersQuerySetData();
  const { updateShareHolderMaster } =
    useShareHolderMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateShareHolderMasterVal: ShareHolderMasterFormType
    ) => {
      const response = await axios.put<{ data: ShareHolderMasterType }>(
        api_routes.shareHolderMasters + `/${id}`,
        updateShareHolderMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateShareHolderMasterVal) => {
      // ✅ update detail view directly
      updateShareHolderMaster(id, updateShareHolderMasterVal);
      updateShareHolderMasters(
        id,
        updateShareHolderMasterVal,
        projectId
      );
      toastSuccess("Share Certificate Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddShareHolderMasterMutation = (projectId: string) => {
  const { axios } = useAxios();
  const { addShareHolderMasters } =
    useShareHolderMastersQuerySetData();
  const { addShareHolderMaster } = useShareHolderMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newShareHolderMasterVal: ShareHolderMasterFormType
    ) => {
      const response = await axios.post<{ data: ShareHolderMasterType }>(
        api_routes.shareHolderMasters + `/create/${projectId}`,
        newShareHolderMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newShareHolderMasterVal) => {
      // ✅ update detail view directly
      addShareHolderMaster(newShareHolderMasterVal);
      addShareHolderMasters(newShareHolderMasterVal, projectId);
      toastSuccess("Share Certificate Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteShareHolderMasterMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { deleteShareHolderMasters } =
    useShareHolderMastersQuerySetData();
  const { deleteShareHolderMaster } =
    useShareHolderMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: ShareHolderMasterType }>(
        api_routes.shareHolderMasters + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteShareHolderMaster(id);
      deleteShareHolderMasters(id, projectId);
      toastSuccess("Share Certificate Master deleted successfully.");
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
