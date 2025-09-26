import { createContext } from "react";
import { Store } from "../../..";

export const AppContext = createContext(new Store({ counter: 0 }));
