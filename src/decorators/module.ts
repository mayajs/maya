import { Type, RouterModule } from "@mayajs/router";

interface ModuleDecoratorProps {
  bootstrap?: Type<any>;
  declarations?: Array<Type<any>>;
  imports?: Array<Type<any>>;
  exports?: Array<Type<any>>;
  providers?: Array<Type<any>>;
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
    let imports: any[] = [];
    let declarations: any[] = [];

    if (bootstrap) {
      imports = [RouterModule.forRoot([{ path: "", controller: bootstrap }])];
      declarations = [bootstrap];
    }

    target.prototype["imports"] = [...imports, ...(options.imports || [])];
    target.prototype["declarations"] = [...declarations, ...(options.declarations || [])];
    target.prototype["exports"] = options.exports || [];
    target.prototype["providers"] = options.providers || [];
    target.prototype["dependencies"] = dependencies;
  };
}
