import { create } from 'zustand';

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  status: 'PENDING' | 'EXTRACTING_TEXT' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  generatedPaper?: any;
}

interface AppState {
  assignments: Assignment[];
  setAssignments: (assignments: Assignment[]) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  assignments: [],
  setAssignments: (assignments) => set({ assignments }),
  updateAssignment: (id, updates) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a._id === id ? { ...a, ...updates } : a
      ),
    })),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
