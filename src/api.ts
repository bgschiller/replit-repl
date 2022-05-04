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
  | { type: "thrown-error"; value: string }
  | { type: "undefined"; value: "" }
  | { type: "null"; value: "" }
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
  }).then((resp) => {
    if (!resp.ok) {
      console.log("evaluation failed");
      return resp.text().then((body) => {
        console.log("got body", body);
        return { 0: { type: "thrown-error", value: body } };
      });
    }
    return resp.json().then((body) => body.result);
  });
}
