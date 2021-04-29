import maya, { Type, ModuleCustomType } from "@mayajs/router";
import "reflect-metadata";
import http from "http";

abstract class AppModule {}

type BoostrapFunction = (APP_MODULE: Type<AppModule>) => void;

interface MayaJsServer {
  bootstrapModule: BoostrapFunction;
}

export * from "./decorators";

export const configServer = (PORT: number = 3333): MayaJsServer => ({ bootstrapModule: bootstrapModule(PORT) });

/**
 * Creates an instance of MayaJS Server on runtime.
 *
 * @param module MayaJS Module
 */
const bootstrapModule = (PORT: number): BoostrapFunction => (APP_MODULE: Type<AppModule>) => {
  const MAYA = maya();
  const port = process.argv.find(arg => arg.includes("--port"))?.split("=")?.[1] || PORT;
  MAYA.add([{ path: "", loadChildren: () => Promise.resolve(<ModuleCustomType>APP_MODULE) }]);
  http.createServer(MAYA).listen(port, () => console.log(`\x1b[32m[mayajs] Server is running on port ${port}\x1b[0m`));
};
