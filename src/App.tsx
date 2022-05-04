import React, { useLayoutEffect, useState } from "react";
import { evaluate } from "./api";
import "./App.css";
import Readline from "./components/Readline";
import Scrollback, { ScrollbackEntry } from "./components/Scrollback";
import { makeid } from "./util";

const contextId = makeid(10);

function App() {
  const [scrollbackData, setScrollbackData] = useState<ScrollbackEntry[]>([]);
  function onEval(code: string) {
    // Add just the code for now, along with a promise that
    // resolves with the value.
    const data = { code, id: makeid(10) };
    const newScrollback = [...scrollbackData, data];
    setScrollbackData(newScrollback);
    evaluate(code, contextId).then((heap) =>
      setScrollbackData((scrollbackData) => {
        return scrollbackData.map((sd) =>
          "id" in sd && sd.id === data.id ? { code: sd.code, result: heap } : sd
        );
      })
    );
  }

  // when new data comes in, scroll to show it
  useLayoutEffect(
    () => window.scrollTo(0, document.body.scrollHeight),
    [scrollbackData]
  );

  return (
    <div className="App">
      <Scrollback entries={scrollbackData} />
      <Readline onEval={onEval} />
    </div>
  );
}

export default App;
