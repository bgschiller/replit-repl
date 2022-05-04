import React, { useState } from "react";
import { evaluate } from "./api";
import "./App.css";
import Readline from "./components/Readline";
import Scrollback, {
  OnResultFunc,
  ScrollbackEntry,
  ScrollbackEntryProps,
} from "./components/Scrollback";
import { makeid } from "./util";

const contextId = makeid(10);

function App() {
  const [scrollbackData, setScrollbackData] = useState<ScrollbackEntry[]>([]);
  function onEval(code: string) {
    // Add just the code for now, along with a promise that
    // resolves with the value.
    const data = { code, id: makeid(10), pending: evaluate(code, contextId) };
    const newScrollback = [...scrollbackData, data];
    setScrollbackData(newScrollback);
  }
  const onResult: OnResultFunc = (id, heap) => {
    setScrollbackData(
      scrollbackData.map((sd) =>
        "id" in sd && sd.id === id ? { code: sd.code, result: heap } : sd
      )
    );
  };
  return (
    <div className="App">
      <Scrollback entries={scrollbackData} onResult={onResult} />
      <Readline onEval={onEval} />
    </div>
  );
}

export default App;
