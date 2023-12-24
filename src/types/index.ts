export type SearchParams = Record<string, string | string[] | undefined>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEvent<HTMLButtonElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type NonUndefined<T> = { [K in keyof T]-?: T[K] extends undefined ? never : T[K] };
