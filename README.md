[![npm](https://flat.badgen.net/npm/v/@t8/react-store?labelColor=345&color=46e)](https://www.npmjs.com/package/@t8/react-store) ![Lightweight](https://flat.badgen.net/bundlephobia/minzip/@t8/react-store/?label=minzip&labelColor=345&color=46e) ![TypeScript ✓](https://flat.badgen.net/badge/TypeScript/✓?labelColor=345&color=345) ![CSR ✓](https://flat.badgen.net/badge/CSR/✓?labelColor=345&color=345) ![SSR ✓](https://flat.badgen.net/badge/SSR/✓?labelColor=345&color=345)

# @t8/react-store

*Concise shared state management for React apps*

- Similar to `useState()`
- No boilerplate
- Painless transition from local state to shared state and vice versa
- SSR-compatible

Installation: `npm i @t8/react-store`

## Shared state setup

Moving the local state to the full-fledged shared state:

```diff
  import { createContext, useContext } from "react";
+ import { Store, useStore } from "@t8/react-store";
+
+ let AppContext = createContext(new Store(0));

  let Counter = () => {
-   let [counter, setCounter] = useState(0);
+   let [counter, setCounter] = useStore(useContext(AppContext));

    let handleClick = () => {
      setCounter(value => value + 1);
    };

    return <button onClick={handleClick}>{counter}</button>;
  };

  let ResetButton = () => {
-   let [, setCounter] = useState(0);
+   let [, setCounter] = useStore(useContext(AppContext), false);

    let handleClick = () => {
      setCounter(0);
    };

    return <button onClick={handleClick}>×</button>;
  };

  let App = () => <><Counter/>{" "}<ResetButton/></>;
```

[Live counter demo](https://codesandbox.io/p/sandbox/rtng37?file=%2Fsrc%2FPlusButton.jsx)<br>
[Tic-tac-toe](https://codesandbox.io/p/sandbox/tq852v?file=%252Fsrc%252FApp.tsx)

🔹 The shared state setup shown above is very similar to `useState()` allowing for quick migration from local state to shared state or the other way around.

🔹 The `false` parameter in `useStore(store, false)` (as in `<ResetButton>` above) tells the hook not to subscribe the component to tracking the store state updates. The common use case is when a component makes use of the store state setter without using the store state value.

🔹 Note that updating the store state doesn't change the store reference sitting in the React Context and therefore doesn't cause updates of the entire React Context. Only the components subscribed to store state updates by means of `useStore()` will be notified to re-render.

## Single store or multiple stores

An application can have as many stores as needed, whether on a single React Context or multiple Contexts.

```js
let AppContext = createContext({
  users: new Store(/* ... */),
  items: new Store(/* ... */),
});
```

🔹 Splitting data into multiple stores helps maintain more targeted subscriptions to data changes in components.

## Filtering store updates

When only the store state setter is required, without the store state value, we can opt out from subscription to store state changes by passing `false` as the parameter of `useStore()`:

```js
let [, setState] = useState(store, false);
```

Apart from a boolean, `useStore(store, shouldUpdate)` can take a function of `(nextState, prevState) => boolean` as the second parameter to filter store updates to respond to:

```jsx
let ItemCard = ({ id }) => {
  // Definition of changes in the item
  let hasRelevantUpdates = useCallback((nextItems, prevItems) => {
    // Assuming that items have a `revision` property
    return nextItems[id].revision !== prevItems[id].revision;
  }, [id]);

  let [items, setItems] = useStore(
    useContext(AppContext).items,
    hasRelevantUpdates,
  );

  return (
    // Content
  );
};
```

## Providing shared state

Shared state can be provided to the app by means of a regular React Context provider:

```diff
  let App = () => (
-   <AppContext.Provider value={42}>
+   <AppContext.Provider value={new Store(42)}>
      <PlusButton/>{" "}<Display/>
    </AppContext.Provider>
  );
```

## Store data

A store can contain data of any type.

Live demos:<br>
[Primitive value state](https://codesandbox.io/p/sandbox/rtng37?file=%2Fsrc%2FPlusButton.jsx)<br>
[Object value state](https://codesandbox.io/p/sandbox/y7wt2j?file=%2Fsrc%2FPlusButton.jsx)

## With Immer

Immer can be used with `useStore()` just the same way as [with `useState()`](https://immerjs.github.io/immer/example-setstate#usestate--immer) to facilitate deeply nested data changes.

[Live demo with Immer](https://codesandbox.io/p/sandbox/rn4qsr?file=%2Fsrc%2FPlusButton.jsx)

## Shared loading state

The ready-to-use hook from the [T8 React Pending](https://github.com/t8js/react-pending) package helps manage shared async action state without disturbing the app's state management and actions' code.

## Standalone store

A store initialized outside a component can be used as the component's remount-persistent state.
