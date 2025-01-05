import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  NominationType,
  NominationFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const NominationKey = "nomination";
export const NominationsQueryKey = "nominations";

export const useNominationsQuery: (
  projectId: string,
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{
    nominations: (NominationType)[];
  }>,
  unknown
> = (projectId, enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [NominationsQueryKey, page, limit, search, projectId],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          nomination: NominationType[];
        }>;
      }>(
        api_routes.nominations +
          `/list/${projectId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useNominationQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<NominationType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [NominationKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: NominationType }>(
        api_routes.nominations + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useNominationsQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addNominations = (
    newNominationVal: NominationType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ nominations: NominationType[] }>
    >(
      [
        NominationsQueryKey,
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
            nominations: [
              newNominationVal,
              ...prev.nominations,
            ],
          };
        }
      }
    );
  };

  const updateNominations = (
    id: number,
    updateNominationVal: NominationType,
    projectId: string
  ) => {
    queryClient.setQueryData<
      PaginationType<{ nominations: NominationType[] }>
    >(
      [NominationsQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            nominations: prev.nominations.map(
              (nomination) =>
                nomination.id === id
                  ? updateNominationVal
                  : nomination
            ),
          };
        }
      }
    );
  };

  const deleteNominations = (id: number, projectId: string) => {
    queryClient.setQueryData<
      PaginationType<{ nominations: NominationType[] }>
    >(
      [NominationsQueryKey, page, limit, search, projectId],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            nominations: prev.nominations.filter(
              (nomination) => nomination.id !== id
            ),
          };
        }
      }
    );
  };

  return {
    addNominations,
    updateNominations,
    deleteNominations,
  };
};

export const useNominationQuerySetData = () => {
  const queryClient = useQueryClient();

  const addNomination = (
    newNominationVal: NominationType
  ) => {
    queryClient.setQueryData<NominationType>(
      [NominationKey, newNominationVal.id],
      newNominationVal
    );
  };

  const updateNomination = (
    id: number,
    updateNominationVal: NominationType
  ) => {
    queryClient.setQueryData<NominationType>(
      [NominationKey, id],
      (prev) => ({ ...prev, ...updateNominationVal })
    );
  };

  const deleteNomination = (id: number) => {
    queryClient.setQueryData<NominationType>(
      [NominationKey, id],
      undefined
    );
  };

  return {
    addNomination,
    updateNomination,
    deleteNomination,
  };
};

export const useUpdateNominationMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { updateNominations } =
    useNominationsQuerySetData();
  const { updateNomination } =
    useNominationQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateNominationVal: NominationFormType
    ) => {
      const response = await axios.put<{ data: NominationType }>(
        api_routes.nominations + `/${id}`,
        {
          ...updateNominationVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateNominationVal) => {
      // ✅ update detail view directly
      updateNomination(id, updateNominationVal);
      updateNominations(
        id,
        updateNominationVal,
        projectId
      );
      toastSuccess("Nomination updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddNominationMutation = (projectId: string) => {
  const { axios } = useAxios();
  const { addNominations } =
    useNominationsQuerySetData();
  const { addNomination } = useNominationQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newNominationVal: NominationFormType
    ) => {
      const response = await axios.post<{ data: NominationType }>(
        api_routes.nominations + `/create/${projectId}`,
        {
          ...newNominationVal,
        }
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newNominationVal) => {
      // ✅ update detail view directly
      addNomination(newNominationVal);
      addNominations(newNominationVal, projectId);
      toastSuccess("Nomination created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteNominationMutation = (
  id: number,
  projectId: string
) => {
  const { axios } = useAxios();
  const { deleteNominations } =
    useNominationsQuerySetData();
  const { deleteNomination } =
    useNominationQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: NominationType }>(
        api_routes.nominations + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteNomination(id);
      deleteNominations(id, projectId);
      toastSuccess("Nomination deleted successfully.");
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
