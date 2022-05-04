export type ID = number;
export type Types =
  | {
      type: "object";
      value: Array<{ key: ID; value: ID }>;
    }
  | {
      type: "array";
      value: Array<ID>;
    }
  | {
      type: "error";
      value: {
        name: string;
        message: string;
        stack?: string;
      };
    }
  | { type: "undefined"; value: "" }
  | { type: "string"; value: string }
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean };
// Root element has ID of 0
export type Heap = { [number: ID]: Types };

export function evaluate(code: string, contextId: string): Promise<Heap> {
  return fetch("https://flatval.masfrost.repl.co", {
    method: "post",
    body: JSON.stringify({ code, contextId }),
    credentials: "omit",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then((body) => body.result);
}
