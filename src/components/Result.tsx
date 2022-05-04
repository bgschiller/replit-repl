import { Heap, ID } from "../api";
import { assertUnreachable } from "../util";

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
  try {
    assertUnreachable(root);
  } catch (err) {
    return <pre>TODO {JSON.stringify(root, null, 2)}</pre>;
  }
}

function ObjectDisplay({ heap, id }: ResultProps): JSX.Element {
  const obj = heap[id];
  if (obj.type !== "object") return <></>; // tell TS what type we're working with
  return (
    <>
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
    </>
  );
}

function ArrayDisplay({ heap, id }: ResultProps): JSX.Element {
  const obj = heap[id];
  if (obj.type !== "array") return <></>; // tell TS what type we're working with
  return (
    <>
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
    </>
  );
}
