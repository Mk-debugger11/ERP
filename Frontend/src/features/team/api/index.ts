import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Team, TeamCreate, TeamUpdate } from '../types';

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await apiClient.get<Team[]>('/teams/');
      return response.data;
    },
  });
};

export const useTeam = (id: number) => {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: async () => {
      const response = await apiClient.get<Team>(`/teams/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TeamCreate) => {
      const response = await apiClient.post<Team>('/teams/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TeamUpdate }) => {
      const response = await apiClient.patch<Team>(`/teams/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/teams/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
