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

    if (bootstrap) imports = [RouterModule.forRoot([{ path: "", controller: bootstrap }])];

    target["imports"] = [...imports, ...(options.imports || [])];
    target["declarations"] = options.declarations || [];
    target["exports"] = options.exports || [];
    target["providers"] = options.providers || [];
    target["dependencies"] = dependencies;
  };
}
