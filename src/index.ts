import express, { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { Callback, ErrorCallback } from "./typings";
import { Injector } from "./common/Injector";
import * as bodyparser from "body-parser";
import { IRoute } from "./interfaces";
import { Models } from "./models";

export * from "./core";
export * from "./models";
export * from "./common/App";

export default class Maya {
  app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(bodyparser.json({ limit: "50mb" }));
    this.app.use(bodyparser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000000 }));
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
  routes(args: { route?: string; controllers: any[]; middlewares?: any[]; callback?: ErrorCallback }): { route: any; middlewares?: any; router: Router } {
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

  /**
   * Run the server using the port specified
   * @param port number - Specify port number that the server will listen too.
   */
  start(port: number): void {
    this.app.use((req: Request, res: Response) => {
      if (!req.route) {
        const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        res.status(405).json({ status: "Invalid Request", message: `Request: (${req.method}) ${url} is invalid!` });
      }
    });
    this.app.listen(port, () => console.log(`Started express on port ${port}`));
  }

  /**
   * Adds middleware to our route
   * @param middleware RequestHandler - Callback function from a middleware
   */
  use(middleware: RequestHandler): void {
    this.app.use(middleware);
  }
}
