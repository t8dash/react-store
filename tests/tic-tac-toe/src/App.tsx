import { createContext, useContext } from "react";
import { Store, useStore } from "../../..";

// UI state
type State = {
  moves: number[];
  lastMoveIndex: number;
};

// Game status derived from the UI state
type Status = {
  value: "win" | "draw" | "playing";
  win?: number[];
};

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellValues = ["❌", "⭕"];
// const cellValues = ["🍒", "🍄"];
// const cellValues = ["🦄", "✨"];

function getStatus(state: State): Status {
  let moves = state.moves.slice(0, state.lastMoveIndex + 1);

  if (moves.length > 4) {
    for (let win of wins) {
      let index = moves.indexOf(win[0]);

      if (
        index !== -1 &&
        moves.indexOf(win[1]) % 2 === index % 2 &&
        moves.indexOf(win[2]) % 2 === index % 2
      )
        return { value: "win", win };
    }

    // No win, no more moves
    if (moves.length === 9) return { value: "draw" };
  }

  return { value: "playing" };
}

let AppContext = createContext(
  new Store<State>({ moves: [], lastMoveIndex: -1 })
);

let Cell = ({ index, selected }: { index: number; selected?: boolean }) => {
  let [state, setState] = useStore(useContext(AppContext));

  // Checking whether the cell index is already among the past moves
  let moveIndex = state.moves.lastIndexOf(index, state.lastMoveIndex);

  let handleClick = () => {
    if (moveIndex === -1)
      setState(({ moves, lastMoveIndex }) => ({
        moves: [...moves.slice(0, lastMoveIndex + 1), index],
        lastMoveIndex: lastMoveIndex + 1,
      }));
  };

  return (
    <button className={selected ? "selected" : undefined} onClick={handleClick}>
      {moveIndex === -1 ? "" : cellValues[moveIndex % 2]}
    </button>
  );
};

let indices = Array.from({ length: 9 }).fill(0);

let Board = () => {
  let [state] = useStore(useContext(AppContext));
  let { value: status, win } = getStatus(state);

  return (
    <fieldset className="board" disabled={status !== "playing"}>
      {indices.map((_, i) => (
        <Cell index={i} key={i} selected={win?.includes(i)} />
      ))}
    </fieldset>
  );
};

let History = () => {
  let [state, setState] = useStore(useContext(AppContext));

  let jumpTo = (moveIndex: number) => {
    setState((state) => ({
      ...state,
      lastMoveIndex: moveIndex,
    }));
  };

  return (
    <ul className="history">
      {state.moves.map((_, i) => (
        <li className={i === state.lastMoveIndex ? "selected" : undefined}>
          <button onClick={() => jumpTo(i)}>
            Go to move {i + 1} [{cellValues[i % 2]}]
          </button>
        </li>
      ))}
    </ul>
  );
};

let Controls = () => {
  let [, setState] = useStore(useContext(AppContext), false);

  let restart = () => {
    setState({ moves: [], lastMoveIndex: -1 });
  };

  return (
    <p className="controls">
      <button onClick={restart}>Restart</button>
    </p>
  );
};

let StatusBar = () => {
  let [state] = useStore(useContext(AppContext));

  return <p className="status">{getStatus(state).value}</p>;
};

export let App = () => (
  <>
    <Board />
    <StatusBar />
    <Controls />
    <History />
  </>
);
