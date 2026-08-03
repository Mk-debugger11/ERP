import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Employee, EmployeeCreate, EmployeeUpdate } from '../types';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await apiClient.get<Employee[]>('/employees/');
      return response.data;
    },
  });
};

export const useEmployee = (id: number) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: async () => {
      const response = await apiClient.get<Employee>(`/employees/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmployeeCreate) => {
      const response = await apiClient.post<Employee>('/employees/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EmployeeUpdate }) => {
      const response = await apiClient.patch<Employee>(`/employees/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/employees/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
