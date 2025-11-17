import { useContext } from "react";
import { useStore } from "../../../index.ts";
import { AppContext } from "./AppContext.ts";

export const PlusButton = () => {
  // We're not using the store state value here, so the subscription
  // to its updates is not required, hence the `false` parameter.
  const [, setCounter] = useStore(useContext(AppContext), false);

  const handleClick = () => {
    setCounter((value) => value + 1);
  };

  return <button onClick={handleClick}>+</button>;
};
