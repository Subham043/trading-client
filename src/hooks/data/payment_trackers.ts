import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  PaymentTrackerType,
  PaymentTrackerFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const PaymentTrackerKey = "payment_tracker";
export const PaymentTrackersQueryKey = "payment_trackers";

export const usePaymentTrackersQuery: (
  projectId: string,
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{
    paymentTracker: (PaymentTrackerType & {
      totalFolioCount: number;
      totalShares: number;
      folios: string[];
      totalValuationInNse: number;
      totalValuationInBse: number;
    })[];
  }>,
  unknown
> = (projectId, enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [PaymentTrackersQueryKey, page, limit, search, projectId],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          paymentTracker: PaymentTrackerType[];
        }>;
      }>(
        api_routes.paymentTrackers +
          `/list/${projectId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const usePaymentTrackerQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<PaymentTrackerType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [PaymentTrackerKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: PaymentTrackerType }>(
        api_routes.paymentTrackers + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const usePaymentTrackersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addPaymentTrackers = (
    newPaymentTrackerVal: PaymentTrackerType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ paymentTracker: PaymentTrackerType[] }>
    >(
      [
        PaymentTrackersQueryKey,
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
            paymentTracker: [
              newPaymentTrackerVal,
              ...prev.paymentTracker,
            ],
          };
        }
      }
    );
  };

  const updatePaymentTrackers = (
    id: number,
    updatePaymentTrackerVal: PaymentTrackerType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ paymentTracker: PaymentTrackerType[] }>
    >(
      [PaymentTrackersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            paymentTracker: prev.paymentTracker.map(
              (paymentTracker) =>
                paymentTracker.id === id
                  ? updatePaymentTrackerVal
                  : paymentTracker
            ),
          };
        }
      }
    );
  };

  const deletePaymentTrackers = (id: number, projectId: string) => {
    queryClient.setQueryData<
      PaginationType<{ paymentTracker: PaymentTrackerType[] }>
    >(
      [PaymentTrackersQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            paymentTracker: prev.paymentTracker.filter(
              (paymentTracker) => paymentTracker.id !== id
            ),
          };
        }
      }
    );
  };

  return {
    addPaymentTrackers,
    updatePaymentTrackers,
    deletePaymentTrackers,
  };
};

export const usePaymentTrackerQuerySetData = () => {
  const queryClient = useQueryClient();

  const addPaymentTracker = (
    newPaymentTrackerVal: PaymentTrackerType
  ) => {
    queryClient.setQueryData<PaymentTrackerType>(
      [PaymentTrackerKey, newPaymentTrackerVal.id],
      newPaymentTrackerVal
    );
  };

  const updatePaymentTracker = (
    id: number,
    updatePaymentTrackerVal: PaymentTrackerType
  ) => {
    queryClient.setQueryData<PaymentTrackerType>(
      [PaymentTrackerKey, id],
      (prev) => ({ ...prev, ...updatePaymentTrackerVal })
    );
  };

  const deletePaymentTracker = (id: number) => {
    queryClient.setQueryData<PaymentTrackerType>(
      [PaymentTrackerKey, id],
      undefined
    );
  };

  return {
    addPaymentTracker,
    updatePaymentTracker,
    deletePaymentTracker,
  };
};

export const useUpdatePaymentTrackerMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { updatePaymentTrackers } =
    usePaymentTrackersQuerySetData();
  const { updatePaymentTracker } =
    usePaymentTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updatePaymentTrackerVal: PaymentTrackerFormType
    ) => {
      const response = await axios.put<{ data: PaymentTrackerType }>(
        api_routes.paymentTrackers + `/${id}`,
        {
          ...updatePaymentTrackerVal,
          valuation: Number(updatePaymentTrackerVal.valuation),
          percentageTotal: Number(updatePaymentTrackerVal.percentageTotal),
          noOfStages: Number(updatePaymentTrackerVal.noOfStages),
          percentageStage: Number(updatePaymentTrackerVal.percentageStage),
          noOfStagesReferral: Number(updatePaymentTrackerVal.noOfStagesReferral),
          percentageStageReferral: Number(updatePaymentTrackerVal.percentageStageReferral),
          amountReferral: Number(updatePaymentTrackerVal.amountReferral),
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updatePaymentTrackerVal) => {
      // ✅ update detail view directly
      updatePaymentTracker(id, updatePaymentTrackerVal);
      updatePaymentTrackers(
        id,
        updatePaymentTrackerVal,
        projectId
      );
      toastSuccess("Payment Tracker updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddPaymentTrackerMutation = (projectId: string) => {
  const { axios } = useAxios();
  const { addPaymentTrackers } =
    usePaymentTrackersQuerySetData();
  const { addPaymentTracker } = usePaymentTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newPaymentTrackerVal: PaymentTrackerFormType
    ) => {
      const response = await axios.post<{ data: PaymentTrackerType }>(
        api_routes.paymentTrackers + `/create/${projectId}`,
        {
          ...newPaymentTrackerVal,
          valuation: Number(newPaymentTrackerVal.valuation),
          percentageTotal: Number(newPaymentTrackerVal.percentageTotal),
          noOfStages: Number(newPaymentTrackerVal.noOfStages),
          percentageStage: Number(newPaymentTrackerVal.percentageStage),
          noOfStagesReferral: Number(newPaymentTrackerVal.noOfStagesReferral),
          percentageStageReferral: Number(newPaymentTrackerVal.percentageStageReferral),
          amountReferral: Number(newPaymentTrackerVal.amountReferral),
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newPaymentTrackerVal) => {
      // ✅ update detail view directly
      addPaymentTracker(newPaymentTrackerVal);
      addPaymentTrackers(newPaymentTrackerVal, projectId);
      toastSuccess("Payment Tracker created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeletePaymentTrackerMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { deletePaymentTrackers } =
    usePaymentTrackersQuerySetData();
  const { deletePaymentTracker } =
    usePaymentTrackerQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: PaymentTrackerType }>(
        api_routes.paymentTrackers + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deletePaymentTracker(id);
      deletePaymentTrackers(id, projectId);
      toastSuccess("Payment Tracker deleted successfully.");
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
