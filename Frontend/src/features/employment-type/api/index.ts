import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { EmploymentType, EmploymentTypeCreate, EmploymentTypeUpdate } from '../types';

export const useEmploymentTypes = () => {
  return useQuery({
    queryKey: ['employment-types'],
    queryFn: async () => {
      const response = await apiClient.get<EmploymentType[]>('/employment-types/');
      return response.data;
    },
  });
};

export const useEmploymentType = (id: number) => {
  return useQuery({
    queryKey: ['employment-types', id],
    queryFn: async () => {
      const response = await apiClient.get<EmploymentType>(`/employment-types/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateEmploymentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmploymentTypeCreate) => {
      const response = await apiClient.post<EmploymentType>('/employment-types/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employment-types'] });
    },
  });
};

export const useUpdateEmploymentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EmploymentTypeUpdate }) => {
      const response = await apiClient.patch<EmploymentType>(`/employment-types/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employment-types'] });
    },
  });
};

export const useDeleteEmploymentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/employment-types/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employment-types'] });
    },
  });
};
