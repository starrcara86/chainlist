import create from "zustand";

export const useChain = create((set) => ({
  chainId: null,
  updateChain: (chainId) => set(() => ({ chainId })),
}));

export const useRpcStore = create((set) => ({
  rpcs: [],
  addRpc: (rpcUrl) => set((state) => ({ rpcs: [...state.rpcs, rpcUrl] })),
}));
