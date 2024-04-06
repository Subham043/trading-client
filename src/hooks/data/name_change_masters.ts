import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  ApiPaginationQueryType,
  PaginationType,
  NameChangeMasterType,
  NameChangeMasterFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";

export const NameChangeMasterKey = "name_change_master";
export const NameChangeMastersQueryKey = "name_change_masters";
export const NameChangeMastersCompanyQueryKey = "name_change_company_masters";

export const useNameChangeMastersMain: (
  params: ApiPaginationQueryType
) => UseQueryResult<
  PaginationType<{
    nameChangeMaster: (NameChangeMasterType & {
      CIN?: string | null | undefined;
      ISIN?: string | null | undefined;
      faceValue?: number | null | undefined;
    })[];
  }>,
  unknown
> = ({
  search = "",
  page = QueryInitialPageParam,
  limit = QueryTotalCount,
}) => {
  const { axios } = useAxios();
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

export const useNameChangeMasters: (
  params: { companyId: number } & ApiPaginationQueryType
) => UseQueryResult<
  PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>,
  unknown
> = ({
  companyId,
  search = "",
  page = QueryInitialPageParam,
  limit = QueryTotalCount,
}) => {
  const { axios } = useAxios();
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

export const useNameChangeMaster: (
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

export const useNameChangeMasterLatest: (
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

export const useUpdateNameChangeMaster = (id: number, companyId: number) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
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
      queryClient.setQueryData(
        [NameChangeMasterKey, id],
        updateNameChangeMasterVal
      );
      queryClient.setQueryData<
        PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>
      >(
        [
          NameChangeMastersQueryKey,
          companyId,
          searchParams.get("page") || QueryInitialPageParam.toString(),
          searchParams.get("limit") || QueryTotalCount.toString(),
          searchParams.get("search") || "",
        ],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              nameChangeMaster: prev.nameChangeMaster.map((nameChangeMaster) =>
                nameChangeMaster.id === id
                  ? updateNameChangeMasterVal
                  : nameChangeMaster
              ),
            };
          }
        }
      );
    },
  });
};

export const useAddNameChangeMaster = (companyId: number) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
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
      queryClient.setQueryData<NameChangeMasterType>(
        [NameChangeMasterKey, newNameChangeMasterVal.id],
        newNameChangeMasterVal
      );
      queryClient.setQueryData<
        PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>
      >(
        [
          NameChangeMastersQueryKey,
          companyId,
          QueryInitialPageParam.toString(),
          searchParams.get("limit") || QueryTotalCount.toString(),
          searchParams.get("search") || "",
        ],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              nameChangeMaster: [
                newNameChangeMasterVal,
                ...prev.nameChangeMaster,
              ],
            };
          }
        }
      );
    },
  });
};

export const useDeleteNameChangeMaster = (id: number, companyId: number) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
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
      queryClient.setQueryData<
        PaginationType<{ nameChangeMaster: NameChangeMasterType[] }>
      >(
        [
          NameChangeMastersQueryKey,
          companyId,
          searchParams.get("page") || QueryInitialPageParam.toString(),
          searchParams.get("limit") || QueryTotalCount.toString(),
          searchParams.get("search") || "",
        ],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              nameChangeMaster: prev.nameChangeMaster.filter(
                (nameChangeMaster) => nameChangeMaster.id !== id
              ),
            };
          }
        }
      );
    },
  });
};
