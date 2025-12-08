import { isPersistentStore, isStore, type Store } from "@t8/store";
import { useEffect, useMemo, useRef, useState } from "react";

export type SetStoreState<T> = Store<T>["setState"];
export type ShouldUpdateCallback<T> = (nextState: T, prevState: T) => boolean;
export type ShouldUpdate<T> = boolean | ShouldUpdateCallback<T>;

/**
 * Returns the state value of `store` passed as the parameter and
 * a function to update the store state value.
 *
 * @example
 * ```js
 * let [value, setValue] = useStore(store);
 * ```
 *
 * The optional second parameter `shouldUpdate` controls whether
 * the component using this hook should be updated in response to
 * the store updates, which is set to `true` by default.
 *
 * `shouldUpdate` can be set to `false` to prevent subscription
 * to the store updates. Use case: if the component only requires
 * the store state setter but not the store state value, the
 * component may not need to respond to the store updates at all:
 *
 * @example
 * ```js
 * let [, setValue] = useStore(store, false);
 * ```
 *
 * `shouldUpdate` can also be a function `(nextState, prevState) => boolean`
 * to make the component respond only to specific store state changes,
 * when this function returns `true`.
 */
export function useStore<T>(
  store: Store<T>,
  shouldUpdate: ShouldUpdate<T> = true,
): [T, SetStoreState<T>] {
  if (!isStore<T>(store))
    throw new Error("'store' is not an instance of Store");

  let [, setRevision] = useState(-1);

  let state = store.getState();
  let setState = useMemo(() => store.setState.bind(store), [store]);
  let initialStoreRevision = useRef(store.revision);

  useEffect(() => {
    if (isPersistentStore<T>(store)) store.syncOnce();

    if (!shouldUpdate) return;

    let unsubscribe = store.onUpdate((nextState, prevState) => {
      if (
        typeof shouldUpdate !== "function" ||
        shouldUpdate(nextState, prevState)
      )
        setRevision(Math.random());
    });

    if (store.revision !== initialStoreRevision.current)
      setRevision(Math.random());

    return () => {
      unsubscribe();
      initialStoreRevision.current = store.revision;
    };
  }, [store, shouldUpdate]);

  return [state, setState];
}
