import {
  Class,
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
} from "@mayajs/router";

interface ModuleDecoratorProps {
  bootstrap?: ControllerType;
  declarations?: ControllerType[];
  imports?: ModuleImports[];
  exports?: Class[];
  providers?: ModuleProviders;
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
    const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
    const bootstrap = options["bootstrap"];
    target["imports"] = options.imports || [];
    target["declarations"] = options.declarations || [];
    target["exports"] = options.exports || [];
    target["providers"] = options.providers || [];
    target["dependencies"] = dependencies;
    target["bootstrap"] = bootstrap;
  };
}
