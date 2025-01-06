import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  CertificateFormType,
  CertificateType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const CertificateKey = "certificate";
export const CertificatesQueryKey = "certificates";

export const useCertificatesQuery: (params: {
  folioId: number;
}) => UseQueryResult<PaginationType<{ certificate: CertificateType[] }>, unknown> = ({
  folioId,
}) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: [CertificatesQueryKey, folioId, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{
          certificate: CertificateType[];
        }>;
      }>(
        api_routes.certificates +
          `/list/${folioId}?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data.data;
    },
  });
};

export const useCertificateQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<CertificateType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [CertificateKey, id],
    queryFn: async () => {
      const response = await axios.get<{
        data: CertificateType;
      }>(api_routes.certificates + `/${id}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useCertificatesQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addCertificates = (
    folioId: number,
    newCertificateVal: CertificateType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        certificate: CertificateType[];
      }>
    >(
      [
        CertificatesQueryKey,
        folioId,
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
            certificate: [newCertificateVal, ...prev.certificate],
          };
        }
      }
    );
  };

  const updateCertificates = (
    id: number,
    folioId: number,
    updateCertificateVal: CertificateType
  ) => {
    queryClient.setQueryData<
      PaginationType<{
        certificate: CertificateType[];
      }>
    >(
      [CertificatesQueryKey, folioId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            certificate: prev.certificate.map((certificate) =>
              certificate.id === id
                ? {
                    ...certificate,
                    ...updateCertificateVal,
                  }
                : certificate
            ),
          };
        }
      }
    );
  };

  const deleteCertificates = (id: number, folioId: number) => {
    queryClient.setQueryData<
      PaginationType<{
        certificate: CertificateType[];
      }>
    >(
      [CertificatesQueryKey, folioId, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            certificate: prev.certificate.filter((certificate) => certificate.id !== id),
          };
        }
      }
    );
  };

  return {
    addCertificates,
    updateCertificates,
    deleteCertificates,
  };
};

export const useCertificateQuerySetData = () => {
  const queryClient = useQueryClient();

  const addCertificate = (newCertificateVal: CertificateType) => {
    queryClient.setQueryData<CertificateType>(
      [CertificateKey, newCertificateVal.id],
      newCertificateVal
    );
  };

  const updateCertificate = (id: number, updateCertificateVal: CertificateType) => {
    queryClient.setQueryData<CertificateType>([CertificateKey, id], updateCertificateVal);
  };

  const deleteCertificate = (id: number) => {
    queryClient.setQueryData<CertificateType>([CertificateKey, id], undefined);
  };

  return {
    addCertificate,
    updateCertificate,
    deleteCertificate,
  };
};

export const useUpdateCertificateMutation = (
  id: number,
  folioId: number
) => {
  const { axios } = useAxios();
  const { updateCertificates } = useCertificatesQuerySetData();
  const { updateCertificate } = useCertificateQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateCertificateVal: CertificateFormType) => {
      const response = await axios.put<{
        data: CertificateType;
      }>(api_routes.certificates + `/${id}`, {
        ...updateCertificateVal,
      });
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateCertificateVal) => {
      // ✅ update detail view directly
      updateCertificate(id, updateCertificateVal);
      updateCertificates(id, folioId, updateCertificateVal);
      toastSuccess("Certificates updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddCertificateMutation = (folioId: number) => {
  const { axios } = useAxios();
  const { addCertificates } = useCertificatesQuerySetData();
  const { addCertificate } = useCertificateQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newCertificateVal: CertificateFormType) => {
      const {...rest} = newCertificateVal;
      const response = await axios.post<{
        data: CertificateType;
      }>(api_routes.certificates + `/create/${folioId}`, {
        ...rest,
      });
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newCertificateVal) => {
      // ✅ update detail view directly
      addCertificate(newCertificateVal);
      addCertificates(folioId, newCertificateVal);
      toastSuccess("Certificates created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteCertificateMutation = (
  id: number,
  folioId: number
) => {
  const { axios } = useAxios();
  const { deleteCertificates } = useCertificatesQuerySetData();
  const { deleteCertificate } = useCertificateQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{
        data: CertificateType;
      }>(api_routes.certificates + `/${id}`);
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteCertificate(id);
      deleteCertificates(id, folioId);
      toastSuccess("Certificates deleted successfully.");
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
