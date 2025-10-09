import { create } from 'zustand'

interface MemberState {
  membership: any | null
  setMembership: (membership: any) => void
  clearMembership: () => void
}

export const useMemberStore = create<MemberState>((set) => ({
  membership: null,
  setMembership: (membership) => set({ membership }),
  clearMembership: () => set({ membership: null }),
}))
