import maya, { Type, Middlewares } from "@mayajs/router";
import "reflect-metadata";
import http from "http";

abstract class AppModule {}

type BootstrapFunction = (APP_MODULE: Type<AppModule>) => void;
type UsePlugins = (plugins: Middlewares[]) => MayaJsServer;

interface MayaJsServer {
  /**
   * Creates an instance of MayaJS Server on runtime.
   *
   * @param module MayaJS Module
   */
  bootstrapModule: BootstrapFunction;
  /**
   * Add MayaJS plugins
   *
   * @param middlewares Middlewares[]
   */
  usePlugins: UsePlugins;
}

export * from "./decorators";

/**
 * Configure MayaJS Server
 * @param PORT Use only for production
 * @returns Object with methods to bootstrap and use plugins
 */
function configServer(PORT: string | undefined): MayaJsServer;
function configServer(PORT: number | undefined): MayaJsServer;
function configServer(PORT: any = 3333): MayaJsServer {
  let middlewares: Middlewares[] = [];
  return {
    bootstrapModule(APP_MODULE: Type<AppModule>) {
      const MAYA = maya();
      const cmdPort = process.argv[2] !== "undefined" ? process.argv[2] : null;
      const port = cmdPort || Number(PORT);
      const loaded = process.argv[3] === "true";

      MAYA.add([{ path: "", middlewares, loadChildren: () => Promise.resolve(<ModuleCustomType>APP_MODULE) }]);
      http.createServer(MAYA).listen(port, () => {
        if (!loaded) {
          console.log(`\x1b[32m\n** MAYA Live Development Server is running on \x1b[37mhttp://localhost:${port}\x1b[32m **\n`);
        }

        console.log(`\x1b[32m[mayajs] Server is running on port ${port}\x1b[0m`);
      });
    },
    usePlugins(plugins: Middlewares[]) {
      middlewares = [...middlewares, ...plugins];
      return this;
    },
  };
}

export { configServer };
