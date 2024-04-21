import {
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { PaginationType, FailedExcelType } from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";

export const FailedExcelsQueryKey = "failed_excels";

export const useFailedExcelsQuery: () => UseQueryResult<
  PaginationType<{ failedExcel: FailedExcelType[] }>,
  unknown
> = () => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [FailedExcelsQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ failedExcel: FailedExcelType[] }>;
      }>(
        api_routes.upload.failed_excel.list +
          `?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useFailedExcelsQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const deleteFailedExcels = (id: number) => {
    queryClient.setQueryData<
      PaginationType<{ failedExcel: FailedExcelType[] }>
    >([FailedExcelsQueryKey, page, limit, search], (prev) => {
      if (prev) {
        return {
          ...prev,
          failedExcel: prev.failedExcel.filter(
            (failedExcel) => failedExcel.id !== id
          ),
        };
      }
    });
  };

  return {
    deleteFailedExcels,
  };
};
export const useDeleteFailedExcelMutation = (id: number) => {
  const { deleteFailedExcels } = useFailedExcelsQuerySetData();
  const destroyFailedExcels = () => deleteFailedExcels(id);
  return { destroyFailedExcels };
};
