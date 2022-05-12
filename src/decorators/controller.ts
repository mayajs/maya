import { CONTROLLER_ROUTES, DESIGN_PARAMS, DEPS } from "@mayajs/router";

/**
 * Decorator for a controller of a route
 * @param route name of the controller that will be added on the route name
 */
export function Controller(): ClassDecorator {
  return (target: any): void => {
    const routes = Reflect.getMetadata(CONTROLLER_ROUTES, target) || [];
    const dependencies = Reflect.getMetadata(DESIGN_PARAMS, target) || [];
    target.prototype["routes"] = routes;
    target["dependencies"] = dependencies;

    Reflect.defineMetadata(DEPS, dependencies.length > 0 ? dependencies : [], target);
  };
}
