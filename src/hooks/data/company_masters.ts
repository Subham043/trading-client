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
  CompanyMasterType,
  CompanyMasterFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";

export const CompanyMasterKey = "company_master";
export const CompanyMastersQueryKey = "company_masters";

export const useCompanyMasters: (
  params: ApiPaginationQueryType
) => UseQueryResult<
  PaginationType<{ companyMaster: CompanyMasterType[] }>,
  unknown
> = ({
  search = "",
  page = QueryInitialPageParam,
  limit = QueryTotalCount,
}) => {
  const { axios } = useAxios();
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

export const useCompanyMaster: (
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

export const useUpdateCompanyMaster = (id: number) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
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
      queryClient.setQueryData([CompanyMasterKey, id], updateCompanyMasterVal);
      queryClient.setQueryData<
        PaginationType<{ companyMaster: CompanyMasterType[] }>
      >(
        [
          CompanyMastersQueryKey,
          searchParams.get("page") || QueryInitialPageParam.toString(),
          searchParams.get("limit") || QueryTotalCount.toString(),
          searchParams.get("search") || "",
        ],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              companyMaster: prev.companyMaster.map((companyMaster) =>
                companyMaster.id === id ? updateCompanyMasterVal : companyMaster
              ),
            };
          }
        }
      );
    },
  });
};

export const useAddCompanyMaster = () => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
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
      queryClient.setQueryData<CompanyMasterType>(
        [CompanyMasterKey, newCompanyMasterVal.id],
        newCompanyMasterVal
      );
      queryClient.setQueryData<
        PaginationType<{ companyMaster: CompanyMasterType[] }>
      >(
        [
          CompanyMastersQueryKey,
          QueryInitialPageParam.toString(),
          searchParams.get("limit") || QueryTotalCount.toString(),
          searchParams.get("search") || "",
        ],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              companyMaster: [newCompanyMasterVal, ...prev.companyMaster],
            };
          }
        }
      );
    },
  });
};

export const useDeleteCompanyMaster = (id: number) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
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
      queryClient.setQueryData<
        PaginationType<{ companyMaster: CompanyMasterType[] }>
      >(
        [
          CompanyMastersQueryKey,
          searchParams.get("page") || QueryInitialPageParam.toString(),
          searchParams.get("limit") || QueryTotalCount.toString(),
          searchParams.get("search") || "",
        ],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              companyMaster: prev.companyMaster.filter(
                (companyMaster) => companyMaster.id !== id
              ),
            };
          }
        }
      );
    },
  });
};
