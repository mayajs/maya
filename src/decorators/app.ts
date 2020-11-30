import { MODULE_DECLARATIONS, MODULE_EXPORTS, MODULE_IMPORTS } from "../utils";
import { ModuleOptions } from "../interfaces";

/**
 * Decorator for app module
 *
 * @param options Settings for app module
 */
export function App(options: ModuleOptions): <T extends new (...args: Array<{}>) => any>(target: T) => void {
  const { exports = [], imports = [], declarations = [], bootstrap } = options;

  return (target: any): void => {
    Reflect.defineMetadata(MODULE_EXPORTS, exports, target);
    Reflect.defineMetadata(MODULE_IMPORTS, imports, target);
    Reflect.defineMetadata(MODULE_DECLARATIONS, declarations, target);
    Reflect.defineMetadata(MODULE_DECLARATIONS, bootstrap, target);
  };
}
