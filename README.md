# T8 React Store

*Bare essentials for shared state management in React apps*

[![npm](https://img.shields.io/npm/v/@t8/react-store?labelColor=345&color=46e)](https://www.npmjs.com/package/@t8/react-store) ![Lightweight](https://img.shields.io/bundlephobia/minzip/@t8/react-store?label=minzip&labelColor=345&color=46e) ![CSR ✓](https://img.shields.io/badge/CSR-✓-345?labelColor=345) ![SSR ✓](https://img.shields.io/badge/SSR-✓-345?labelColor=345)

```diff
+ let store = new Store(0);

  let Counter = () => {
-   let [counter, setCounter] = useState(0);
+   let [counter, setCounter] = useStore(store);

    let handleClick = () => {
      setCounter(value => value + 1);
    };

    return <button onClick={handleClick}>+ {counter}</button>;
  };
```

- Similar to `useState()`
- No boilerplate
- Quick transition from local state
- Easily integrates with Immer
- SSR- and CSR-compatible

Installation: `npm i @t8/react-store`

## Shared state setup

Moving the local state to the full-fledged shared state:

```diff
+ import { Store, useStore } from "@t8/react-store";
+
+ let counterStore = new Store(0);

  let Counter = () => {
-   let [counter, setCounter] = useState(0);
+   let [counter, setCounter] = useStore(counterStore);

    let handleClick = () => {
      setCounter(value => value + 1);
    };

    return <button onClick={handleClick}>+ {counter}</button>;
  };

  let ResetButton = () => {
-   let [, setCounter] = useState(0);
+   let [, setCounter] = useStore(counterStore, false);

    let handleClick = () => {
      setCounter(0);
    };

    return <button onClick={handleClick}>×</button>;
  };

  let App = () => <><Counter/>{" "}<ResetButton/></>;
```

[Live counter demo](https://codesandbox.io/p/sandbox/szhdnw?file=%252Fsrc%252FApp.tsx)<br>
[Tic-tac-toe](https://codesandbox.io/p/sandbox/tq852v?file=%252Fsrc%252FApp.tsx)

🔹 The shared state setup shown above is very similar to `useState()` allowing for quick migration from local state to shared state or the other way around.

🔹 The `false` parameter in `useStore(store, false)` (as in `<ResetButton>` above) tells the hook not to subscribe the component to tracking the store state updates. The common use case is when a component makes use of the store state setter without using the store state value.

🔹 Similarly to instances of the built-in data container classes, such as `Set` and `Map`, stores are created as `new Store(data)` rather than with a factory function.

## Single store or multiple stores

An application can have as many stores as needed.

🔹 Splitting data into multiple stores is one of the strategies to maintain more targeted subscriptions to data changes in components. The other strategy is filtering store updates at the component level, which is discussed below.

## Filtering store updates

When only the store state setter is required, without the store state value, we can opt out from subscription to store state changes by passing `false` as the parameter of `useStore()`:

```js
let [, setState] = useState(store, false);
```

Apart from a boolean, `useStore(store, shouldUpdate)` accepts a function of `(nextState, prevState) => boolean` as the second parameter to filter store updates to respond to:

```jsx
import { useStore } from "@t8/react-store";

let ItemCard = ({ id }) => {
  // Definition of changes in the item
  let hasRelevantUpdates = useCallback((nextItems, prevItems) => {
    // Assuming that items have a `revision` property
    return nextItems[id].revision !== prevItems[id].revision;
  }, [id]);

  let [items, setItems] = useStore(itemStore, hasRelevantUpdates);

  return (
    // Content
  );
};
```

## Providing shared state

Shared state can be provided to the app by means of a regular React Context provider:

```diff
+ import { createContext, useContext } from "react";
  import { Store, useStore } from "@t8/react-store";

- let counterStore = new Store(0);
+ let AppContext = createContext(new Store(0));

  let Counter = () => {
-   let [counter, setCounter] = useStore(counterStore);
+   let [counter, setCounter] = useStore(useContext(AppContext));

    // Rendering
  };

  let App = () => (
-   <>
+   <AppContext.Provider value={new Store(42)}>
      <PlusButton/>{" "}<Display/>
+   </AppContext.Provider>
-   </>
  );
```

[Live counter demo with Context](https://codesandbox.io/p/sandbox/rtng37?file=%2Fsrc%2FPlusButton.jsx)

🔹 In a multi-store setup, stores can be located in a single Context or split across multiple Contexts, just like any application data.

```jsx
import { createContext, useContext } from "react";
import { Store, useStore } from "@t8/react-store";

// Multiple stores in a single Context
let AppContext = createContext({
  users: new Store(/* ... */),
  items: new Store(/* ... */),
});

let ItemCard = ({ id }) => {
  let [items, setItems] = useStore(useContext(AppContext).items);

  // Rendering
};
```

🔹 Note that updating the store state doesn't change the store reference sitting in the React Context and therefore doesn't cause updates of the entire Context. Only the components subscribed to updates in the particular store by means of `useStore(store)` will be notified to re-render.

## Store data

A store can contain data of any type. With TypeScript, the type of a store containing data of type `T` is `Store<T>` which can be inferred from the data passed to `new Store(data)`.

Live demos:<br>
[Primitive value state](https://codesandbox.io/p/sandbox/rtng37?file=%2Fsrc%2FPlusButton.jsx)<br>
[Object value state](https://codesandbox.io/p/sandbox/y7wt2j?file=%2Fsrc%2FPlusButton.jsx)

## With Immer

Immer can be used with `useStore()` just the same way as [with `useState()`](https://immerjs.github.io/immer/example-setstate#usestate--immer) to facilitate deeply nested data changes.

[Live demo with Immer](https://codesandbox.io/p/sandbox/rn4qsr?file=%2Fsrc%2FPlusButton.jsx)

## Shared loading state

The ready-to-use hook from the [T8 React Pending](https://github.com/t8js/react-pending) package helps manage shared async action state without disturbing the app's state management and actions' code.

## Remount-persistent state

A standalone store initialized outside a component can be used by the component as remount-persistent state, whether used by other components or not.
