import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  RegistrarMasterType,
  RegistrarMasterFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const RegistrarMasterKey = "registrar_master";
export const RegistrarMastersQueryKey = "registrar_masters";
export const CompanyMastersSelectKey = "company_master_select";

export const useRegistrarMastersQuery: () => UseQueryResult<
  PaginationType<{ registrarMaster: RegistrarMasterType[] }>,
  unknown
> = () => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [RegistrarMastersQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ registrarMaster: RegistrarMasterType[] }>;
      }>(
        api_routes.registrarMasters +
          `?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useRegistrarMasterQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<RegistrarMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [RegistrarMasterKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: RegistrarMasterType }>(
        api_routes.registrarMasters + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useRegistrarMastersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addRegistrarMasters = (newRegistrarMasterVal: RegistrarMasterType) => {
    queryClient.setQueryData<
      PaginationType<{ registrarMaster: RegistrarMasterType[] }>
    >(
      [
        RegistrarMastersQueryKey,
        QueryInitialPageParam.toString(),
        limit,
        search,
      ],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            registrarMaster: [newRegistrarMasterVal, ...prev.registrarMaster],
          };
        }
      }
    );
  };

  const updateRegistrarMasters = (
    id: number,
    updateRegistrarMasterVal: RegistrarMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ registrarMaster: RegistrarMasterType[] }>
    >([RegistrarMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          registrarMaster: prev.registrarMaster.map((registrarMaster) =>
            registrarMaster.id === id
              ? updateRegistrarMasterVal
              : registrarMaster
          ),
        };
      }
    });
  };

  const deleteRegistrarMasters = (id: number) => {
    queryClient.setQueryData<
      PaginationType<{ registrarMaster: RegistrarMasterType[] }>
    >([RegistrarMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          registrarMaster: prev.registrarMaster.filter(
            (registrarMaster) => registrarMaster.id !== id
          ),
        };
      }
    });
  };

  return {
    addRegistrarMasters,
    updateRegistrarMasters,
    deleteRegistrarMasters,
  };
};

export const useRegistrarMasterQuerySetData = () => {
  const queryClient = useQueryClient();

  const addRegistrarMaster = (newRegistrarMasterVal: RegistrarMasterType) => {
    queryClient.setQueryData<RegistrarMasterType>(
      [RegistrarMasterKey, newRegistrarMasterVal.id],
      newRegistrarMasterVal
    );
  };

  const updateRegistrarMaster = (
    id: number,
    updateRegistrarMasterVal: RegistrarMasterType
  ) => {
    queryClient.setQueryData<RegistrarMasterType>(
      [RegistrarMasterKey, id],
      (prev) => ({ ...prev, ...updateRegistrarMasterVal })
    );
  };

  const deleteRegistrarMaster = (id: number) => {
    queryClient.setQueryData<RegistrarMasterType>(
      [RegistrarMasterKey, id],
      undefined
    );
  };

  return {
    addRegistrarMaster,
    updateRegistrarMaster,
    deleteRegistrarMaster,
  };
};

export const useUpdateRegistrarMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { updateRegistrarMasters } = useRegistrarMastersQuerySetData();
  const { updateRegistrarMaster } = useRegistrarMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateRegistrarMasterVal: RegistrarMasterFormType) => {
      const response = await axios.put<{ data: RegistrarMasterType }>(
        api_routes.registrarMasters + `/${id}`,
        updateRegistrarMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateRegistrarMasterVal) => {
      // ✅ update detail view directly
      updateRegistrarMaster(id, updateRegistrarMasterVal);
      updateRegistrarMasters(id, updateRegistrarMasterVal);
      toastSuccess("Registrar Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddRegistrarMasterMutation = () => {
  const { axios } = useAxios();
  const { addRegistrarMasters } = useRegistrarMastersQuerySetData();
  const { addRegistrarMaster } = useRegistrarMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newRegistrarMasterVal: RegistrarMasterFormType) => {
      const response = await axios.post<{ data: RegistrarMasterType }>(
        api_routes.registrarMasters,
        newRegistrarMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newRegistrarMasterVal) => {
      // ✅ update detail view directly
      addRegistrarMaster(newRegistrarMasterVal);
      addRegistrarMasters(newRegistrarMasterVal);
      toastSuccess("Registrar Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteRegistrarMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { deleteRegistrarMasters } = useRegistrarMastersQuerySetData();
  const { deleteRegistrarMaster } = useRegistrarMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: RegistrarMasterType }>(
        api_routes.registrarMasters + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteRegistrarMaster(id);
      deleteRegistrarMasters(id);
      toastSuccess("Registrar Master deleted successfully.");
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

export const useCompanyMastersSelectQuery: ({
  companyId,
  enabled,
}: {
  companyId?: number;
  enabled?: boolean;
}) => UseQueryResult<
  PaginationType<
    {
      newName: string | null;
      currentName: string | null;
      companyID: number | null;
    }[]
  >,
  unknown
> = ({ companyId, enabled = false }) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [CompanyMastersSelectKey, companyId],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          data: {
            newName: string | null;
            currentName: string | null;
            companyID: number | null;
          }[];
        }>;
      }>(
        api_routes.registrarMasters +
          `/company-select${companyId ? `?companyId=${companyId}` : ""}`
      );
      return response.data.data;
    },
    enabled,
  });
};
