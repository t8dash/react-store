import { createContext } from "react";
import { Store } from "../../../index.ts";

export const AppContext = createContext(new Store({ counter: 0 }));
