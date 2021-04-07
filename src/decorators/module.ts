import { getModuleConstant, MODULE_NAME, MODULE_PATH } from "../utils";
import { ModuleOptionsKeys } from "../types";
import { Class } from "../interfaces";

interface ModuleDecoratorProps {
  bootstrap?: Class<any>;
  declarations?: Array<Class<any>>;
  imports?: Array<Class<any>>;
  exports?: Array<Class<any>>;
  providers?: Array<Class<any>>;
}

/**
 * Decorator for MayaJS Module

 * ```
 * {
 *  port: 3333,
 *  imports: [],
 *  exports: [],
 *  providers: [],
 *  declarations: [],
 *  bootstrap: Controller,
 * }
 * ```
 *
 * @param options MayaJS Module options
 */
export function Module(options: ModuleDecoratorProps): <T extends new (...args: Array<{}>) => any>(target: T) => void {
  return (target: any): void => {
    Reflect.defineMetadata(MODULE_PATH, "", target);
    Reflect.defineMetadata(MODULE_NAME, target.name, target);
    Object.keys(options).map(key => {
      const constants = getModuleConstant(`MODULE_${key.toLocaleUpperCase()}`);
      Reflect.defineMetadata(constants, options[key as ModuleOptionsKeys], target);
    });
  };
}
