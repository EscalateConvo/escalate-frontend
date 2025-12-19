import { apiClient } from "../lib/apiService";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Emotion = "neutral" | "happy" | "angry" | "confused" | "sad";

export interface ModuleStatistics {
  totalModules: number;
  completed: number;
  activeModules: number;
}

export interface ModuleAIFields {
  role: string;
  systemPrompt: string;
  firstMessage: string;
  initialEmotion?: Emotion;
  audioConfig?: {
    voiceId?: string;
  };
}

export interface ModuleUserFields {
  role: string;
  problemStatement: string;
}

export type AttemptStatus = "PENDING" | "ONGOING" | "COMPLETED";

export interface AttemptReport {
  _id: string;
  score?: number;
  feedback?: string;
}

export interface Attempt {
  _id: string;
  module: string;
  user: string;
  attemptStatus: AttemptStatus;
  attemptReport?: AttemptReport | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SharedModule {
  _id: string;
  title: string;
  topic: string;
  userFields: ModuleUserFields;
  attempt: Attempt | null;
}

export interface Module {
  _id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  active: boolean;
  shareURL?: string;
  shareTokenExpiry?: string;
  aiFields: ModuleAIFields;
  userFields: ModuleUserFields;
  userEmails: string[];
  createdBy?: string;
  createdAt?: string;
}

export interface CreateModuleData {
  title: string;
  topic: string;
  difficulty: Difficulty;
  aiFields: ModuleAIFields;
  userFields: ModuleUserFields;
  userEmails?: string[];
}

export interface ShareURLResponse {
  shareURL: string;
  shareToken: string;
  expiresAt: string;
}

export const getOrganizationStatistics =
  async (): Promise<ModuleStatistics> => {
    const res = await apiClient.get<{ data: ModuleStatistics }>(
      `/api/modules/statistics`,
    );
    return res.data.data;
  };

export const createModule = async (data: CreateModuleData): Promise<Module> => {
  const res = await apiClient.post<{ data: Module }>(
    `/api/modules/create`,
    data,
  );
  return res.data.data;
};

export const getAllModules = async (): Promise<Module[]> => {
  const res = await apiClient.get<{ data: Module[] }>(`/api/modules/getall`);
  return res.data.data;
};

export const getModule = async (moduleId: string): Promise<Module> => {
  const res = await apiClient.get<{ data: Module }>(`/api/modules/${moduleId}`);
  return res.data.data;
};

export const updateModule = async (
  moduleId: string,
  data: Partial<CreateModuleData>,
): Promise<Module> => {
  const res = await apiClient.put<{ data: Module }>(
    `/api/modules/${moduleId}`,
    data,
  );
  return res.data.data;
};

export const deleteModule = async (
  moduleId: string,
): Promise<{ message: string }> => {
  const res = await apiClient.delete<{ message: string }>(
    `/api/modules/${moduleId}`,
  );
  return res.data;
};

export const generateShareURL = async (
  moduleId: string,
  expiryDays?: number,
): Promise<ShareURLResponse> => {
  const res = await apiClient.post<{ data: ShareURLResponse }>(
    `/api/modules/${moduleId}/share`,
    { expiryDays },
  );
  return res.data.data;
};

export const revokeShareURL = async (
  moduleId: string,
): Promise<{ message: string }> => {
  const res = await apiClient.delete<{ message: string }>(
    `/api/modules/${moduleId}/share`,
  );
  return res.data;
};

export const getSharedModules = async (): Promise<Module[]> => {
  const res = await apiClient.get<{ data: Module[] }>(
    `/api/modules/shared/all`,
  );
  return res.data.data;
};

export const getModuleByShareToken = async (
  shareToken: string,
): Promise<Module> => {
  const res = await apiClient.get<{ data: Module }>(
    `/api/modules/shared/${shareToken}`,
  );
  return res.data.data;
};

export const getSharedModuleById = async (
  moduleId: string,
): Promise<SharedModule> => {
  const res = await apiClient.get<{ data: SharedModule }>(
    `/api/modules/shared/${moduleId}`,
  );
  return res.data.data;
};
