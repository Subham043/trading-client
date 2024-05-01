import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  NameChangeMasterType,
  NameChangeMasterFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const NameChangeMasterKey = "name_change_master";
export const NameChangeMastersQueryKey = "name_change_masters";
export const NameChangeMastersCompanyQueryKey = "name_change_company_masters";

export const useNameChangeMastersMainQuery: () => UseQueryResult<
  PaginationType<{
    nameChangeMaster: (NameChangeMasterType & {
      CIN?: string | null | undefined;
      ISIN?: string | null | undefined;
      faceValue?: number | null | undefined;
    })[];
  }>,
  unknown
> = () => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [NameChangeMastersCompanyQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>;
      }>(
        api_routes.nameChangeMasters +
          `/company?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useNameChangeMastersQuery: (params: {
  companyId: number;
}) => UseQueryResult<
  PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>,
  unknown
> = ({ companyId }) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [NameChangeMastersQueryKey, companyId, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>;
      }>(
        api_routes.nameChangeMasters +
          `/list/${companyId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useNameChangeMasterQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<NameChangeMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [NameChangeMasterKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: NameChangeMasterType }>(
        api_routes.nameChangeMasters + `/view/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useNameChangeMasterLatestQuery: (
  companyId: number,
  enabled: boolean
) => UseQueryResult<NameChangeMasterType, unknown> = (companyId, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [NameChangeMasterKey, companyId],
    queryFn: async () => {
      const response = await axios.get<{ data: NameChangeMasterType }>(
        api_routes.nameChangeMasters + `/company/${companyId}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useNameChangeMastersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addNameChangeMasters = (
    companyId: number,
    newNameChangeMasterVal: NameChangeMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>
    >(
      [
        NameChangeMastersQueryKey,
        companyId,
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
            nameChangeMaster: [
              newNameChangeMasterVal,
              ...prev.nameChangeMaster,
            ],
          };
        }
      }
    );
  };

  const updateNameChangeMasters = (
    id: number,
    companyId: number,
    updateNameChangeMasterVal: NameChangeMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>
    >([NameChangeMastersQueryKey, companyId, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          nameChangeMaster: prev.nameChangeMaster.map((nameChangeMaster) =>
            nameChangeMaster.id === id
              ? { ...nameChangeMaster, ...updateNameChangeMasterVal }
              : nameChangeMaster
          ),
        };
      }
    });
  };

  const deleteNameChangeMasters = (id: number, companyId: number) => {
    queryClient.setQueryData<
      PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>
    >([NameChangeMastersQueryKey, companyId, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          nameChangeMaster: prev.nameChangeMaster.filter(
            (nameChangeMaster) => nameChangeMaster.id !== id
          ),
        };
      }
    });
  };

  return {
    addNameChangeMasters,
    updateNameChangeMasters,
    deleteNameChangeMasters,
  };
};

export const useNameChangeMasterQuerySetData = () => {
  const queryClient = useQueryClient();

  const addNameChangeMaster = (
    newNameChangeMasterVal: NameChangeMasterType
  ) => {
    queryClient.setQueryData<NameChangeMasterType>(
      [NameChangeMasterKey, newNameChangeMasterVal.id],
      newNameChangeMasterVal
    );
  };

  const updateNameChangeMaster = (
    id: number,
    updateNameChangeMasterVal: NameChangeMasterType
  ) => {
    queryClient.setQueryData<NameChangeMasterType>(
      [NameChangeMasterKey, id],
      updateNameChangeMasterVal
    );
  };

  const deleteNameChangeMaster = (id: number) => {
    queryClient.setQueryData<NameChangeMasterType>(
      [NameChangeMasterKey, id],
      undefined
    );
  };

  return {
    addNameChangeMaster,
    updateNameChangeMaster,
    deleteNameChangeMaster,
  };
};

export const useUpdateNameChangeMasterMutation = (
  id: number,
  companyId: number
) => {
  const { axios } = useAxios();
  const { updateNameChangeMasters } = useNameChangeMastersQuerySetData();
  const { updateNameChangeMaster } = useNameChangeMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateNameChangeMasterVal: NameChangeMasterFormType) => {
      const response = await axios.put<{ data: NameChangeMasterType }>(
        api_routes.nameChangeMasters + `/update/${id}/${companyId}`,
        updateNameChangeMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateNameChangeMasterVal) => {
      // ✅ update detail view directly
      updateNameChangeMaster(id, updateNameChangeMasterVal);
      updateNameChangeMasters(id, companyId, updateNameChangeMasterVal);
      toastSuccess("Name Change Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddNameChangeMasterMutation = (companyId: number) => {
  const { axios } = useAxios();
  const { addNameChangeMasters } = useNameChangeMastersQuerySetData();
  const { addNameChangeMaster } = useNameChangeMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newNameChangeMasterVal: NameChangeMasterFormType) => {
      const response = await axios.post<{ data: NameChangeMasterType }>(
        api_routes.nameChangeMasters + `/create/${companyId}`,
        newNameChangeMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newNameChangeMasterVal) => {
      // ✅ update detail view directly
      addNameChangeMaster(newNameChangeMasterVal);
      addNameChangeMasters(companyId, newNameChangeMasterVal);
      toastSuccess("Name Change Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteNameChangeMasterMutation = (
  id: number,
  companyId: number
) => {
  const { axios } = useAxios();
  const { deleteNameChangeMasters } = useNameChangeMastersQuerySetData();
  const { deleteNameChangeMaster } = useNameChangeMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: NameChangeMasterType }>(
        api_routes.nameChangeMasters + `/delete/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteNameChangeMaster(id);
      deleteNameChangeMasters(id, companyId);
      toastSuccess("Name Change Master deleted successfully.");
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
