import { INJECTABLE, DESIGN_PARAMS } from "@mayajs/router";

/**
 * @returns {InjectableDecaorator<Type<any>>}
 * @constructor
 */
export function Service(): ClassDecorator {
  return (target: any): void => {
    target[INJECTABLE] = true;
    const dependencies = Reflect.getMetadata(DESIGN_PARAMS, target) || [];
    target["dependencies"] = dependencies;
  };
}
