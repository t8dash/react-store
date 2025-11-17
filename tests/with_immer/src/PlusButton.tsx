import { produce } from "immer";
import { useContext } from "react";
import { useStore } from "../../../index.ts";
import { AppContext } from "./AppContext.ts";

export const PlusButton = () => {
  // We're not using the store state value here, so the subscription
  // to its updates is not required, hence the `false` parameter.
  const [, setState] = useStore(useContext(AppContext), false);

  const handleClick = () => {
    setState(
      produce((draft) => {
        // Immer makes the code of immutable state updates look like
        // direct mutations, which can facilitate manipulating nested data.
        draft.counter++;
      }),
    );
  };

  return <button onClick={handleClick}>+</button>;
};
