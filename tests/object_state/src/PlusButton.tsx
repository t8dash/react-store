import { useContext } from "react";
import { useStore } from "../../..";
import { AppContext } from "./AppContext";

export const PlusButton = () => {
  // We're not using the store state value here, so the subscription
  // to its updates is not required, hence the `false` parameter.
  const [, setState] = useStore(useContext(AppContext), false);

  const handleClick = () => {
    setState((prevState) => ({
      ...prevState,
      counter: prevState.counter + 1,
    }));
  };

  return <button onClick={handleClick}>+</button>;
};
