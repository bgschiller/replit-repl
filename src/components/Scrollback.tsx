import { Heap } from "../api";
import "./Scrollback.css";
import Result from "./Result";

type PendingScrollbackEntry = {
  id: string;
  code: string;
  pending: Promise<Heap>;
};
type FinishedScrollbackEntry = { code: string; result: Heap };
export type ScrollbackEntry = PendingScrollbackEntry | FinishedScrollbackEntry;

export type OnResultFunc = (id: string, heap: Heap) => void;

export type ScrollbackEntryProps = ScrollbackEntry & { onResult: OnResultFunc };

export function Entry(props: ScrollbackEntryProps) {
  if ("pending" in props) {
    props.pending.then((result) => {
      props.onResult(props.id, result);
    });
  }
  return (
    <div className="scrollback-entry">
      <pre className="code">{props.code}</pre>
      {"result" in props ? (
        <div className={`result ${props.result[0].type}`}>
          <Result heap={props.result} id={0} depth={2} />{" "}
        </div>
      ) : null}
      {"pending" in props ? (
        <div className="result pending">pending...</div>
      ) : null}
    </div>
  );
}

export interface ScrollbackProps {
  entries: ScrollbackEntry[];
  onResult: OnResultFunc;
}
export default function Scrollback({ entries, onResult }: ScrollbackProps) {
  return (
    <div className="scrollback">
      {entries.map((e, ix) => (
        <Entry key={ix} {...e} onResult={onResult} />
      ))}
    </div>
  );
}
