export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export type ResultError<R> = R extends { success: false; error: infer E }
  ? E
  : never;
export type ResultData<R> = R extends { success: true; data: infer T }
  ? T
  : never;
