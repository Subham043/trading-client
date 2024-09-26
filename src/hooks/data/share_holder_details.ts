import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  ShareHolderDetailFormType,
  ShareHolderDetailType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const ShareHolderDetailKey = "share_holder_detail";
export const ShareHolderDetailsQueryKey = "share_holder_details";

export const useShareHolderDetailsQuery: (params: {
  shareHolderMasterId: number;
}) => UseQueryResult<PaginationType<{ shareHolderDetail: (ShareHolderDetailType & {consolidatedHolding:string; totalMarketValue:number})[] }>, unknown> = ({
  shareHolderMasterId,
}) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [ShareHolderDetailsQueryKey, shareHolderMasterId, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          shareHolderDetail: ShareHolderDetailType[];
        }>;
      }>(
        api_routes.shareHolderDetails +
          `/list/${shareHolderMasterId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useShareHolderDetailQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<ShareHolderDetailType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [ShareHolderDetailKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: ShareHolderDetailType;
      }>(api_routes.shareHolderDetails + `/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useShareHolderDetailsQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addShareHolderDetails = (
    shareHolderMasterId: number,
    newShareHolderDetailVal: ShareHolderDetailType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        shareHolderDetail: ShareHolderDetailType[];
      }>
    >(
      [
        ShareHolderDetailsQueryKey,
        shareHolderMasterId,
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
            shareHolderDetail: [newShareHolderDetailVal, ...prev.shareHolderDetail],
          };
        }
      }
    );
  };

  const updateShareHolderDetails = (
    id: number,
    shareHolderMasterId: number,
    updateShareHolderDetailVal: ShareHolderDetailType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        shareHolderDetail: ShareHolderDetailType[];
      }>
    >(
      [ShareHolderDetailsQueryKey, shareHolderMasterId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            shareHolderDetail: prev.shareHolderDetail.map((shareHolderDetail) =>
              shareHolderDetail.id === id
                ? {
                    ...shareHolderDetail,
                    ...updateShareHolderDetailVal,
                  }
                : shareHolderDetail
            ),
          };
        }
      }
    );
  };

  const deleteShareHolderDetails = (id: number, shareHolderMasterId: number) => {
    queryClient.setQueryData<
      PaginationType<{
        shareHolderDetail: ShareHolderDetailType[];
      }>
    >(
      [ShareHolderDetailsQueryKey, shareHolderMasterId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            shareHolderDetail: prev.shareHolderDetail.filter((shareHolderDetail) => shareHolderDetail.id !== id),
          };
        }
      }
    );
  };

  return {
    addShareHolderDetails,
    updateShareHolderDetails,
    deleteShareHolderDetails,
  };
};

export const useShareHolderDetailQuerySetData = () => {
  const queryClient = useQueryClient();

  const addShareHolderDetail = (newShareHolderDetailVal: ShareHolderDetailType) => {
    queryClient.setQueryData<ShareHolderDetailType>(
      [ShareHolderDetailKey, newShareHolderDetailVal.id],
      newShareHolderDetailVal
    );
  };

  const updateShareHolderDetail = (id: number, updateShareHolderDetailVal: ShareHolderDetailType) => {
    queryClient.setQueryData<ShareHolderDetailType>([ShareHolderDetailKey, id], updateShareHolderDetailVal);
  };

  const deleteShareHolderDetail = (id: number) => {
    queryClient.setQueryData<ShareHolderDetailType>([ShareHolderDetailKey, id], undefined);
  };

  return {
    addShareHolderDetail,
    updateShareHolderDetail,
    deleteShareHolderDetail,
  };
};

export const useUpdateShareHolderDetailMutation = (
  id: number,
  shareHolderMasterId: number
) => {
  const { axios } = useAxios();
  const { updateShareHolderDetails } = useShareHolderDetailsQuerySetData();
  const { updateShareHolderDetail } = useShareHolderDetailQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateShareHolderDetailVal: ShareHolderDetailFormType) => {
      const response = await axios.put<{
        data: ShareHolderDetailType;
      }>(api_routes.shareHolderDetails + `/${id}`, updateShareHolderDetailVal);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateShareHolderDetailVal) => {
      // ✅ update detail view directly
      updateShareHolderDetail(id, updateShareHolderDetailVal);
      updateShareHolderDetails(id, shareHolderMasterId, updateShareHolderDetailVal);
      toastSuccess("Name Change Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddShareHolderDetailMutation = (shareHolderMasterId: number) => {
  const { axios } = useAxios();
  const { addShareHolderDetails } = useShareHolderDetailsQuerySetData();
  const { addShareHolderDetail } = useShareHolderDetailQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newShareHolderDetailVal: ShareHolderDetailFormType) => {
      const response = await axios.post<{
        data: ShareHolderDetailType;
      }>(
        api_routes.shareHolderDetails + `/create/${shareHolderMasterId}`,
        newShareHolderDetailVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newShareHolderDetailVal) => {
      // ✅ update detail view directly
      addShareHolderDetail(newShareHolderDetailVal);
      addShareHolderDetails(shareHolderMasterId, newShareHolderDetailVal);
      toastSuccess("Name Change Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteShareHolderDetailMutation = (
  id: number,
  shareHolderMasterId: number
) => {
  const { axios } = useAxios();
  const { deleteShareHolderDetails } = useShareHolderDetailsQuerySetData();
  const { deleteShareHolderDetail } = useShareHolderDetailQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{
        data: ShareHolderDetailType;
      }>(api_routes.shareHolderDetails + `/${id}`);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteShareHolderDetail(id);
      deleteShareHolderDetails(id, shareHolderMasterId);
      toastSuccess("Name Change Master deleted successfully.");
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
