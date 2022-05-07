import { INJECTABLE, DEPS, DESIGN_PARAMS, ROOT } from "@mayajs/router";

interface IServiceDecoratorProps {
  root: boolean;
}

/**
 * @returns {InjectableDecorator<Type<any>>}
 * @constructor
 */
export function Service(options: IServiceDecoratorProps = { root: false }): ClassDecorator {
  return (target: any): void => {
    const dependencies = Reflect.getMetadata(DESIGN_PARAMS, target) || [];
    target["dependencies"] = dependencies;
    target["injectable"] = true;
  };
}
