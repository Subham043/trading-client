import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  CompanyMasterType,
  CompanyMasterFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const CompanyMasterKey = "company_master";
export const CompanyMastersQueryKey = "company_masters";

export const useCompanyMastersQuery: () => UseQueryResult<
  PaginationType<{ companyMaster: CompanyMasterType[] }>,
  unknown
> = () => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [CompanyMastersQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ companyMaster: CompanyMasterType[] }>;
      }>(
        api_routes.companyMasters +
          `?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useCompanyMasterQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<CompanyMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [CompanyMasterKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: CompanyMasterType }>(
        api_routes.companyMasters + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useCompanyMastersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addCompanyMasters = (newCompanyMasterVal: CompanyMasterType) => {
    queryClient.setQueryData<
      PaginationType<{ companyMaster: CompanyMasterType[] }>
    >(
      [CompanyMastersQueryKey, QueryInitialPageParam.toString(), limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            last_page: prev.last_page + 1,
            total: prev.total + 1,
            current_page: prev.current_page + 1,
            companyMaster: [newCompanyMasterVal, ...prev.companyMaster],
          };
        }
      }
    );
  };

  const updateCompanyMasters = (
    id: number,
    updateCompanyMasterVal: CompanyMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ companyMaster: CompanyMasterType[] }>
    >([CompanyMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          companyMaster: prev.companyMaster.map((companyMaster) =>
            companyMaster.id === id ? updateCompanyMasterVal : companyMaster
          ),
        };
      }
    });
  };

  const deleteCompanyMasters = (id: number) => {
    queryClient.setQueryData<
      PaginationType<{ companyMaster: CompanyMasterType[] }>
    >([CompanyMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          companyMaster: prev.companyMaster.filter(
            (companyMaster) => companyMaster.id !== id
          ),
        };
      }
    });
  };

  return {
    addCompanyMasters,
    updateCompanyMasters,
    deleteCompanyMasters,
  };
};

export const useCompanyMasterQuerySetData = () => {
  const queryClient = useQueryClient();

  const addCompanyMaster = (newCompanyMasterVal: CompanyMasterType) => {
    queryClient.setQueryData<CompanyMasterType>(
      [CompanyMasterKey, newCompanyMasterVal.id],
      newCompanyMasterVal
    );
  };

  const updateCompanyMaster = (
    id: number,
    updateCompanyMasterVal: CompanyMasterType
  ) => {
    queryClient.setQueryData<CompanyMasterType>(
      [CompanyMasterKey, id],
      (prev) => ({ ...prev, ...updateCompanyMasterVal })
    );
  };

  const deleteCompanyMaster = (id: number) => {
    queryClient.setQueryData<CompanyMasterType>(
      [CompanyMasterKey, id],
      undefined
    );
  };

  return {
    addCompanyMaster,
    updateCompanyMaster,
    deleteCompanyMaster,
  };
};

export const useUpdateCompanyMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { updateCompanyMasters } = useCompanyMastersQuerySetData();
  const { updateCompanyMaster } = useCompanyMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateCompanyMasterVal: CompanyMasterFormType) => {
      const response = await axios.put<{ data: CompanyMasterType }>(
        api_routes.companyMasters + `/${id}`,
        updateCompanyMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateCompanyMasterVal) => {
      // ✅ update detail view directly
      updateCompanyMaster(id, updateCompanyMasterVal);
      updateCompanyMasters(id, updateCompanyMasterVal);
      toastSuccess("Company Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddCompanyMasterMutation = () => {
  const { axios } = useAxios();
  const { addCompanyMasters } = useCompanyMastersQuerySetData();
  const { addCompanyMaster } = useCompanyMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newCompanyMasterVal: CompanyMasterFormType) => {
      const response = await axios.post<{ data: CompanyMasterType }>(
        api_routes.companyMasters,
        newCompanyMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newCompanyMasterVal) => {
      // ✅ update detail view directly
      addCompanyMaster(newCompanyMasterVal);
      addCompanyMasters(newCompanyMasterVal);
      toastSuccess("Company Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteCompanyMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { deleteCompanyMasters } = useCompanyMastersQuerySetData();
  const { deleteCompanyMaster } = useCompanyMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: CompanyMasterType }>(
        api_routes.companyMasters + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteCompanyMaster(id);
      deleteCompanyMasters(id);
      toastSuccess("Company Master deleted successfully.");
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
