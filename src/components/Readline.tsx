import React, { ChangeEvent, useState, KeyboardEvent, useRef } from "react";
import { useLocalStorage } from "../util";
import "./Readline.css";

function useHistory() {
  const [records, updateRecords] = useLocalStorage<string[]>(
    "readline-history",
    []
  );
  const [cursor, setCursor] = useState(-1);
  function prev() {
    const newCursor = Math.min(cursor + 1, records.length);
    setCursor(newCursor);
    return records[newCursor] || "";
  }

  function next() {
    const newCursor = Math.max(cursor - 1, -1);
    setCursor(newCursor);
    return records[newCursor] || "";
  }

  function add(code: string) {
    updateRecords([code, ...records]);
    setCursor(-1);
  }

  return {
    prev,
    next,
    add,
  };
}

export interface ReadlineProps {
  onEval(expr: string): any;
}
export default function Readline({ onEval }: ReadlineProps) {
  const [expr, setExpr] = useState("");
  const history = useHistory();
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const height = expr.split("\n").length * 1.5;

  function valueChanged(evt: ChangeEvent<HTMLTextAreaElement>) {
    setExpr(evt.target.value);
  }
  function keydown(evt: KeyboardEvent<HTMLTextAreaElement>) {
    const cursor = textarea.current?.selectionStart;
    if (evt.key === "Enter" && !evt.shiftKey) {
      if (expr === "") return;

      setExpr("");
      onEval(expr);
      history.add(expr);
      evt.preventDefault();
    } else if (evt.key === "Up" || evt.key === "ArrowUp") {
      if (cursor !== undefined && expr.slice(0, cursor).includes("\n")) {
        // arrowing throw multi-line code, disregard
        return;
      }
      setExpr(history.prev());
    } else if (evt.key === "Down" || evt.key === "ArrowDown") {
      if (cursor !== undefined && expr.includes("\n", cursor)) {
        // arrowing throw multi-line code, disregard
        return;
      }
      setExpr(history.next());
    }
  }
  return (
    <div className="readline-wrapper">
      <textarea
        id="readline"
        ref={textarea}
        value={expr}
        onChange={valueChanged}
        onKeyDown={keydown}
        style={{ height: `${height}em` }}
        spellCheck="false"
      ></textarea>
    </div>
  );
}
