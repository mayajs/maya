export * from "./Functions";
export * from "./Runner";

export function DIContainer<T>(object: T): { [K in keyof T]: T[K] } {
  const protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(object)) as Array<keyof T>;
  protoKeys.forEach(key => {
    const maybeFn = object[key];
    if (typeof maybeFn === "function") {
      object[key] = maybeFn.bind(object);
    }
  });
  return object;
}
