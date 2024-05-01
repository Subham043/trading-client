import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  PincodeQueryFormType,
  PincodeQueryType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const PincodeQueryKey = "pincode";
export const PincodesQueryKey = "pincodes";
export const PincodesSelectQueryKey = "pincodes_select";

export const usePincodesQuery: () => UseQueryResult<
  PaginationType<{ pincode: PincodeQueryType[] }>,
  unknown
> = () => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [PincodesQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ pincode: PincodeQueryType[] }>;
      }>(api_routes.pincodes + `?page=${page}&limit=${limit}&search=${search}`);
      return response.data.data;
    },
  });
};

export const usePincodeQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<PincodeQueryType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [PincodeQueryKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: PincodeQueryType }>(
        api_routes.pincodes + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const usePincodesQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addPincodes = (newPincodeVal: PincodeQueryType) => {
    queryClient.setQueryData<PaginationType<{ pincode: PincodeQueryType[] }>>(
      [PincodesQueryKey, QueryInitialPageParam.toString(), limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            last_page: prev.last_page + 1,
            total: prev.total + 1,
            current_page: prev.current_page + 1,
            pincode: [newPincodeVal, ...prev.pincode],
          };
        }
      }
    );
  };

  const updatePincodes = (id: number, updatePincodeVal: PincodeQueryType) => {
    queryClient.setQueryData<PaginationType<{ pincode: PincodeQueryType[] }>>(
      [PincodesQueryKey, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            pincode: prev.pincode.map((pincode) =>
              pincode.id === id ? updatePincodeVal : pincode
            ),
          };
        }
      }
    );
  };

  const deletePincodes = (id: number) => {
    queryClient.setQueryData<PaginationType<{ pincode: PincodeQueryType[] }>>(
      [PincodesQueryKey, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            pincode: prev.pincode.filter((pincode) => pincode.id !== id),
          };
        }
      }
    );
  };

  return {
    addPincodes,
    updatePincodes,
    deletePincodes,
  };
};

export const usePincodeQuerySetData = () => {
  const queryClient = useQueryClient();

  const addPincode = (newPincodeVal: PincodeQueryType) => {
    queryClient.setQueryData<PincodeQueryType>(
      [PincodeQueryKey, newPincodeVal.id],
      newPincodeVal
    );
  };

  const updatePincode = (id: number, updatePincodeVal: PincodeQueryType) => {
    queryClient.setQueryData<PincodeQueryType>(
      [PincodeQueryKey, id],
      updatePincodeVal
    );
  };

  const deletePincode = (id: number) => {
    queryClient.setQueryData<PincodeQueryType>(
      [PincodeQueryKey, id],
      undefined
    );
  };

  return {
    addPincode,
    updatePincode,
    deletePincode,
  };
};

export const useUpdatePincodeMutation = (id: number) => {
  const { axios } = useAxios();
  const { updatePincode } = usePincodeQuerySetData();
  const { updatePincodes } = usePincodesQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updatePincodeVal: PincodeQueryFormType) => {
      const response = await axios.put<{ data: PincodeQueryType }>(
        api_routes.pincodes + `/${id}`,
        updatePincodeVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updatePincodeVal) => {
      // ✅ update detail view directly
      updatePincode(id, updatePincodeVal);
      updatePincodes(id, updatePincodeVal);
      toastSuccess("Pincode updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddPincodeMutation = () => {
  const { axios } = useAxios();
  const { addPincode } = usePincodeQuerySetData();
  const { addPincodes } = usePincodesQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newPincodeVal: PincodeQueryFormType) => {
      const response = await axios.post<{ data: PincodeQueryType }>(
        api_routes.pincodes,
        newPincodeVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newPincodeVal) => {
      // ✅ update detail view directly
      addPincode(newPincodeVal);
      addPincodes(newPincodeVal);
      toastSuccess("Pincode created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeletePincodeMutation = (id: number) => {
  const { axios } = useAxios();
  const { deletePincode } = usePincodeQuerySetData();
  const { deletePincodes } = usePincodesQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: PincodeQueryType }>(
        api_routes.pincodes + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deletePincode(id);
      deletePincodes(id);
      toastSuccess("Pincode deleted successfully.");
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

export const usePincodesSelectQuery: ({
  search,
  enabled,
}: {
  search?: string;
  enabled?: boolean;
}) => UseQueryResult<
  { id: number; pincode: string; state_name: string }[],
  unknown
> = ({ search = "", enabled = false }) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [PincodesQueryKey, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: { id: number; pincode: string; state_name: string }[];
      }>(api_routes.pincodes + `/select?search=${search}`);
      return response.data.data;
    },
    enabled: enabled && search.length > 0,
  });
};
