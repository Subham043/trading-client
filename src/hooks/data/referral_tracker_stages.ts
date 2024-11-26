import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  ReferralTrackerStageFormType,
  ReferralTrackerStageType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const ReferralTrackerStageKey = "referral_tracker_stage";
export const ReferralTrackerStagesQueryKey = "referral_tracker_stages";
export const ReferralTrackerStagesSelectQueryKey = "referral_tracker_stages_select";

export const useReferralTrackerStagesQuery: (params: {
  paymentTrackerId: number;
}) => UseQueryResult<PaginationType<{ referralTrackerStages: (ReferralTrackerStageType)[] }>, unknown> = ({
  paymentTrackerId,
}) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [ReferralTrackerStagesQueryKey, paymentTrackerId, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          referralTrackerStages: ReferralTrackerStageType[];
        }>;
      }>(
        api_routes.referralTrackerStages +
          `/list/${paymentTrackerId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useReferralTrackerStagesSelectQuery: (params: {
  search?: string;
  enabled?: boolean;
}) => UseQueryResult<PaginationType<{ referralTrackerStages: ReferralTrackerStageType[] }>, unknown> = ({
  search = "",
  enabled = true,
}) => {
  const { axios } = useAxios();

  return useQuery({
    queryKey: [ReferralTrackerStagesSelectQueryKey, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          referralTrackerStages: ReferralTrackerStageType[];
        }>;
      }>(api_routes.referralTrackerStages + `/list-all?page=1&limit=20&search=${search}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useReferralTrackerStageQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<ReferralTrackerStageType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [ReferralTrackerStageKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: ReferralTrackerStageType;
      }>(api_routes.referralTrackerStages + `/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useReferralTrackerStagesQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addReferralTrackerStages = (
    paymentTrackerId: number,
    newReferralTrackerStageVal: ReferralTrackerStageType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        referralTrackerStages: ReferralTrackerStageType[];
      }>
    >(
      [
        ReferralTrackerStagesQueryKey,
        paymentTrackerId,
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
            referralTrackerStages: [newReferralTrackerStageVal, ...prev.referralTrackerStages],
          };
        }
      }
    );
  };

  const updateReferralTrackerStages = (
    id: number,
    paymentTrackerId: number,
    updateReferralTrackerStageVal: ReferralTrackerStageType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        referralTrackerStages: ReferralTrackerStageType[];
      }>
    >(
      [ReferralTrackerStagesQueryKey, paymentTrackerId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            referralTrackerStages: prev.referralTrackerStages.map((referralTrackerStage) =>
              referralTrackerStage.id === id
                ? {
                    ...referralTrackerStage,
                    ...updateReferralTrackerStageVal,
                  }
                : referralTrackerStage
            ),
          };
        }
      }
    );
  };

  const deleteReferralTrackerStages = (id: number, paymentTrackerId: number) => {
    queryClient.setQueryData<
      PaginationType<{
        referralTrackerStages: ReferralTrackerStageType[];
      }>
    >(
      [ReferralTrackerStagesQueryKey, paymentTrackerId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            referralTrackerStages: prev.referralTrackerStages.filter((referralTrackerStage) => referralTrackerStage.id !== id),
          };
        }
      }
    );
  };

  return {
    addReferralTrackerStages,
    updateReferralTrackerStages,
    deleteReferralTrackerStages,
  };
};

export const useReferralTrackerStageQuerySetData = () => {
  const queryClient = useQueryClient();

  const addReferralTrackerStage = (newReferralTrackerStageVal: ReferralTrackerStageType) => {
    queryClient.setQueryData<ReferralTrackerStageType>(
      [ReferralTrackerStageKey, newReferralTrackerStageVal.id],
      newReferralTrackerStageVal
    );
  };

  const updateReferralTrackerStage = (id: number, updateReferralTrackerStageVal: ReferralTrackerStageType) => {
    queryClient.setQueryData<ReferralTrackerStageType>([ReferralTrackerStageKey, id], updateReferralTrackerStageVal);
  };

  const deleteReferralTrackerStage = (id: number) => {
    queryClient.setQueryData<ReferralTrackerStageType>([ReferralTrackerStageKey, id], undefined);
  };

  return {
    addReferralTrackerStage,
    updateReferralTrackerStage,
    deleteReferralTrackerStage,
  };
};

export const useUpdateReferralTrackerStageMutation = (
  id: number,
  paymentTrackerId: number
) => {
  const { axios } = useAxios();
  const { updateReferralTrackerStages } = useReferralTrackerStagesQuerySetData();
  const { updateReferralTrackerStage } = useReferralTrackerStageQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateReferralTrackerStageVal: ReferralTrackerStageFormType) => {
      const response = await axios.put<{
        data: ReferralTrackerStageType;
      }>(api_routes.referralTrackerStages + `/${id}`, {
        ...updateReferralTrackerStageVal,
        amount: Number(updateReferralTrackerStageVal.amount),
      });
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateReferralTrackerStageVal) => {
      // ✅ update detail view directly
      updateReferralTrackerStage(id, updateReferralTrackerStageVal);
      updateReferralTrackerStages(id, paymentTrackerId, updateReferralTrackerStageVal);
      toastSuccess("Referral Tracker Stage updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddReferralTrackerStageMutation = (paymentTrackerId: number) => {
  const { axios } = useAxios();
  const { addReferralTrackerStages } = useReferralTrackerStagesQuerySetData();
  const { addReferralTrackerStage } = useReferralTrackerStageQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newReferralTrackerStageVal: ReferralTrackerStageFormType) => {
      const {...rest} = newReferralTrackerStageVal;
      const response = await axios.post<{
        data: ReferralTrackerStageType;
      }>(api_routes.referralTrackerStages + `/create/${paymentTrackerId}`, {
        ...rest,
        amount: Number(rest.amount),
      });
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newReferralTrackerStageVal) => {
      // ✅ update detail view directly
      addReferralTrackerStage(newReferralTrackerStageVal);
      addReferralTrackerStages(paymentTrackerId, newReferralTrackerStageVal);
      toastSuccess("Referral Tracker Stage created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteReferralTrackerStageMutation = (
  id: number,
  paymentTrackerId: number
) => {
  const { axios } = useAxios();
  const { deleteReferralTrackerStages } = useReferralTrackerStagesQuerySetData();
  const { deleteReferralTrackerStage } = useReferralTrackerStageQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{
        data: ReferralTrackerStageType;
      }>(api_routes.referralTrackerStages + `/${id}`);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteReferralTrackerStage(id);
      deleteReferralTrackerStages(id, paymentTrackerId);
      toastSuccess("Referral Tracker Stage deleted successfully.");
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
