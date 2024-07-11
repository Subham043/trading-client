import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  CorporateMasterFormType,
  CorporateMasterType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const CorporateMasterKey = "corporate_master";
export const CorporateMastersQueryKey = "corporate_masters";
export const CorporateMastersSelectQueryKey = "corporate_masters_select";

export const useCorporateMastersQuery: (params: {
  companyId: number;
}) => UseQueryResult<
  PaginationType<{ corporateMaster: CorporateMasterType[] }>,
  unknown
> = ({ companyId }) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [CorporateMastersQueryKey, companyId, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          corporateMaster: CorporateMasterType[];
        }>;
      }>(api_routes.corporateMasters + `/list/${companyId}?search=${search}`);
      return response.data.data;
    },
  });
};

export const useCorporateMastersSelectQuery: (params: {
  search?: string;
  enabled?: boolean;
}) => UseQueryResult<
  PaginationType<{ corporateMaster: CorporateMasterType[] }>,
  unknown
> = ({ search = "", enabled = true }) => {
  const { axios } = useAxios();

  return useQuery({
    queryKey: [CorporateMastersSelectQueryKey, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          corporateMaster: CorporateMasterType[];
        }>;
      }>(
        api_routes.corporateMasters +
          `/list-all?page=1&limit=20&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useCorporateMasterQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<CorporateMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [CorporateMasterKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: CorporateMasterType;
      }>(api_routes.corporateMasters + `/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useCorporateMastersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const addCorporateMasters = (
    companyId: number,
    newCorporateMasterVal: CorporateMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        corporateMaster: CorporateMasterType[];
      }>
    >([CorporateMastersQueryKey, companyId, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          last_page: prev.last_page + 1,
          total: prev.total + 1,
          current_page: prev.current_page + 1,
          corporateMaster: [...prev.corporateMaster, newCorporateMasterVal],
        };
      }
    });
  };

  const updateCorporateMasters = (
    id: number,
    companyId: number,
    updateCorporateMasterVal: CorporateMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        corporateMaster: CorporateMasterType[];
      }>
    >([CorporateMastersQueryKey, companyId, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          corporateMaster: prev.corporateMaster.map((corporateMaster) =>
            corporateMaster.id === id
              ? {
                  ...corporateMaster,
                  ...updateCorporateMasterVal,
                }
              : corporateMaster
          ),
        };
      }
    });
  };

  const deleteCorporateMasters = (id: number, companyId: number) => {
    queryClient.setQueryData<
      PaginationType<{
        corporateMaster: CorporateMasterType[];
      }>
    >([CorporateMastersQueryKey, companyId, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          corporateMaster: prev.corporateMaster.filter(
            (corporateMaster) => corporateMaster.id !== id
          ),
        };
      }
    });
  };

  return {
    addCorporateMasters,
    updateCorporateMasters,
    deleteCorporateMasters,
  };
};

export const useCorporateMasterQuerySetData = () => {
  const queryClient = useQueryClient();

  const addCorporateMaster = (newCorporateMasterVal: CorporateMasterType) => {
    queryClient.setQueryData<CorporateMasterType>(
      [CorporateMasterKey, newCorporateMasterVal.id],
      newCorporateMasterVal
    );
  };

  const updateCorporateMaster = (
    id: number,
    updateCorporateMasterVal: CorporateMasterType
  ) => {
    queryClient.setQueryData<CorporateMasterType>(
      [CorporateMasterKey, id],
      updateCorporateMasterVal
    );
  };

  const deleteCorporateMaster = (id: number) => {
    queryClient.setQueryData<CorporateMasterType>(
      [CorporateMasterKey, id],
      undefined
    );
  };

  return {
    addCorporateMaster,
    updateCorporateMaster,
    deleteCorporateMaster,
  };
};

export const useUpdateCorporateMasterMutation = (
  id: number,
  companyId: number
) => {
  const { axios } = useAxios();
  const { updateCorporateMasters } = useCorporateMastersQuerySetData();
  const { updateCorporateMaster } = useCorporateMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateCorporateMasterVal: CorporateMasterFormType) => {
      const response = await axios.put<{
        data: CorporateMasterType;
      }>(api_routes.corporateMasters + `/${id}`, updateCorporateMasterVal);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateCorporateMasterVal) => {
      // ✅ update detail view directly
      updateCorporateMaster(id, updateCorporateMasterVal);
      updateCorporateMasters(id, companyId, updateCorporateMasterVal);
      toastSuccess("Corporate Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddCorporateMasterMutation = (companyId: number) => {
  const { axios } = useAxios();
  const { addCorporateMasters } = useCorporateMastersQuerySetData();
  const { addCorporateMaster } = useCorporateMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newCorporateMasterVal: CorporateMasterFormType) => {
      const response = await axios.post<{
        data: CorporateMasterType;
      }>(
        api_routes.corporateMasters + `/create/${companyId}`,
        newCorporateMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newCorporateMasterVal) => {
      // ✅ update detail view directly
      addCorporateMaster(newCorporateMasterVal);
      addCorporateMasters(companyId, newCorporateMasterVal);
      toastSuccess("Corporate Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteCorporateMasterMutation = (
  id: number,
  companyId: number
) => {
  const { axios } = useAxios();
  const { deleteCorporateMasters } = useCorporateMastersQuerySetData();
  const { deleteCorporateMaster } = useCorporateMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{
        data: CorporateMasterType;
      }>(api_routes.corporateMasters + `/${id}`);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteCorporateMaster(id);
      deleteCorporateMasters(id, companyId);
      toastSuccess("Corporate Master deleted successfully.");
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
