import React, { createContext, useContext, PropsWithChildren } from "react";
import { AuthStore } from "../modules/auth/dal";
import { TaskStore } from "../modules/tasks/dal";

interface IRootStore {
  AuthStore: AuthStore;
  TaskStore: TaskStore;
}

export const createStore = (): IRootStore => ({
  AuthStore: new AuthStore(),
  TaskStore: new TaskStore()
});

export const StoresContext = createContext<IRootStore | null>(null);

export const useStores = (): IRootStore => {
  const stores = useContext(StoresContext);

  if (!stores) {
    throw new Error(
      "useStores() следует использовать внутри <StoresContext.provider />"
    );
  }

  return stores;
};

export const StoresProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const stores = createStore();

  return (
    <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
  );
};
