export type ValueOf<T> = T[keyof T];

export const enumToArray = <E>(e: E): Array<ValueOf<E>> => {
  return Object.values(e);
};
