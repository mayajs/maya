import maya, { Type, ModuleCustomType } from "@mayajs/router";
import "reflect-metadata";
import http from "http";

abstract class AppModule {}

type BoostrapFunction = (APP_MODULE: Type<AppModule>) => void;

interface MayaJsServer {
  bootstrapModule: BoostrapFunction;
}

export * from "./decorators";

export const configServer = (PORT: number): MayaJsServer => ({ bootstrapModule: bootstrapModule(PORT) });

/**
 * Creates an instance of MayaJS Server on runtime.
 *
 * @param module MayaJS Module
 */
const bootstrapModule = (PORT: number): BoostrapFunction => (APP_MODULE: Type<AppModule>) => {
  const MAYA = maya();
  MAYA.add([{ path: "", loadChildren: () => Promise.resolve(<ModuleCustomType>APP_MODULE) }]);
  http.createServer(MAYA).listen(PORT, () => console.log(`\x1b[32m[mayajs] Server is running on port ${PORT}\x1b[0m`));
};
