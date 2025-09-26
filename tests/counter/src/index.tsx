import { createRoot } from "react-dom/client";
import { Store } from "../../..";
import { AppContext } from "./AppContext";
import { App } from "./App";

createRoot(document.querySelector("#app")!).render(
  <AppContext.Provider value={new Store(42)}>
    <App />
  </AppContext.Provider>
);
