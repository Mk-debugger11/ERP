import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Branch, BranchCreate, BranchUpdate } from '../types';

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await apiClient.get<Branch[]>('/branches/');
      return response.data;
    },
  });
};

export const useBranch = (id: number) => {
  return useQuery({
    queryKey: ['branches', id],
    queryFn: async () => {
      const response = await apiClient.get<Branch>(`/branches/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BranchCreate) => {
      const response = await apiClient.post<Branch>('/branches/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BranchUpdate }) => {
      const response = await apiClient.patch<Branch>(`/branches/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/branches/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
};
