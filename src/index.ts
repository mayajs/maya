import maya, { Type, ModuleCustomType, Middlewares } from "@mayajs/router";
import "reflect-metadata";
import http from "http";

abstract class AppModule {}

type BoostrapFunction = (APP_MODULE: Type<AppModule>) => void;
type UsePlugins = (plugins: Middlewares[]) => MayaJsServer;

interface MayaJsServer {
  /**
   * Creates an instance of MayaJS Server on runtime.
   *
   * @param module MayaJS Module
   */
  bootstrapModule: BoostrapFunction;
  /**
   * Add MayaJS plugins
   *
   * @param middlewares Middlewares[]
   */
  usePlugins: UsePlugins;
}

export * from "./decorators";

export const configServer = (PORT: number = 3333): MayaJsServer => {
  let middlewares: Middlewares[] = [];
  return {
    bootstrapModule(APP_MODULE: Type<AppModule>) {
      const MAYA = maya();
      const port = process.argv.find(arg => arg.includes("--port"))?.split("=")?.[1] || PORT;
      MAYA.add([{ path: "", middlewares, loadChildren: () => Promise.resolve(<ModuleCustomType>APP_MODULE) }]);
      http.createServer(MAYA).listen(port, () => console.log(`\x1b[32m[mayajs] Server is running on port ${port}\x1b[0m`));
    },
    usePlugins(plugins: Middlewares[]) {
      middlewares = [...middlewares, ...plugins];
      return this;
    },
  };
};
