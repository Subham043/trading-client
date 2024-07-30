import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import {
  PaginationType,
  ProjectType,
  ProjectFormType,
} from "../../utils/types";
import { api_routes } from "../../utils/api_routes";
import { QueryInitialPageParam, QueryTotalCount } from "../../utils/constant";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../useToast";
import { isAxiosError } from "axios";

export const ProjectKey = "project";
export const ProjectsQueryKey = "projects";

export const useProjectsQuery: (
  enabled?: boolean
) => UseQueryResult<PaginationType<{ project: ProjectType[] }>, unknown> = (
  enabled = true
) => {
  const { axios } = useAxios();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";
  return useQuery({
    queryKey: [ProjectsQueryKey, page, limit, search],
    queryFn: async () => {
      const response = await axios.get<{
        data: PaginationType<{ project: ProjectType[] }>;
      }>(api_routes.projects + `?page=${page}&limit=${limit}&search=${search}`);
      return response.data.data;
    },
    enabled,
  });
};

export const useProjectQuery: (
  id: number,
  enabled: boolean
) => UseQueryResult<ProjectType, unknown> = (id, enabled) => {
  const { axios } = useAxios();
  return useQuery({
    queryKey: [ProjectKey, id],
    queryFn: async () => {
      const response = await axios.get<{ data: ProjectType }>(
        api_routes.projects + `/${id}`
      );
      return response.data.data;
    },
    enabled,
  });
};

export const useProjectsQuerySetData = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || QueryInitialPageParam.toString();
  const limit = searchParams.get("limit") || QueryTotalCount.toString();
  const search = searchParams.get("search") || "";

  const addProjects = (newProjectVal: ProjectType) => {
    queryClient.setQueryData<PaginationType<{ project: ProjectType[] }>>(
      [ProjectsQueryKey, QueryInitialPageParam.toString(), limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            last_page: prev.last_page + 1,
            total: prev.total + 1,
            current_page: prev.current_page + 1,
            project: [newProjectVal, ...prev.project],
          };
        }
      }
    );
  };

  const updateProjects = (id: number, updateProjectVal: ProjectType) => {
    queryClient.setQueryData<PaginationType<{ project: ProjectType[] }>>(
      [ProjectsQueryKey, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            project: prev.project.map((project) =>
              project.id === id ? updateProjectVal : project
            ),
          };
        }
      }
    );
  };

  const deleteProjects = (id: number) => {
    queryClient.setQueryData<PaginationType<{ project: ProjectType[] }>>(
      [ProjectsQueryKey, page, limit, search],
      (prev) => {
        if (prev) {
          return {
            ...prev,
            project: prev.project.filter((project) => project.id !== id),
          };
        }
      }
    );
  };

  return {
    addProjects,
    updateProjects,
    deleteProjects,
  };
};

export const useProjectQuerySetData = () => {
  const queryClient = useQueryClient();

  const addProject = (newProjectVal: ProjectType) => {
    queryClient.setQueryData<ProjectType>(
      [ProjectKey, newProjectVal.id],
      newProjectVal
    );
  };

  const updateProject = (id: number, updateProjectVal: ProjectType) => {
    queryClient.setQueryData<ProjectType>([ProjectKey, id], (prev) => ({
      ...prev,
      ...updateProjectVal,
    }));
  };

  const deleteProject = (id: number) => {
    queryClient.setQueryData<ProjectType>([ProjectKey, id], undefined);
  };

  return {
    addProject,
    updateProject,
    deleteProject,
  };
};

export const useUpdateProjectMutation = (id: number) => {
  const { axios } = useAxios();
  const { updateProjects } = useProjectsQuerySetData();
  const { updateProject } = useProjectQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (updateProjectVal: ProjectFormType) => {
      const response = await axios.put<{ data: ProjectType }>(
        api_routes.projects + `/${id}`,
        updateProjectVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (updateProjectVal) => {
      // ✅ update detail view directly
      updateProject(id, updateProjectVal);
      updateProjects(id, updateProjectVal);
      toastSuccess("Project updated successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useAddProjectMutation = () => {
  const { axios } = useAxios();
  const { addProjects } = useProjectsQuerySetData();
  const { addProject } = useProjectQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (newProjectVal: ProjectFormType) => {
      const response = await axios.post<{ data: ProjectType }>(
        api_routes.projects,
        newProjectVal
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: (newProjectVal) => {
      // ✅ update detail view directly
      addProject(newProjectVal);
      addProjects(newProjectVal);
      toastSuccess("Project created successfully.");
    },
    onError: (error) => {
      if (!isAxiosError(error)) {
        toastError("Something went wrong. Please try again later.");
      }
    },
  });
};

export const useDeleteProjectMutation = (id: number) => {
  const { axios } = useAxios();
  const { deleteProjects } = useProjectsQuerySetData();
  const { deleteProject } = useProjectQuerySetData();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete<{ data: ProjectType }>(
        api_routes.projects + `/${id}`
      );
      return response.data.data;
    },
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      deleteProject(id);
      deleteProjects(id);
      toastSuccess("Project deleted successfully.");
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
