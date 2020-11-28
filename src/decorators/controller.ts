/**
 * Decorator for a controller of a route
 * @param route name of the controller that will be added on the route name
 */
export function Controller({ selector }: { selector: string }): ClassDecorator {
  return (target: any): void => {
    target.__selector = selector;
    Reflect.defineMetadata("prefix", selector, target);

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
}
