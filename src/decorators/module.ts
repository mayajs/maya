import { ModuleOptions } from "../interfaces";
import { ModuleOptionsKeys } from "../types";
import { getModuleConstant, MODULE_NAME, MODULE_PATH } from "../utils";

/**
 * Decorator for MayaJS Module
 *
 * @param options MayaJS Module options
 */
export function Module(options: ModuleOptions): <T extends new (...args: Array<{}>) => any>(target: T) => void {
  return (target: any): void => {
    Reflect.defineMetadata(MODULE_PATH, "", target);
    Reflect.defineMetadata(MODULE_NAME, target.name, target);
    Object.keys(options).map(key => {
      const constants = getModuleConstant(`MODULE_${key.toLocaleUpperCase()}`);
      Reflect.defineMetadata(constants, options[key as ModuleOptionsKeys], target);
    });
  };
}
