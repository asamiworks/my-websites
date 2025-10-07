'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';

export function useChildren() {
  const { user } = useAuthStore();
  const {
    children,
    loading,
    error,
    fetchChildren,
    addChild,
    editChild,
    removeChild,
    verifyPin,
    setCurrentChild,
    clearCurrentChild,
    clearError
  } = useProfileStore();

  useEffect(() => {
    if (user) {
      fetchChildren(user.id);
    }
  }, [user, fetchChildren]);

  return {
    children,
    loading,
    error,
    createChild: (data: any) => addChild(user?.id || '', data),
    updateChild: editChild,
    deleteChild: removeChild,
    verifyPin,
    setCurrentChild,
    clearCurrentChild,
    clearError
  };
}