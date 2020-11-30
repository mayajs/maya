// EXTERNAL IMPORTS
import shortid from "shortid";

// LOCAL IMPORTS
import { CONTROLLER_NAME, CONTROLLER_ROUTES } from "../utils";

/**
 * Decorator for a controller of a route
 * @param route name of the controller that will be added on the route name
 */
export function Controller(): ClassDecorator {
  return (target: any): void => {
    Reflect.defineMetadata(CONTROLLER_NAME, shortid.generate(), target);

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (!Reflect.hasMetadata(CONTROLLER_ROUTES, target)) {
      Reflect.defineMetadata(CONTROLLER_ROUTES, [], target);
    }
  };
}
