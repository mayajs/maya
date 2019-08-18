import express, { NextFunction, Request, Response } from "express";
import { IAppSettings, IRoute, IRoutesOptions, IRoutes } from "../interfaces";
import { Callback } from "../typings";
import { Injector } from "./Injector";
import { addModel } from "./Models";

export function App(settings: IAppSettings): <T extends new (...args: Array<{}>) => any>(target: T) => void {
  const { port = 3333, cors = false, logs = "", mongoConnection } = settings;
  return (target: any): void => {
    const configRoutes = (args: IRoutesOptions): IRoutes => {
      const { middlewares = [], callback = (error: any, req: Request, res: Response, next: NextFunction): void => next() } = args;
      const router = express.Router();

      args.controllers.map(controller => {
        const instance = Injector.resolve<typeof controller>(controller);
        const prefix: string = Reflect.getMetadata("prefix", controller);
        const model: string = Reflect.getMetadata("model", controller);

        if (model) {
          import(model).then(e => {
            addModel({ [prefix.replace("/", "")]: e.default });
          });
        }

        const routes: IRoute[] = Reflect.getMetadata("routes", controller);
        const method = (name: string): Callback => (req: Request, res: Response, next: NextFunction): void => instance[name](req, res, next);
        routes.map(route => router[route.requestMethod](prefix + route.path, route.middlewares, method(route.methodName), callback));
      });
      return { path: args.path || "", middlewares, router };
    };

    const routes: IRoutes[] = settings.routes.map(route => {
      return configRoutes(route);
    });

    target.routes = routes;
    target.port = port;
    target.cors = cors;
    target.logs = logs;
    target.mongoConnection = mongoConnection;
  };
}
