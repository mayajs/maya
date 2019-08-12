import { PaginateModel, Document } from "mongoose";

interface IPaginateModel {
  [k: string]: PaginateModel<any>;
}

const models: IPaginateModel[] = [];

export class Models {
  static addModel(model: IPaginateModel): void {
    models.push(model);
  }

  instance<T extends Document>(name: string): PaginateModel<T> {
    return models.filter(e => e[name])[0][name];
  }
}

export function ModelDecorator(name: string): (target: any, key: string) => void {
  return (target: any, key: string): void => {
    // property value
    let value = target[key];

    // property getter method
    const getter = () => {
      return models.filter(e => e[name])[0][name];
    };

    // property setter method
    const setter = (newVal: any) => {
      console.log(`Set: ${key} => ${newVal}`);
      value = newVal;
    };

    // Delete property.
    if (delete target[key]) {
      // Create new property with getter and setter
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter,
      });
    }
  };
}
