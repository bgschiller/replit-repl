import React, { ChangeEvent, useEffect, useState, KeyboardEvent } from "react";
import "./Readline.css";

export interface ReadlineProps {
  onEval(expr: string): any;
}
export default function Readline({ onEval }: ReadlineProps) {
  const [expr, setExpr] = useState("");
  const [height, setHeight] = useState(1);
  useEffect(() => {
    setHeight(expr.split("\n").length * 1.5);
  }, [expr]);
  function valueChanged(evt: ChangeEvent<HTMLTextAreaElement>) {
    setExpr(evt.target.value);
  }
  function keydown(evt: KeyboardEvent<HTMLTextAreaElement>) {
    if (evt.key === "Enter" && !evt.shiftKey) {
      setExpr("");
      onEval(expr);
      evt.preventDefault();
    }
  }
  return (
    <div className="readline-wrapper">
      <textarea
        id="readline"
        value={expr}
        onChange={valueChanged}
        onKeyDown={keydown}
        style={{ height: `${height}em` }}
        spellCheck="false"
      ></textarea>
    </div>
  );
}
