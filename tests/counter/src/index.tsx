import { createRoot } from "react-dom/client";
import { Store } from "../../../index.ts";
import { App } from "./App.tsx";
import { AppContext } from "./AppContext.ts";

createRoot(document.querySelector("#app")!).render(
  <AppContext.Provider value={new Store(42)}>
    <App />
  </AppContext.Provider>,
);
