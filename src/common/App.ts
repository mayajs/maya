import express, { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { Controllers, IAppSettings, IRoute } from "../interfaces";
import { ErrorCallback, Callback } from "../typings";
import { Injector } from "./Injector";
import { Models } from "../models";

export function App(settings: IAppSettings): <T extends new (...args: Array<{}>) => any>(target: T) => void {
  return <T extends new (...args: Array<{}>) => Controllers>(target: T) => {
    return;
  };
}

/**
 * Add controllers to specific route with middlewares if any
 * @param args Object { route?: string; controllers: any[]; middlewares?: any[];
 * callback?: (error: any, req: Request, res: Response, next: NextFunction) => void; }
 * @param args.route string - name of route
 * @param args.controllers Array<any> - List of controllers
 * @param args.middlewares Array<Function> - List of middlewares
 * @param args.callback Function - Callback function that last to be called
 */
function routes(args: {
  route?: string;
  controllers: any[];
  middlewares?: any[];
  callback?: ErrorCallback;
}): { route: any; middlewares?: any; router: Router } {
  const { middlewares = [], callback = (error: any, req: Request, res: Response, next: NextFunction): void => next() } = args;
  const router = express.Router();

  args.controllers.map(controller => {
    const instance = Injector.resolve<typeof controller>(controller);
    const prefix: string = Reflect.getMetadata("prefix", controller);
    const model: string = Reflect.getMetadata("model", controller);

    if (model) {
      import(model).then(e => {
        Models.addModel({ [prefix.replace("/", "")]: e.default });
      });
    }

    const routes: IRoute[] = Reflect.getMetadata("routes", controller);
    const method = (name: string): Callback => (req: Request, res: Response, next: NextFunction): void => instance[name](req, res, next);
    routes.map(route => router[route.requestMethod](prefix + route.path, route.validations, method(route.methodName), callback));
  });
  return { route: args.route || "", middlewares, router };
}
