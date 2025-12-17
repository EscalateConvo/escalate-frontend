import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import environments from "../environments.ts";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const apiClient = axios.create({
  baseURL: environments.server.origin,
});

let authToken: string | undefined;

export const setToken = (token: string) => {
  authToken = token;
};

export const getToken = () => {
  return authToken;
};

export const clearToken = () => {
  authToken = undefined;
};

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const createModule = async (data: any) => {
  const res = await apiClient.post<{ data: any }>(`/api/modules/create`, data);
  return res.data.data;
};

export const getAllModules = async () => {
  const res = await apiClient.get<{ data: any[] }>(`/api/modules/getall`);
  return res.data.data;
};

export const getOneModule = async (moduleId: string) => {
  const res = await apiClient.get<{ data: any }>(`/api/modules/${moduleId}`);
  return res.data.data;
};

export const updateModule = async (moduleId: string, data: any) => {
  const res = await apiClient.put<{ data: any }>(`/api/modules/${moduleId}`, data);
  return res.data.data;
};

export const deleteModule = async (moduleId: string) => {
  const res = await apiClient.delete<{ message: string }>(`/api/modules/${moduleId}`);
  return res.data;
};

export const generateShareURL = async (moduleId: string, expiryDays?: number) => {
  const res = await apiClient.post<{ data: any }>(`/api/modules/${moduleId}/share`, { expiryDays });
  return res.data.data;
};

export const revokeShareURL = async (moduleId: string) => {
  const res = await apiClient.delete<{ message: string }>(`/api/modules/${moduleId}/share`);
  return res.data;
};

export const getAllModulesByUserEmail = async () => {
  const res = await apiClient.get<{ data: any[] }>(`/api/modules/shared/all`);
  return res.data.data;
};

export const getModuleByEmailOrShareToken = async (shareToken: string) => {
  const res = await apiClient.get<{ data: any }>(`/api/modules/shared/${shareToken}`);
  return res.data.data;
};

export const getOrganizationStatistics = async () => {
  const res = await apiClient.get<{ data: { totalTestsAssigned: number; completed: number; pending: number } }>(`/api/modules/statistics`);
  return res.data.data;
};