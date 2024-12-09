import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  CaseType,
  CaseFormType,
  ShareHolderDetailType,
  FolioType,
  LegalHeirDetailType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const CaseKey = "case";
export const CaseInfoKey = "case_info";
export const CasesQueryKey = "cases";

export const useCasesQuery: (
  shareCertificateId: number,
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{
    shareHolderMaster: (CaseType & {
      order: ShareHolderDetailType[];
      clamaints: LegalHeirDetailType[];
      foliosSet: FolioType[];
      affidavits: (ShareHolderDetailType)[];
    })[];
  }>,
  unknown
> = (shareCertificateId, enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [CasesQueryKey, page, limit, search, shareCertificateId],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          shareHolderMaster: (CaseType & {
            order: ShareHolderDetailType[];
            clamaints: LegalHeirDetailType[];
            foliosSet: FolioType[];
            affidavitShareholders: ShareHolderDetailType[];
            affidavitLegalHeirs: ShareHolderDetailType[];
          })[];
        }>;
      }>(
        api_routes.cases +
          `/list/${shareCertificateId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useCaseQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<CaseType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [CaseKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: CaseType }>(
        api_routes.cases + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useCaseInfoQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<
  CaseType & {
    order: ShareHolderDetailType[];
    clamaints: LegalHeirDetailType[];
    foliosSet: FolioType[];
    affidavitShareholders: ShareHolderDetailType[];
    affidavitLegalHeirs: ShareHolderDetailType[];
  },
  unknown
> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [CaseInfoKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: CaseType & {
          order: ShareHolderDetailType[];
          clamaints: LegalHeirDetailType[];
          foliosSet: FolioType[];
        };
      }>(api_routes.cases + `/info/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useCasesQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addCases = (
    newCaseVal: CaseType,
    shareCertificateId: number
  ) => {
    queryClient.setQueryData<
      PaginationType<{ shareHolderMaster: CaseType[] }>
    >(
      [
        CasesQueryKey,
        QueryInitialPageParam.toString(),
        limit,
        search,
        shareCertificateId,
      ],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            last_page: prev.last_page + 1,
            total: prev.total + 1,
            current_page: prev.current_page + 1,
            shareHolderMaster: [
              newCaseVal,
              ...prev.shareHolderMaster,
            ],
          };
        }
      }
    );
  };

  const updateCases = (
    id: number,
    updateCaseVal: CaseType,
    shareCertificateId: number
  ) => {
    queryClient.setQueryData<
      PaginationType<{ shareHolderMaster: CaseType[] }>
    >(
      [CasesQueryKey, page, limit, search, shareCertificateId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            shareHolderMaster: prev.shareHolderMaster.map(
              (shareHolderMaster) =>
                shareHolderMaster.id === id
                  ? updateCaseVal
                  : shareHolderMaster
            ),
          };
        }
      }
    );
  };

  const deleteCases = (id: number, shareCertificateId: number) => {
    queryClient.setQueryData<
      PaginationType<{ shareHolderMaster: CaseType[] }>
    >(
      [CasesQueryKey, page, limit, search, shareCertificateId],
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
    addCases,
    updateCases,
    deleteCases,
  };
};

export const useCaseQuerySetData = () => {
  const queryClient = useQueryClient();

  const addCase = (
    newCaseVal: CaseType
  ) => {
    queryClient.setQueryData<CaseType>(
      [CaseKey, newCaseVal.id],
      newCaseVal
    );
    queryClient.setQueryData<CaseType>(
      [CaseInfoKey, newCaseVal.id],
      newCaseVal
    );
  };

  const updateCase = (
    id: number,
    updateCaseVal: CaseType
  ) => {
    queryClient.setQueryData<CaseType>(
      [CaseKey, id],
      (prev) => ({ ...prev, ...updateCaseVal })
    );
    queryClient.setQueryData<CaseType>(
      [CaseInfoKey, id],
      (prev) => ({ ...prev, ...updateCaseVal })
    );
  };

  const deleteCase = (id: number) => {
    queryClient.setQueryData<CaseType>(
      [CaseKey, id],
      undefined
    );
    queryClient.setQueryData<CaseType>(
      [CaseInfoKey, id],
      undefined
    );
  };

  return {
    addCase,
    updateCase,
    deleteCase,
  };
};

export const useUpdateCaseMutation = (
  id: number,
  shareCertificateId: number
) => {
  const { axios } = useAxios();
  const { updateCases } =
    useCasesQuerySetData();
  const { updateCase } =
    useCaseQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateCaseVal: CaseFormType
    ) => {
      const form_data = new FormData();
      for (const [key, val] of Object.entries(updateCaseVal)) {
        // append each item to the formData (converted to JSON strings)
        if (!(typeof val === "undefined")) {
          form_data.append(key, val as string | Blob);
        }
      }
      const response = await axios.put<{ data: CaseType }>(
        api_routes.cases + `/${id}`,
        form_data
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateCaseVal) => {
      // ✅ update detail view directly
      updateCase(id, updateCaseVal);
      updateCases(
        id,
        updateCaseVal,
        shareCertificateId
      );
      toastSuccess("Case updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddCaseMutation = (shareCertificateId: number) => {
  const { axios } = useAxios();
  const { addCases } =
    useCasesQuerySetData();
  const { addCase } = useCaseQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newCaseVal: CaseFormType
    ) => {
      const form_data = new FormData();
      for (const [key, val] of Object.entries(newCaseVal)) {
        // append each item to the formData (converted to JSON strings)
        if (!(typeof val === "undefined")) {
          form_data.append(key, val as string | Blob);
        }
      }
      const response = await axios.post<{ data: CaseType }>(
        api_routes.cases + `/create/${shareCertificateId}`,
        form_data
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newCaseVal) => {
      // ✅ update detail view directly
      addCase(newCaseVal);
      addCases(newCaseVal, shareCertificateId);
      toastSuccess("Case created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteCaseMutation = (
  id: number,
  shareCertificateId: number
) => {
  const { axios } = useAxios();
  const { deleteCases } =
    useCasesQuerySetData();
  const { deleteCase } =
    useCaseQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: CaseType }>(
        api_routes.cases + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteCase(id);
      deleteCases(id, shareCertificateId);
      toastSuccess("Case deleted successfully.");
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
