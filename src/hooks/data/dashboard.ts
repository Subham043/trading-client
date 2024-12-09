import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { DashboardQueryType } from "../../utils/types";
import { useAxios } from "../useAxios";
import { api_routes } from "../../utils/api_routes";

export const DashboardKey = "dashboard";

export const useDashboardQuery: () => UseQueryResult<
  DashboardQueryType,
  unknown
> = () => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [DashboardKey],
    queryFn: async () => {
      const response = await axios.get<{ data: DashboardQueryType }>(
        api_routes.dashboard.stats
      );
      return response.data.data;
    },
  });
};
