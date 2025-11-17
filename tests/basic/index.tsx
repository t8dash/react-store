import { createRoot } from "react-dom/client";
import { Store, useStore } from "../../index.ts";

let counterStore = new Store(0);

let Counter = () => {
  let [counter, setCounter] = useStore(counterStore);

  let handleClick = () => {
    setCounter((value) => value + 1);
  };

  return <button onClick={handleClick}>+ {counter}</button>;
};

let ResetButton = () => {
  let [, setCounter] = useStore(counterStore, false);

  let handleClick = () => {
    setCounter(0);
  };

  return <button onClick={handleClick}>×</button>;
};

let App = () => (
  <>
    <Counter /> <ResetButton />
  </>
);

createRoot(document.querySelector("#app")!).render(<App />);
