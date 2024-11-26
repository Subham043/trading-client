import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  PaymentTrackerStageFormType,
  PaymentTrackerStageType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const PaymentTrackerStageKey = "payment_tracker_stage";
export const PaymentTrackerStagesQueryKey = "payment_tracker_stages";
export const PaymentTrackerStagesSelectQueryKey = "payment_tracker_stages_select";

export const usePaymentTrackerStagesQuery: (params: {
  paymentTrackerId: number;
}) => UseQueryResult<PaginationType<{ paymentTrackerStages: (PaymentTrackerStageType)[] }>, unknown> = ({
  paymentTrackerId,
}) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [PaymentTrackerStagesQueryKey, paymentTrackerId, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          paymentTrackerStages: PaymentTrackerStageType[];
        }>;
      }>(
        api_routes.paymentTrackerStages +
          `/list/${paymentTrackerId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const usePaymentTrackerStagesSelectQuery: (params: {
  search?: string;
  enabled?: boolean;
}) => UseQueryResult<PaginationType<{ paymentTrackerStages: PaymentTrackerStageType[] }>, unknown> = ({
  search = "",
  enabled = true,
}) => {
  const { axios } = useAxios();

  return useQuery({
    queryKey: [PaymentTrackerStagesSelectQueryKey, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          paymentTrackerStages: PaymentTrackerStageType[];
        }>;
      }>(api_routes.paymentTrackerStages + `/list-all?page=1&limit=20&search=${search}`);
      return response.data.data;
    },
    enabled,
  });
};

export const usePaymentTrackerStageQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<PaymentTrackerStageType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [PaymentTrackerStageKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaymentTrackerStageType;
      }>(api_routes.paymentTrackerStages + `/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const usePaymentTrackerStagesQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addPaymentTrackerStages = (
    paymentTrackerId: number,
    newPaymentTrackerStageVal: PaymentTrackerStageType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        paymentTrackerStages: PaymentTrackerStageType[];
      }>
    >(
      [
        PaymentTrackerStagesQueryKey,
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
            paymentTrackerStages: [newPaymentTrackerStageVal, ...prev.paymentTrackerStages],
          };
        }
      }
    );
  };

  const updatePaymentTrackerStages = (
    id: number,
    paymentTrackerId: number,
    updatePaymentTrackerStageVal: PaymentTrackerStageType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        paymentTrackerStages: PaymentTrackerStageType[];
      }>
    >(
      [PaymentTrackerStagesQueryKey, paymentTrackerId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            paymentTrackerStages: prev.paymentTrackerStages.map((paymentTrackerStage) =>
              paymentTrackerStage.id === id
                ? {
                    ...paymentTrackerStage,
                    ...updatePaymentTrackerStageVal,
                  }
                : paymentTrackerStage
            ),
          };
        }
      }
    );
  };

  const deletePaymentTrackerStages = (id: number, paymentTrackerId: number) => {
    queryClient.setQueryData<
      PaginationType<{
        paymentTrackerStages: PaymentTrackerStageType[];
      }>
    >(
      [PaymentTrackerStagesQueryKey, paymentTrackerId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            paymentTrackerStages: prev.paymentTrackerStages.filter((paymentTrackerStage) => paymentTrackerStage.id !== id),
          };
        }
      }
    );
  };

  return {
    addPaymentTrackerStages,
    updatePaymentTrackerStages,
    deletePaymentTrackerStages,
  };
};

export const usePaymentTrackerStageQuerySetData = () => {
  const queryClient = useQueryClient();

  const addPaymentTrackerStage = (newPaymentTrackerStageVal: PaymentTrackerStageType) => {
    queryClient.setQueryData<PaymentTrackerStageType>(
      [PaymentTrackerStageKey, newPaymentTrackerStageVal.id],
      newPaymentTrackerStageVal
    );
  };

  const updatePaymentTrackerStage = (id: number, updatePaymentTrackerStageVal: PaymentTrackerStageType) => {
    queryClient.setQueryData<PaymentTrackerStageType>([PaymentTrackerStageKey, id], updatePaymentTrackerStageVal);
  };

  const deletePaymentTrackerStage = (id: number) => {
    queryClient.setQueryData<PaymentTrackerStageType>([PaymentTrackerStageKey, id], undefined);
  };

  return {
    addPaymentTrackerStage,
    updatePaymentTrackerStage,
    deletePaymentTrackerStage,
  };
};

export const useUpdatePaymentTrackerStageMutation = (
  id: number,
  paymentTrackerId: number
) => {
  const { axios } = useAxios();
  const { updatePaymentTrackerStages } = usePaymentTrackerStagesQuerySetData();
  const { updatePaymentTrackerStage } = usePaymentTrackerStageQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updatePaymentTrackerStageVal: PaymentTrackerStageFormType) => {
      const response = await axios.put<{
        data: PaymentTrackerStageType;
      }>(api_routes.paymentTrackerStages + `/${id}`, {
        ...updatePaymentTrackerStageVal,
        amount: Number(updatePaymentTrackerStageVal.amount),
      });
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updatePaymentTrackerStageVal) => {
      // ✅ update detail view directly
      updatePaymentTrackerStage(id, updatePaymentTrackerStageVal);
      updatePaymentTrackerStages(id, paymentTrackerId, updatePaymentTrackerStageVal);
      toastSuccess("Payment Tracker Stage updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddPaymentTrackerStageMutation = (paymentTrackerId: number) => {
  const { axios } = useAxios();
  const { addPaymentTrackerStages } = usePaymentTrackerStagesQuerySetData();
  const { addPaymentTrackerStage } = usePaymentTrackerStageQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newPaymentTrackerStageVal: PaymentTrackerStageFormType) => {
      const {...rest} = newPaymentTrackerStageVal;
      const response = await axios.post<{
        data: PaymentTrackerStageType;
      }>(api_routes.paymentTrackerStages + `/create/${paymentTrackerId}`, {
        ...rest,
        amount: Number(rest.amount),
      });
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newPaymentTrackerStageVal) => {
      // ✅ update detail view directly
      addPaymentTrackerStage(newPaymentTrackerStageVal);
      addPaymentTrackerStages(paymentTrackerId, newPaymentTrackerStageVal);
      toastSuccess("Payment Tracker Stage created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeletePaymentTrackerStageMutation = (
  id: number,
  paymentTrackerId: number
) => {
  const { axios } = useAxios();
  const { deletePaymentTrackerStages } = usePaymentTrackerStagesQuerySetData();
  const { deletePaymentTrackerStage } = usePaymentTrackerStageQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{
        data: PaymentTrackerStageType;
      }>(api_routes.paymentTrackerStages + `/${id}`);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deletePaymentTrackerStage(id);
      deletePaymentTrackerStages(id, paymentTrackerId);
      toastSuccess("Payment Tracker Stage deleted successfully.");
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
