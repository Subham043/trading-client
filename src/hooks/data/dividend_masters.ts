import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  DividendMasterFormType,
  DividendMasterType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const DividendMasterKey = "dividend_master";
export const DividendMastersQueryKey = "dividend_masters";
export const DividendMastersSelectQueryKey = "dividend_masters_select";

export const useDividendMastersQuery: (params: {
  companyId: number;
}) => UseQueryResult<
  PaginationType<{ dividendMaster: DividendMasterType[] }>,
  unknown
> = ({ companyId }) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [DividendMastersQueryKey, companyId, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          dividendMaster: DividendMasterType[];
        }>;
      }>(api_routes.dividendMasters + `/list/${companyId}?search=${search}`);
      return response.data.data;
    },
  });
};

export const useDividendMastersSelectQuery: (params: {
  search?: string;
  enabled?: boolean;
}) => UseQueryResult<
  PaginationType<{ dividendMaster: DividendMasterType[] }>,
  unknown
> = ({ search = "", enabled = true }) => {
  const { axios } = useAxios();

  return useQuery({
    queryKey: [DividendMastersSelectQueryKey, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          dividendMaster: DividendMasterType[];
        }>;
      }>(
        api_routes.dividendMasters +
          `/list-all?page=1&limit=20&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useDividendMasterQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<DividendMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [DividendMasterKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: DividendMasterType;
      }>(api_routes.dividendMasters + `/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useDividendMastersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const addDividendMasters = (
    companyId: number,
    newDividendMasterVal: DividendMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        dividendMaster: DividendMasterType[];
      }>
    >([DividendMastersQueryKey, companyId, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          last_page: prev.last_page + 1,
          total: prev.total + 1,
          current_page: prev.current_page + 1,
          dividendMaster: [...prev.dividendMaster, newDividendMasterVal],
        };
      }
    });
  };

  const updateDividendMasters = (
    id: number,
    companyId: number,
    updateDividendMasterVal: DividendMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        dividendMaster: DividendMasterType[];
      }>
    >([DividendMastersQueryKey, companyId, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          dividendMaster: prev.dividendMaster.map((dividendMaster) =>
            dividendMaster.id === id
              ? {
                  ...dividendMaster,
                  ...updateDividendMasterVal,
                }
              : dividendMaster
          ),
        };
      }
    });
  };

  const deleteDividendMasters = (id: number, companyId: number) => {
    queryClient.setQueryData<
      PaginationType<{
        dividendMaster: DividendMasterType[];
      }>
    >([DividendMastersQueryKey, companyId, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          dividendMaster: prev.dividendMaster.filter(
            (dividendMaster) => dividendMaster.id !== id
          ),
        };
      }
    });
  };

  return {
    addDividendMasters,
    updateDividendMasters,
    deleteDividendMasters,
  };
};

export const useDividendMasterQuerySetData = () => {
  const queryClient = useQueryClient();

  const addDividendMaster = (newDividendMasterVal: DividendMasterType) => {
    queryClient.setQueryData<DividendMasterType>(
      [DividendMasterKey, newDividendMasterVal.id],
      newDividendMasterVal
    );
  };

  const updateDividendMaster = (
    id: number,
    updateDividendMasterVal: DividendMasterType
  ) => {
    queryClient.setQueryData<DividendMasterType>(
      [DividendMasterKey, id],
      updateDividendMasterVal
    );
  };

  const deleteDividendMaster = (id: number) => {
    queryClient.setQueryData<DividendMasterType>(
      [DividendMasterKey, id],
      undefined
    );
  };

  return {
    addDividendMaster,
    updateDividendMaster,
    deleteDividendMaster,
  };
};

export const useUpdateDividendMasterMutation = (
  id: number,
  companyId: number
) => {
  const { axios } = useAxios();
  const { updateDividendMasters } = useDividendMastersQuerySetData();
  const { updateDividendMaster } = useDividendMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateDividendMasterVal: DividendMasterFormType) => {
      const response = await axios.put<{
        data: DividendMasterType;
      }>(api_routes.dividendMasters + `/${id}`, updateDividendMasterVal);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateDividendMasterVal) => {
      // ✅ update detail view directly
      updateDividendMaster(id, updateDividendMasterVal);
      updateDividendMasters(id, companyId, updateDividendMasterVal);
      toastSuccess("Dividend Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddDividendMasterMutation = (companyId: number) => {
  const { axios } = useAxios();
  const { addDividendMasters } = useDividendMastersQuerySetData();
  const { addDividendMaster } = useDividendMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newDividendMasterVal: DividendMasterFormType) => {
      const response = await axios.post<{
        data: DividendMasterType;
      }>(
        api_routes.dividendMasters + `/create/${companyId}`,
        newDividendMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newDividendMasterVal) => {
      // ✅ update detail view directly
      addDividendMaster(newDividendMasterVal);
      addDividendMasters(companyId, newDividendMasterVal);
      toastSuccess("Dividend Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteDividendMasterMutation = (
  id: number,
  companyId: number
) => {
  const { axios } = useAxios();
  const { deleteDividendMasters } = useDividendMastersQuerySetData();
  const { deleteDividendMaster } = useDividendMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{
        data: DividendMasterType;
      }>(api_routes.dividendMasters + `/${id}`);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteDividendMaster(id);
      deleteDividendMasters(id, companyId);
      toastSuccess("Dividend Master deleted successfully.");
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
