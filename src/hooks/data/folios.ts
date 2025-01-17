import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  FolioFormType,
  FolioType,
  FolioCorporateMasterType,
  FolioDividendMasterType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const FolioKey = "folio";
export const FoliosQueryKey = "folios";
export const FoliosSelectQueryKey = "folios_select";
export const FoliosCorporateMasterQueryKey = "folios_corporate_master";
export const FoliosDividendMasterQueryKey = "folios_dividend_master";

export const useFoliosQuery: (params: {
  shareCertificateMasterId: number;
}) => UseQueryResult<PaginationType<{ folio: (FolioType & {consolidatedHolding:string; totalMarketValue:number})[] }>, unknown> = ({
  shareCertificateMasterId,
}) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [FoliosQueryKey, shareCertificateMasterId, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          folio: FolioType[];
        }>;
      }>(
        api_routes.folios +
          `/list/${shareCertificateMasterId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useFoliosSelectQuery: (params: {
  search?: string;
  enabled?: boolean;
}) => UseQueryResult<PaginationType<{ folio: FolioType[] }>, unknown> = ({
  search = "",
  enabled = true,
}) => {
  const { axios } = useAxios();

  return useQuery({
    queryKey: [FoliosSelectQueryKey, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          folio: FolioType[];
        }>;
      }>(api_routes.folios + `/list-all?page=1&limit=20&search=${search}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useFolioQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<FolioType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [FolioKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: FolioType;
      }>(api_routes.folios + `/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useFoliosCorporateMasterQuery: (params: {
  id: number;
  enabled?: boolean;
}) => UseQueryResult<FolioCorporateMasterType[], unknown> = ({
  id,
  enabled = true,
}) => {
  const { axios } = useAxios();

  return useQuery({
    queryKey: [FoliosCorporateMasterQueryKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          folio: FolioCorporateMasterType[];
        }>;
      }>(api_routes.folios + `/list-corporate-master/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useFoliosDividendMasterQuery: (params: {
  id: number;
  enabled?: boolean;
}) => UseQueryResult<FolioDividendMasterType[], unknown> = ({
  id,
  enabled = true,
}) => {
  const { axios } = useAxios();

  return useQuery({
    queryKey: [FoliosDividendMasterQueryKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          folio: FolioDividendMasterType[];
        }>;
      }>(api_routes.folios + `/list-dividend-master/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useFoliosQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addFolios = (
    shareCertificateMasterId: number,
    newFolioVal: FolioType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        folio: FolioType[];
      }>
    >(
      [
        FoliosQueryKey,
        shareCertificateMasterId,
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
            folio: [newFolioVal, ...prev.folio],
          };
        }
      }
    );
  };

  const updateFolios = (
    id: number,
    shareCertificateMasterId: number,
    updateFolioVal: FolioType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        folio: FolioType[];
      }>
    >(
      [FoliosQueryKey, shareCertificateMasterId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            folio: prev.folio.map((folio) =>
              folio.id === id
                ? {
                    ...folio,
                    ...updateFolioVal,
                  }
                : folio
            ),
          };
        }
      }
    );
  };

  const deleteFolios = (id: number, shareCertificateMasterId: number) => {
    queryClient.setQueryData<
      PaginationType<{
        folio: FolioType[];
      }>
    >(
      [FoliosQueryKey, shareCertificateMasterId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            folio: prev.folio.filter((folio) => folio.id !== id),
          };
        }
      }
    );
  };

  return {
    addFolios,
    updateFolios,
    deleteFolios,
  };
};

export const useFolioQuerySetData = () => {
  const queryClient = useQueryClient();

  const addFolio = (newFolioVal: FolioType) => {
    queryClient.setQueryData<FolioType>(
      [FolioKey, newFolioVal.id],
      newFolioVal
    );
  };

  const updateFolio = (id: number, updateFolioVal: FolioType) => {
    queryClient.setQueryData<FolioType>([FolioKey, id], updateFolioVal);
  };

  const deleteFolio = (id: number) => {
    queryClient.setQueryData<FolioType>([FolioKey, id], undefined);
  };

  return {
    addFolio,
    updateFolio,
    deleteFolio,
  };
};

export const useUpdateFolioMutation = (
  id: number,
  shareCertificateMasterId: number
) => {
  const { axios } = useAxios();
  const { updateFolios } = useFoliosQuerySetData();
  const { updateFolio } = useFolioQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateFolioVal: FolioFormType) => {
      const response = await axios.put<{
        data: FolioType;
      }>(api_routes.folios + `/${id}`, {
        ...updateFolioVal,
      });
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateFolioVal) => {
      // ✅ update detail view directly
      updateFolio(id, updateFolioVal);
      updateFolios(id, shareCertificateMasterId, updateFolioVal);
      toastSuccess("Folios updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddFolioMutation = (shareCertificateMasterId: number) => {
  const { axios } = useAxios();
  const { addFolios } = useFoliosQuerySetData();
  const { addFolio } = useFolioQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newFolioVal: FolioFormType) => {
      const {...rest} = newFolioVal;
      const response = await axios.post<{
        data: FolioType;
      }>(api_routes.folios + `/create/${shareCertificateMasterId}`, {
        ...rest,
      });
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newFolioVal) => {
      // ✅ update detail view directly
      addFolio(newFolioVal);
      addFolios(shareCertificateMasterId, newFolioVal);
      toastSuccess("Folios created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteFolioMutation = (
  id: number,
  shareCertificateMasterId: number
) => {
  const { axios } = useAxios();
  const { deleteFolios } = useFoliosQuerySetData();
  const { deleteFolio } = useFolioQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{
        data: FolioType;
      }>(api_routes.folios + `/${id}`);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteFolio(id);
      deleteFolios(id, shareCertificateMasterId);
      toastSuccess("Folios deleted successfully.");
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
