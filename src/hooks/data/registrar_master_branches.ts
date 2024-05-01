import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  RegistrarMasterBranchType,
  RegistrarMasterBranchFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const RegistrarMasterBranchKey = "registrar_master_branch";
export const RegistrarMasterBranchesQueryKey = "registrar_master_branches";
export const RegistrarMasterBranchesSelectQueryKey =
  "registrar_master_branches_select";

export const useRegistrarMasterBranchesQuery: (params: {
  registrarMasterId: number;
}) => UseQueryResult<
  PaginationType<{ registrarMasterBranch: RegistrarMasterBranchType[] }>,
  unknown
> = ({ registrarMasterId }) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [
      RegistrarMasterBranchesQueryKey,
      registrarMasterId,
      page,
      limit,
      search,
    ],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          registrarMasterBranch: RegistrarMasterBranchType[];
        }>;
      }>(
        api_routes.registrarMasterBranches +
          `/list/${registrarMasterId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useRegistrarMasterBranchesSelectQuery: (params: {
  search?: string;
  enabled?: boolean;
}) => UseQueryResult<
  PaginationType<{ registrarMasterBranch: RegistrarMasterBranchType[] }>,
  unknown
> = ({ search = "", enabled = true }) => {
  const { axios } = useAxios();

  return useQuery({
    queryKey: [RegistrarMasterBranchesSelectQueryKey, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          registrarMasterBranch: RegistrarMasterBranchType[];
        }>;
      }>(
        api_routes.registrarMasterBranches +
          `/list-all?page=1&limit=20&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useRegistrarMasterBranchQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<RegistrarMasterBranchType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [RegistrarMasterBranchKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: RegistrarMasterBranchType }>(
        api_routes.registrarMasterBranches + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useRegistrarMasterBranchesQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addRegistrarMasterBranches = (
    registrarMasterId: number,
    newRegistrarMasterBranchVal: RegistrarMasterBranchType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ registrarMasterBranch: RegistrarMasterBranchType[] }>
    >(
      [
        RegistrarMasterBranchesQueryKey,
        registrarMasterId,
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
            registrarMasterBranch: [
              newRegistrarMasterBranchVal,
              ...prev.registrarMasterBranch,
            ],
          };
        }
      }
    );
  };

  const updateRegistrarMasterBranches = (
    id: number,
    registrarMasterId: number,
    updateRegistrarMasterBranchVal: RegistrarMasterBranchType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ registrarMasterBranch: RegistrarMasterBranchType[] }>
    >(
      [RegistrarMasterBranchesQueryKey, registrarMasterId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            registrarMasterBranch: prev.registrarMasterBranch.map(
              (registrarMasterBranch) =>
                registrarMasterBranch.id === id
                  ? {
                      ...registrarMasterBranch,
                      ...updateRegistrarMasterBranchVal,
                    }
                  : registrarMasterBranch
            ),
          };
        }
      }
    );
  };

  const deleteRegistrarMasterBranches = (
    id: number,
    registrarMasterId: number
  ) => {
    queryClient.setQueryData<
      PaginationType<{ registrarMasterBranch: RegistrarMasterBranchType[] }>
    >(
      [RegistrarMasterBranchesQueryKey, registrarMasterId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            registrarMasterBranch: prev.registrarMasterBranch.filter(
              (registrarMasterBranch) => registrarMasterBranch.id !== id
            ),
          };
        }
      }
    );
  };

  return {
    addRegistrarMasterBranches,
    updateRegistrarMasterBranches,
    deleteRegistrarMasterBranches,
  };
};

export const useRegistrarMasterBranchQuerySetData = () => {
  const queryClient = useQueryClient();

  const addRegistrarMasterBranch = (
    newRegistrarMasterBranchVal: RegistrarMasterBranchType
  ) => {
    queryClient.setQueryData<RegistrarMasterBranchType>(
      [RegistrarMasterBranchKey, newRegistrarMasterBranchVal.id],
      newRegistrarMasterBranchVal
    );
  };

  const updateRegistrarMasterBranch = (
    id: number,
    updateRegistrarMasterBranchVal: RegistrarMasterBranchType
  ) => {
    queryClient.setQueryData<RegistrarMasterBranchType>(
      [RegistrarMasterBranchKey, id],
      updateRegistrarMasterBranchVal
    );
  };

  const deleteRegistrarMasterBranch = (id: number) => {
    queryClient.setQueryData<RegistrarMasterBranchType>(
      [RegistrarMasterBranchKey, id],
      undefined
    );
  };

  return {
    addRegistrarMasterBranch,
    updateRegistrarMasterBranch,
    deleteRegistrarMasterBranch,
  };
};

export const useUpdateRegistrarMasterBranchMutation = (
  id: number,
  registrarMasterId: number
) => {
  const { axios } = useAxios();
  const { updateRegistrarMasterBranches } =
    useRegistrarMasterBranchesQuerySetData();
  const { updateRegistrarMasterBranch } =
    useRegistrarMasterBranchQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateRegistrarMasterBranchVal: RegistrarMasterBranchFormType
    ) => {
      const response = await axios.put<{ data: RegistrarMasterBranchType }>(
        api_routes.registrarMasterBranches + `/${id}`,
        updateRegistrarMasterBranchVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateRegistrarMasterBranchVal) => {
      // ✅ update detail view directly
      updateRegistrarMasterBranch(id, updateRegistrarMasterBranchVal);
      updateRegistrarMasterBranches(
        id,
        registrarMasterId,
        updateRegistrarMasterBranchVal
      );
      toastSuccess("Name Change Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddRegistrarMasterBranchMutation = (
  registrarMasterId: number
) => {
  const { axios } = useAxios();
  const { addRegistrarMasterBranches } =
    useRegistrarMasterBranchesQuerySetData();
  const { addRegistrarMasterBranch } = useRegistrarMasterBranchQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newRegistrarMasterBranchVal: RegistrarMasterBranchFormType
    ) => {
      const response = await axios.post<{ data: RegistrarMasterBranchType }>(
        api_routes.registrarMasterBranches + `/create/${registrarMasterId}`,
        newRegistrarMasterBranchVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newRegistrarMasterBranchVal) => {
      // ✅ update detail view directly
      addRegistrarMasterBranch(newRegistrarMasterBranchVal);
      addRegistrarMasterBranches(
        registrarMasterId,
        newRegistrarMasterBranchVal
      );
      toastSuccess("Name Change Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteRegistrarMasterBranchMutation = (
  id: number,
  registrarMasterId: number
) => {
  const { axios } = useAxios();
  const { deleteRegistrarMasterBranches } =
    useRegistrarMasterBranchesQuerySetData();
  const { deleteRegistrarMasterBranch } =
    useRegistrarMasterBranchQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: RegistrarMasterBranchType }>(
        api_routes.registrarMasterBranches + `/delete/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteRegistrarMasterBranch(id);
      deleteRegistrarMasterBranches(id, registrarMasterId);
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
