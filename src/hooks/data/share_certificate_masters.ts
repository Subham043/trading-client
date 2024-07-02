import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  ShareCertificateMasterType,
  ShareCertificateMasterFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const ShareCertificateMasterKey = "share_certificate_master";
export const ShareCertificateMastersQueryKey = "share_certificate_masters";

export const useShareCertificateMastersQuery: (
  enabled?: boolean
) => UseQueryResult<
  PaginationType<{ shareCertificateMaster: ShareCertificateMasterType[] }>,
  unknown
> = (enabled = true) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [ShareCertificateMastersQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          shareCertificateMaster: ShareCertificateMasterType[];
        }>;
      }>(
        api_routes.shareCertificateMasters +
          `?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useShareCertificateMasterQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<ShareCertificateMasterType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [ShareCertificateMasterKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: ShareCertificateMasterType }>(
        api_routes.shareCertificateMasters + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useShareCertificateMastersQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addShareCertificateMasters = (
    newShareCertificateMasterVal: ShareCertificateMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ shareCertificateMaster: ShareCertificateMasterType[] }>
    >(
      [
        ShareCertificateMastersQueryKey,
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
            shareCertificateMaster: [
              newShareCertificateMasterVal,
              ...prev.shareCertificateMaster,
            ],
          };
        }
      }
    );
  };

  const updateShareCertificateMasters = (
    id: number,
    updateShareCertificateMasterVal: ShareCertificateMasterType
  ) => {
    queryClient.setQueryData<
      PaginationType<{ shareCertificateMaster: ShareCertificateMasterType[] }>
    >([ShareCertificateMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          shareCertificateMaster: prev.shareCertificateMaster.map(
            (shareCertificateMaster) =>
              shareCertificateMaster.id === id
                ? updateShareCertificateMasterVal
                : shareCertificateMaster
          ),
        };
      }
    });
  };

  const deleteShareCertificateMasters = (id: number) => {
    queryClient.setQueryData<
      PaginationType<{ shareCertificateMaster: ShareCertificateMasterType[] }>
    >([ShareCertificateMastersQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          shareCertificateMaster: prev.shareCertificateMaster.filter(
            (shareCertificateMaster) => shareCertificateMaster.id !== id
          ),
        };
      }
    });
  };

  return {
    addShareCertificateMasters,
    updateShareCertificateMasters,
    deleteShareCertificateMasters,
  };
};

export const useShareCertificateMasterQuerySetData = () => {
  const queryClient = useQueryClient();

  const addShareCertificateMaster = (
    newShareCertificateMasterVal: ShareCertificateMasterType
  ) => {
    queryClient.setQueryData<ShareCertificateMasterType>(
      [ShareCertificateMasterKey, newShareCertificateMasterVal.id],
      newShareCertificateMasterVal
    );
  };

  const updateShareCertificateMaster = (
    id: number,
    updateShareCertificateMasterVal: ShareCertificateMasterType
  ) => {
    queryClient.setQueryData<ShareCertificateMasterType>(
      [ShareCertificateMasterKey, id],
      (prev) => ({ ...prev, ...updateShareCertificateMasterVal })
    );
  };

  const deleteShareCertificateMaster = (id: number) => {
    queryClient.setQueryData<ShareCertificateMasterType>(
      [ShareCertificateMasterKey, id],
      undefined
    );
  };

  return {
    addShareCertificateMaster,
    updateShareCertificateMaster,
    deleteShareCertificateMaster,
  };
};

export const useUpdateShareCertificateMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { updateShareCertificateMasters } =
    useShareCertificateMastersQuerySetData();
  const { updateShareCertificateMaster } =
    useShareCertificateMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      updateShareCertificateMasterVal: ShareCertificateMasterFormType
    ) => {
      const response = await axios.put<{ data: ShareCertificateMasterType }>(
        api_routes.shareCertificateMasters + `/${id}`,
        updateShareCertificateMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateShareCertificateMasterVal) => {
      // ✅ update detail view directly
      updateShareCertificateMaster(id, updateShareCertificateMasterVal);
      updateShareCertificateMasters(id, updateShareCertificateMasterVal);
      toastSuccess("Share Certificate Master updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddShareCertificateMasterMutation = () => {
  const { axios } = useAxios();
  const { addShareCertificateMasters } =
    useShareCertificateMastersQuerySetData();
  const { addShareCertificateMaster } = useShareCertificateMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (
      newShareCertificateMasterVal: ShareCertificateMasterFormType
    ) => {
      const response = await axios.post<{ data: ShareCertificateMasterType }>(
        api_routes.shareCertificateMasters,
        newShareCertificateMasterVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newShareCertificateMasterVal) => {
      // ✅ update detail view directly
      addShareCertificateMaster(newShareCertificateMasterVal);
      addShareCertificateMasters(newShareCertificateMasterVal);
      toastSuccess("Share Certificate Master created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteShareCertificateMasterMutation = (id: number) => {
  const { axios } = useAxios();
  const { deleteShareCertificateMasters } =
    useShareCertificateMastersQuerySetData();
  const { deleteShareCertificateMaster } =
    useShareCertificateMasterQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: ShareCertificateMasterType }>(
        api_routes.shareCertificateMasters + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteShareCertificateMaster(id);
      deleteShareCertificateMasters(id);
      toastSuccess("Share Certificate Master deleted successfully.");
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
