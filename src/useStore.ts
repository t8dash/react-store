import {isStore, type Store} from '@t8/store';
import {useEffect, useMemo, useRef, useState} from 'react';

export type SetStoreState<T> = Store<T>['setState'];
export type ShouldUpdateCallback<T> = (nextState: T, prevState: T) => boolean;
export type ShouldUpdate<T> = boolean | ShouldUpdateCallback<T>;

export function useStore<T>(
    store: Store<T>,
    /**
     * Controls whether the component should be updated in response
     * to the store updates.
     *
     * @defaultValue `true`
     *
     * Can be set to `false` when the component only requires the
     * store state setter but not the state value itself, and so the
     * component doesn't need to respond to updates in the store state.
     *
     * ```ts
     * let [, setValue] = useStore(store, false);
     * ```
     *
     * Can be set to a function `(nextState, prevState) => boolean` to
     * make the component respond only to specific store state changes.
     */
    shouldUpdate: ShouldUpdate<T> = true,
): [T, SetStoreState<T>] {
    if (!isStore(store)) throw new Error("'store' is not an instance of Store");

    let [, setRevision] = useState(-1);
    let initedRef = useRef(false);

    let state = store.getState();
    let setState = useMemo(() => store.setState.bind(store), [store]);
    let initialStoreRevision = useRef(store.revision);

    useEffect(() => {
        if (!shouldUpdate) return;

        let unsubscribe = store.onUpdate((nextState, prevState) => {
            if (
                typeof shouldUpdate !== 'function' ||
                shouldUpdate(nextState, prevState)
            )
                setRevision(Math.random());
        });

        // Trigger a rerender if the store state changed after the component
        // last read it and before the component subscribed to its changes.
        if (!initedRef.current) {
            initedRef.current = true;

            if (store.revision !== initialStoreRevision.current)
                setRevision(Math.random());
        }

        return () => {
            unsubscribe();
            initedRef.current = false;
            initialStoreRevision.current = store.revision;
        };
    }, [store, shouldUpdate]);

    return [state, setState];
}
