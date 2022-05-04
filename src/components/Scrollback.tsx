import { Heap } from "../api";
import "./Scrollback.css";
import Result from "./Result";

type PendingScrollbackEntry = {
  id: string;
  code: string;
};
type FinishedScrollbackEntry = { code: string; result: Heap };
export type ScrollbackEntry = PendingScrollbackEntry | FinishedScrollbackEntry;

export type ScrollbackEntryProps = ScrollbackEntry;

export function Entry(props: ScrollbackEntryProps) {
  return (
    <div className="scrollback-entry">
      <pre className="code">{props.code}</pre>
      {"result" in props ? (
        <div className={`result ${props.result[0].type}`}>
          <Result heap={props.result} id={0} depth={2} />
        </div>
      ) : null}
      {"id" in props ? <div className="result pending">pending...</div> : null}
    </div>
  );
}

export interface ScrollbackProps {
  entries: ScrollbackEntry[];
}
export default function Scrollback({ entries }: ScrollbackProps) {
  return (
    <div className="scrollback">
      {entries.map((e, ix) => (
        <Entry key={ix} {...e} />
      ))}
    </div>
  );
}
