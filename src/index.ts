import { CONTROLLER_ROUTES, MODULE_BOOTSTRAP, MODULE_DECLARATIONS } from "./utils";
import maya, { MayaJsModule, RouterModule, Type } from "@mayajs/router";
import "reflect-metadata";
import http from "http";

class AppModule {}

export * from "./decorators/module";
export * from "./decorators/controller";

export const configServer = (port: number) => {
  return {
    bootstrapModule: bootstrapModule(port),
  };
};

/**
 * Creates an instance of MayaJS Server on runtime.
 *
 * @param module MayaJS Module
 */
const bootstrapModule = (port: number) => (app: Type<AppModule>) => {
  const router = maya();
  const controller = Reflect.getMetadata(MODULE_BOOTSTRAP, app);
  const declarations = Reflect.getMetadata(MODULE_DECLARATIONS, app);
  const isDeclared = declarations.some((item: any) => item.name === controller.name);

  const controllerRoutes = Reflect.getMetadata(CONTROLLER_ROUTES, controller);
  controller.prototype["routes"] = controllerRoutes;

  if (!isDeclared) {
    throw `\x1b[31m[mayajs] ${controller.name} is not properly declared on ${app.name}.\x1b[0m`;
  }

  const _module = class extends MayaJsModule {
    imports = [RouterModule.forRoot([{ path: "", controller }])];
    declarations = [controller];
  };

  router.add([{ path: "", loadChildren: () => Promise.resolve(_module) }]);
  http.createServer(router).listen(port, () => console.log(`\x1b[32m[mayajs] Server is running on port ${port}\x1b[0m`));
};
