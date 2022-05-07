import {
  Class,
  ClassList,
  DEPS,
  MODULE_IMPORTS,
  MODULE_DECLARATIONS,
  MODULE_EXPORTS,
  MODULE_PROVIDERS,
  MODULE_BOOTSTRAP,
  DESIGN_PARAMS,
  MODULE,
  MODULE_ROUTES,
  MODULE_KEY,
  ModuleWithProviders,
} from "@mayajs/router";

interface ModuleDecoratorProps {
  bootstrap?: Class;
  declarations?: ClassList;
  imports?: ModuleWithProviders[];
  exports?: ClassList;
  providers?: ClassList;
}

/**
 * Decorator for MayaJS Modules
 * ```
 * {
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
export function Module(options: ModuleDecoratorProps): ClassDecorator {
  return (target: any): void => {
    const dependencies = Reflect.getMetadata(DESIGN_PARAMS, target) || [];

    target["imports"] = options.imports || [];
    target["declarations"] = options.declarations || [];
    target["exports"] = options.exports || [];
    target["providers"] = options.providers || [];
    target["dependencies"] = dependencies;
    target["bootstrap"] = options.bootstrap;
    target["routes"] = [];
    target["mod"] = true;
    target["key"] = "";

    Reflect.defineMetadata(MODULE, true, target);
    Reflect.defineMetadata(MODULE_KEY, "", target);
    Reflect.defineMetadata(MODULE_ROUTES, [], target);
    Reflect.defineMetadata(MODULE_IMPORTS, options.imports || [], target);
    Reflect.defineMetadata(MODULE_EXPORTS, options.exports || [], target);
    Reflect.defineMetadata(MODULE_BOOTSTRAP, options.bootstrap, target);
    Reflect.defineMetadata(MODULE_PROVIDERS, options.providers || [], target);
    Reflect.defineMetadata(MODULE_DECLARATIONS, options.declarations || [], target);
    Reflect.defineMetadata(DEPS, dependencies.length > 0 ? dependencies : [], target);
  };
}
