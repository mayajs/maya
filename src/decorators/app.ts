import { IAppModuleOptions } from "../interfaces";
import { CONTROLLER_ROUTES, DATABASE, MODULE_DECLARATIONS, MODULE_EXPORTS, MODULE_IMPORTS } from "../utils";

/**
 * Decorator for app module
 *
 * @param options Settings for app module
 */
export function App(options: IAppModuleOptions): <T extends new (...args: Array<{}>) => any>(target: T) => void {
  const { databases = [], routes = [], exports = [], imports = [], declarations = [], bootstrap } = options;

  return (target: any): void => {
    Reflect.defineMetadata(CONTROLLER_ROUTES, routes, target);
    Reflect.defineMetadata(DATABASE, databases, target);
    Reflect.defineMetadata(MODULE_EXPORTS, exports, target);
    Reflect.defineMetadata(MODULE_IMPORTS, imports, target);
    Reflect.defineMetadata(MODULE_DECLARATIONS, declarations, target);
    Reflect.defineMetadata(MODULE_DECLARATIONS, bootstrap, target);
  };
}
