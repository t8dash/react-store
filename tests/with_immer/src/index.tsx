import { createRoot } from "react-dom/client";
import { Store } from "../../..";
import { App } from "./App";
import { AppContext } from "./AppContext";

createRoot(document.querySelector("#app")!).render(
  <AppContext.Provider value={new Store({ counter: 42 })}>
    <App />
  </AppContext.Provider>,
);
