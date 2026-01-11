import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, Role } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.dapatkanSemuaUser();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSantri() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['allSantri'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.dapatkanSemuaSantri();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, profile }: { principal: Principal; profile: UserProfile }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.tambahUser(principal, profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['allSantri'] });
    },
  });
}

export function useEditUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, profile }: { principal: Principal; profile: UserProfile }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editUser(principal, profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['allSantri'] });
    },
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.hapusUser(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['allSantri'] });
    },
  });
}

export function useVerifySantriAccess() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['verifySantriAccess'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.verifySantriAccess();
    },
    enabled: !!actor && !isFetching,
  });
}
