import { ModelDictionary, DatabaseModule } from "../interfaces";

interface DatabaseList<T, U> {
  [x: string]: { instance: T; models: ModelDictionary<U> };
}

const dbList: DatabaseList<any, any> = {};

export function addDatabase<T extends DatabaseModule, U>(db: T, models: ModelDictionary<U>): void {
  dbList[db.name] = {
    instance: db.instance,
    models,
  };
}

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
