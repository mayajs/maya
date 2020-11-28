import { ModelDictionary } from "../interfaces";
import { dbList } from "../modules";

export function Database<T, U>(name: string): any {
  return (target: any, key: string): any => {
    // property getter method
    const getter = (): { instance: T; models: ModelDictionary<U> } => {
      return dbList[name];
    };

    // Delete property.
    if (delete target[key]) {
      // Create new property with getter and setter
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get: getter,
      });
    }
  };
}
