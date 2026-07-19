import { create } from "zustand";

interface PreferencesState {
  reduceMotion: boolean;
  soundsEnabled: boolean;
  hapticsEnabled: boolean;
  setReduceMotion: (value: boolean) => void;
  setSoundsEnabled: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  reduceMotion: false,
  soundsEnabled: true,
  hapticsEnabled: true,
  setReduceMotion: (value) => set({ reduceMotion: value }),
  setSoundsEnabled: (value) => set({ soundsEnabled: value }),
  setHapticsEnabled: (value) => set({ hapticsEnabled: value }),
}));
