import { Heap, ID } from "../api";

export default function Result({
  heap,
  id,
}: {
  heap: Heap;
  id?: ID;
}): JSX.Element {
  const root = heap[id || 0];
  if (root.type === "number") return <>{root.value}</>;
  if (root.type === "string") {
    // TODO: what about really long strings?
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
  return <pre>TODO {JSON.stringify(root)}</pre>;
}
