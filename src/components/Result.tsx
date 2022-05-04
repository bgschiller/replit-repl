import { useState } from "react";
import { Heap, ID } from "../api";
import { assertUnreachable } from "../util";
import "./Result.css";

export interface ResultProps {
  heap: Heap;
  id: ID;
  isKey?: boolean;
  depth: number;
}
export default function Result({
  heap,
  id,
  isKey,
  depth,
}: ResultProps): JSX.Element {
  const root = heap[id || 0];
  if (root.type === "number")
    return <span className="number">{root.value}</span>;
  if (root.type === "string") {
    // TODO: what about really long strings?
    if (isKey) return <span className="key">{root.value}</span>; // skip quotes
    return <>"{root.value}"</>;
  }
  if (root.type === "undefined") {
    return <span className="undefined">undefined</span>;
  }
  if (root.type === "null") {
    return <span className="null">null</span>;
  }
  if (root.type === "boolean") {
    return <span className="boolean">{JSON.stringify(root.value)}</span>;
  }
  if (root.type === "error") {
    return <span className="error">{root.value.message}</span>;
  }
  if (root.type === "object") {
    return <ObjectDisplay heap={heap} id={id} depth={depth - 1} />;
  }
  if (root.type === "array") {
    return <ArrayDisplay heap={heap} id={id} depth={depth - 1} />;
  }
  if (root.type === "thrown-error") {
    return <span className="thrown-error">Error: {root.value}</span>;
  }
  if (root.type === "function") {
    return <FunctionDisplay heap={heap} id={id} depth={depth - 1} />;
  }
  if (root.type === "regexp") {
    return (
      <span className="regex">
        <span className="syntax">/</span>
        {root.value.src}
        <span className="syntax">/</span>
        {root.value.flags}
      </span>
    );
  }
  try {
    assertUnreachable(root);
  } catch (err) {
    return <pre>TODO {JSON.stringify(root, null, 2)}</pre>;
  }
}

function FunctionDisplay({ heap, id, depth }: ResultProps): JSX.Element {
  const obj = heap[id];
  if (obj.type !== "function") return <></>;

  return (
    <span className="one-line function">
      {depth > 0 ? <pre>{obj.value.body}</pre> : <>ƒ(){"{ … }"}</>}
    </span>
  );
}

function ObjectDisplay({ heap, id, depth }: ResultProps): JSX.Element {
  const obj = heap[id];
  const [expanded, setExpanded] = useState(false);
  if (obj.type !== "object") return <></>; // tell TS what type we're working with
  return (
    <>
      <span className="one-line" onClick={() => setExpanded(!expanded)}>
        {depth > 0 ? (
          <>
            <button className="expand-collapse">{expanded ? "▼" : "▶"}</button>
            <span className="syntax">{"{ "}</span>
            {obj.value.map(({ key, value }, ix) => {
              return (
                <span key={key}>
                  <Result heap={heap} id={key} isKey depth={depth - 1} />
                  <span className="syntax">: </span>
                  <Result heap={heap} id={value} depth={depth - 1} />
                  {ix < obj.value.length - 1 ? (
                    <span className="syntax">, </span>
                  ) : null}
                </span>
              );
            })}
            <span className="syntax">{" }"}</span>
          </>
        ) : (
          "{…}"
        )}
      </span>

      {expanded ? <ExpandedObject heap={heap} id={id} depth={3} /> : null}
    </>
  );
}

function ArrayDisplay({ heap, id, depth }: ResultProps): JSX.Element {
  const obj = heap[id];
  const [expanded, setExpanded] = useState(false);
  if (obj.type !== "array") return <></>; // tell TS what type we're working with
  return (
    <>
      <span className="one-line" onClick={() => setExpanded(!expanded)}>
        {depth > 0 ? (
          <>
            <button className="expand-collapse">{expanded ? "▼" : "▶"}</button>

            <span className="syntax">{"[ "}</span>

            {obj.value.map((entryId, ix) => {
              return (
                <span key={ix}>
                  <Result heap={heap} id={entryId} depth={depth - 1} />
                  {ix < obj.value.length - 1 ? (
                    <span className="syntax">, </span>
                  ) : null}
                </span>
              );
            })}
            <span className="syntax">{" ]"}</span>
          </>
        ) : (
          <span className="summary">Array({obj.value.length})</span>
        )}
      </span>

      {expanded ? <ExpandedArray heap={heap} id={id} depth={3} /> : null}
    </>
  );
}

function ExpandedArray({ heap, id, depth }: ResultProps): JSX.Element {
  const obj = heap[id];
  if (obj.type !== "array") return <></>;

  return (
    <div className="expanded array">
      {obj.value.map((entryId, ix) => {
        return (
          <div key={ix}>
            <span className="key">{ix}: </span>
            <Result heap={heap} id={entryId} depth={depth - 1} />
          </div>
        );
      })}
    </div>
  );
}

function ExpandedObject({ heap, id, depth }: ResultProps): JSX.Element {
  const obj = heap[id];
  if (obj.type !== "object") return <></>;

  return (
    <div className="expanded object">
      {obj.value.map(({ key, value }, ix) => {
        return (
          <div key={key}>
            <Result heap={heap} id={key} isKey depth={depth - 1} />
            <span className="syntax">: </span>
            <Result heap={heap} id={value} depth={depth - 1} />
          </div>
        );
      })}
    </div>
  );
}
