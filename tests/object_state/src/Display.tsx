import { useContext } from "react";
import { useStore } from "../../../index.ts";
import { AppContext } from "./AppContext.ts";

export const Display = () => {
  const [state] = useStore(useContext(AppContext));

  return <span>{state.counter}</span>;
};
