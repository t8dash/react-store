import { useContext } from "react";
import { useStore } from "../../..";
import { AppContext } from "./AppContext";

export const Display = () => {
  const [state] = useStore(useContext(AppContext));

  return <span>{state.counter}</span>;
};
