import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Designation, DesignationCreate, DesignationUpdate } from '../types';

export const useDesignations = () => {
  return useQuery({
    queryKey: ['designations'],
    queryFn: async () => {
      const response = await apiClient.get<Designation[]>('/designations/');
      return response.data;
    },
  });
};

export const useDesignation = (id: number) => {
  return useQuery({
    queryKey: ['designations', id],
    queryFn: async () => {
      const response = await apiClient.get<Designation>(`/designations/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateDesignation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DesignationCreate) => {
      const response = await apiClient.post<Designation>('/designations/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
    },
  });
};

export const useUpdateDesignation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DesignationUpdate }) => {
      const response = await apiClient.patch<Designation>(`/designations/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
    },
  });
};

export const useDeleteDesignation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/designations/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
    },
  });
};
