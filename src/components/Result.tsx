import { useState } from "react";
import { Heap, ID } from "../api";
import { assertUnreachable } from "../util";
import "./Result.css";

export interface ResultProps {
  heap: Heap;
  id: ID;
  isKey?: boolean;
}
export default function Result({ heap, id, isKey }: ResultProps): JSX.Element {
  const root = heap[id || 0];
  if (root.type === "number") return <>{root.value}</>;
  if (root.type === "string") {
    // TODO: what about really long strings?
    if (isKey) return <>{root.value}</>; // skip quotes
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
    return <ObjectDisplay heap={heap} id={id} />;
  }
  if (root.type === "array") {
    return <ArrayDisplay heap={heap} id={id} />;
  }
  if (root.type === "thrown-error") {
    return <span className="thrown-error">Error: {root.value}</span>;
  }
  try {
    assertUnreachable(root);
  } catch (err) {
    return <pre>TODO {JSON.stringify(root, null, 2)}</pre>;
  }
}

function ObjectDisplay({ heap, id }: ResultProps): JSX.Element {
  const obj = heap[id];
  const [expanded, setExpanded] = useState(false);
  if (obj.type !== "object") return <></>; // tell TS what type we're working with
  return (
    <>
      <button
        className="expand-collapse"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "▼" : "▶"}
      </button>

      <span className="syntax">{"{ "}</span>
      {obj.value.map(({ key, value }, ix) => {
        return (
          <span key={key}>
            <Result heap={heap} id={key} isKey />
            <span className="syntax">: </span>
            <Result heap={heap} id={value} />
            {ix < obj.value.length - 1 ? (
              <span className="syntax">, </span>
            ) : null}
          </span>
        );
      })}
      <span className="syntax">{" }"}</span>
      {expanded ? <ExpandedObject heap={heap} id={id} indent={1} /> : null}
    </>
  );
}

function ArrayDisplay({ heap, id }: ResultProps): JSX.Element {
  const obj = heap[id];
  const [expanded, setExpanded] = useState(false);
  if (obj.type !== "array") return <></>; // tell TS what type we're working with
  return (
    <>
      <button
        className="expand-collapse"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "▼" : "▶"}
      </button>
      <span className="syntax">{"[ "}</span>
      {obj.value.map((entryId, ix) => {
        return (
          <span key={ix}>
            <Result heap={heap} id={entryId} />
            {ix < obj.value.length - 1 ? (
              <span className="syntax">, </span>
            ) : null}
          </span>
        );
      })}
      <span className="syntax">{" ]"}</span>
      {expanded ? <ExpandedArray heap={heap} id={id} indent={1} /> : null}
    </>
  );
}

interface ExpandedEntryProps extends ResultProps {
  indent: number;
}
function ExpandedArray({ heap, id, indent }: ExpandedEntryProps): JSX.Element {
  const obj = heap[id];
  if (obj.type !== "array") return <></>;

  return (
    <div className="expanded-array" style={{ paddingLeft: `${indent}em` }}>
      {obj.value.map((entryId, ix) => {
        return (
          <div key={ix}>
            <span className="key">{ix}: </span>
            <Result heap={heap} id={entryId} />
          </div>
        );
      })}
    </div>
  );
}

function ExpandedObject({ heap, id, indent }: ExpandedEntryProps): JSX.Element {
  const obj = heap[id];
  if (obj.type !== "object") return <></>;

  return (
    <div className="expanded-array" style={{ paddingLeft: `${indent}em` }}>
      {obj.value.map(({ key, value }, ix) => {
        return (
          <div key={key}>
            <Result heap={heap} id={key} isKey />
            <span className="syntax">: </span>
            <Result heap={heap} id={value} />
          </div>
        );
      })}
    </div>
  );
}
