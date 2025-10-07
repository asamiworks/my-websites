import { create } from 'zustand';
import {
  createChild,
  getChildren,
  getChild,
  updateChild,
  deleteChild,
  verifyChildPin,
  updateLastActive,
} from '@/lib/firebase/children';
import type { Child, AvatarType, CreateChildData, UpdateChildData, ChildFormData } from '@/types/children';

interface ProfileState {
  children: Child[];
  currentChild: Child | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchChildren: (parentId: string) => Promise<void>;
  addChild: (parentId: string, data: CreateChildData) => Promise<void>;
  editChild: (childId: string, data: UpdateChildData) => Promise<void>;
  removeChild: (childId: string) => Promise<void>;
  verifyPin: (childId: string, pin: string) => Promise<boolean>;
  setCurrentChild: (childId: string) => Promise<void>;
  clearCurrentChild: () => void;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  children: [],
  currentChild: null,
  loading: false,
  error: null,

  fetchChildren: async (parentId) => {
    try {
      set({ loading: true, error: null });
      const children = await getChildren(parentId);
      set({ children, loading: false });
    } catch (error: any) {
      console.error('[ProfileStore] fetchChildren error:', error);
      set({ error: error.message, loading: false });
    }
  },

  addChild: async (parentId, data) => {
    try {
      set({ loading: true, error: null });
      const child = await createChild(parentId, data);
      set((state) => ({
        children: [...state.children, child],
        loading: false,
      }));
    } catch (error: any) {
      console.error('[ProfileStore] addChild error:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  editChild: async (childId, data) => {
    try {
      set({ loading: true, error: null });
      await updateChild(childId, data);

      // ローカル状態を更新
      const updatedChild = await getChild(childId);
      if (updatedChild) {
        set((state) => ({
          children: state.children.map((c) =>
            c.id === childId ? updatedChild : c
          ),
          loading: false,
        }));
      }
    } catch (error: any) {
      console.error('[ProfileStore] editChild error:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  removeChild: async (childId) => {
    try {
      set({ loading: true, error: null });
      await deleteChild(childId);
      set((state) => ({
        children: state.children.filter((c) => c.id !== childId),
        loading: false,
      }));
    } catch (error: any) {
      console.error('[ProfileStore] removeChild error:', error);
      set({ error: error.message, loading: false });
    }
  },

  verifyPin: async (childId, pin) => {
    try {
      const isValid = await verifyChildPin(childId, pin);
      return isValid;
    } catch (error: any) {
      console.error('[ProfileStore] verifyPin error:', error);
      set({ error: error.message });
      return false;
    }
  },

  setCurrentChild: async (childId) => {
    try {
      const child = await getChild(childId);
      if (child) {
        await updateLastActive(childId);
        set({ currentChild: child });
      }
    } catch (error: any) {
      console.error('[ProfileStore] setCurrentChild error:', error);
      set({ error: error.message });
    }
  },

  clearCurrentChild: () => {
    set({ currentChild: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));