import { useContext } from "react";
import { useStore } from "../../..";
import { AppContext } from "./AppContext";

export const Display = () => {
  const [counter] = useStore(useContext(AppContext));

  return <span>{counter}</span>;
};
