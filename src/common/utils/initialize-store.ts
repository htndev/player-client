export type InitializeStore = { initialize(): Promise<void> };

export const initialize = async (...modules: InitializeStore[]) => {
  for (const module of modules) {
    await module.initialize();
  }
};
