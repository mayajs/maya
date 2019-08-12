import { Models } from "../Models";

export function ModelDecorator(name: string): (target: any, key: string) => void {
  return (target: any, key: string): void => {
    // property value
    let value = target[key];

    const model = new Models();

    // property getter method
    const getter = () => {
      console.log(model.instance(name));
      return value;
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
