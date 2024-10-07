import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  LegalHeirDetailFormType,
  LegalHeirDetailType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const LegalHeirDetailKey = "legal_heir_detail";
export const LegalHeirDetailsQueryKey = "legal_heir_details";

export const useLegalHeirDetailsQuery: (params: {
  shareHolderMasterId: number;
}) => UseQueryResult<PaginationType<{ legalHeirDetail: (LegalHeirDetailType & {consolidatedHolding:string; totalMarketValue:number})[] }>, unknown> = ({
  shareHolderMasterId,
}) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [LegalHeirDetailsQueryKey, shareHolderMasterId, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          legalHeirDetail: LegalHeirDetailType[];
        }>;
      }>(
        api_routes.legalHeirDetails +
          `/list/${shareHolderMasterId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useLegalHeirDetailQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<LegalHeirDetailType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [LegalHeirDetailKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: LegalHeirDetailType;
      }>(api_routes.legalHeirDetails + `/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useLegalHeirDetailsQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addLegalHeirDetails = (
    shareHolderMasterId: number,
    newLegalHeirDetailVal: LegalHeirDetailType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        legalHeirDetail: LegalHeirDetailType[];
      }>
    >(
      [
        LegalHeirDetailsQueryKey,
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
            legalHeirDetail: [newLegalHeirDetailVal, ...prev.legalHeirDetail],
          };
        }
      }
    );
  };

  const updateLegalHeirDetails = (
    id: number,
    shareHolderMasterId: number,
    updateLegalHeirDetailVal: LegalHeirDetailType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        legalHeirDetail: LegalHeirDetailType[];
      }>
    >(
      [LegalHeirDetailsQueryKey, shareHolderMasterId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            legalHeirDetail: prev.legalHeirDetail.map((legalHeirDetail) =>
              legalHeirDetail.id === id
                ? {
                    ...legalHeirDetail,
                    ...updateLegalHeirDetailVal,
                  }
                : legalHeirDetail
            ),
          };
        }
      }
    );
  };

  const deleteLegalHeirDetails = (id: number, shareHolderMasterId: number) => {
    queryClient.setQueryData<
      PaginationType<{
        legalHeirDetail: LegalHeirDetailType[];
      }>
    >(
      [LegalHeirDetailsQueryKey, shareHolderMasterId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            legalHeirDetail: prev.legalHeirDetail.filter((legalHeirDetail) => legalHeirDetail.id !== id),
          };
        }
      }
    );
  };

  return {
    addLegalHeirDetails,
    updateLegalHeirDetails,
    deleteLegalHeirDetails,
  };
};

export const useLegalHeirDetailQuerySetData = () => {
  const queryClient = useQueryClient();

  const addLegalHeirDetail = (newLegalHeirDetailVal: LegalHeirDetailType) => {
    queryClient.setQueryData<LegalHeirDetailType>(
      [LegalHeirDetailKey, newLegalHeirDetailVal.id],
      newLegalHeirDetailVal
    );
  };

  const updateLegalHeirDetail = (id: number, updateLegalHeirDetailVal: LegalHeirDetailType) => {
    queryClient.setQueryData<LegalHeirDetailType>([LegalHeirDetailKey, id], updateLegalHeirDetailVal);
  };

  const deleteLegalHeirDetail = (id: number) => {
    queryClient.setQueryData<LegalHeirDetailType>([LegalHeirDetailKey, id], undefined);
  };

  return {
    addLegalHeirDetail,
    updateLegalHeirDetail,
    deleteLegalHeirDetail,
  };
};

export const useUpdateLegalHeirDetailMutation = (
  id: number,
  shareHolderMasterId: number
) => {
  const { axios } = useAxios();
  const { updateLegalHeirDetails } = useLegalHeirDetailsQuerySetData();
  const { updateLegalHeirDetail } = useLegalHeirDetailQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateLegalHeirDetailVal: LegalHeirDetailFormType) => {
      const form_data = new FormData();
      for (const [key, val] of Object.entries(updateLegalHeirDetailVal)) {
        // append each item to the formData (converted to JSON strings)
        if(!(typeof val==="undefined")){
          form_data.append(key, val as string | Blob);
        }
      }
      const response = await axios.put<{
        data: LegalHeirDetailType;
      }>(api_routes.legalHeirDetails + `/${id}`, form_data);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateLegalHeirDetailVal) => {
      // ✅ update detail view directly
      updateLegalHeirDetail(id, updateLegalHeirDetailVal);
      updateLegalHeirDetails(id, shareHolderMasterId, updateLegalHeirDetailVal);
      toastSuccess("Legal Heir Detail updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddLegalHeirDetailMutation = (shareHolderMasterId: number) => {
  const { axios } = useAxios();
  const { addLegalHeirDetails } = useLegalHeirDetailsQuerySetData();
  const { addLegalHeirDetail } = useLegalHeirDetailQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newLegalHeirDetailVal: LegalHeirDetailFormType) => {
      const form_data = new FormData();
      for (const [key, val] of Object.entries(newLegalHeirDetailVal)) {
        // append each item to the formData (converted to JSON strings)
        if (!(typeof val === "undefined")) {
          form_data.append(key, val as string | Blob);
        }
      }
      const response = await axios.post<{
        data: LegalHeirDetailType;
      }>(
        api_routes.legalHeirDetails + `/create/${shareHolderMasterId}`,
        form_data
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newLegalHeirDetailVal) => {
      // ✅ update detail view directly
      addLegalHeirDetail(newLegalHeirDetailVal);
      addLegalHeirDetails(shareHolderMasterId, newLegalHeirDetailVal);
      toastSuccess("Legal Heir Detail created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteLegalHeirDetailMutation = (
  id: number,
  shareHolderMasterId: number
) => {
  const { axios } = useAxios();
  const { deleteLegalHeirDetails } = useLegalHeirDetailsQuerySetData();
  const { deleteLegalHeirDetail } = useLegalHeirDetailQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{
        data: LegalHeirDetailType;
      }>(api_routes.legalHeirDetails + `/${id}`);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteLegalHeirDetail(id);
      deleteLegalHeirDetails(id, shareHolderMasterId);
      toastSuccess("Legal Heir Detail deleted successfully.");
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
