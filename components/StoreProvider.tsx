"use client";

import { createContext, FC, useReducer } from "react";
import { UserType } from "./hocs/withAuth";

interface StoreProps {
  activeUser: UserType | null;
  modalState: boolean;
}

const initialState: StoreProps = {
  activeUser: null,
  modalState: false,
};

export const store = createContext<{
  state: StoreProps;
  dispatch: (t: ActionType) => void;
}>({ state: initialState, dispatch: () => null });

export enum ActionTypes {
  UpdateUser = "updateUser",
  SetModalState = "setModalState",
}

type ActionType =
  | { type: ActionTypes.UpdateUser; payload: UserType | null }
  | { type: ActionTypes.SetModalState; payload: boolean };

const reducer = (state: StoreProps, action: ActionType): StoreProps => {
  switch (action.type) {
    case ActionTypes.UpdateUser:
      return { ...state, activeUser: action.payload };
    case ActionTypes.SetModalState:
      return { ...state, modalState: action.payload };
    default:
      return state;
  }
};

const StoreProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { Provider } = store;
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export default StoreProvider;