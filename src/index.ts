import express, { Request, RequestHandler, Response, Express, NextFunction } from "express";
import { DatabaseModule, IRoutes, IRoutesOptions, IRoute } from "./interfaces";
import * as bodyparser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import * as shell from "shelljs";
import { argv } from "yargs";
import { addDatabase } from "./utils/Database";
import { Injector } from "./utils/Injector";
import { Callback } from "./types";

export * from "./interfaces";
export * from "./utils/App";
export * from "./utils/Methods";
export { Controller } from "./utils/Controller";
export { Injectable } from "./utils/Injectable";
export { Database } from "./utils/Database";
export { Request, Response, NextFunction };

export class MayaJS {
  private app: Express;
  private port: number;
  private isProd = false;
  private hasLogs = false;
  private databases: DatabaseModule[] = [];
  private routes: IRoutesOptions[] = [];

  constructor(appModule: any) {
    this.app = express();
    this.app.use(bodyparser.json({ limit: "50mb" }));
    this.app.use(bodyparser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000000 }));
    this.port = argv.port ? argv.port : appModule.port;
    this.logs(appModule.logs);
    this.cors(appModule.cors);
    this.databases = appModule.databases.length > 0 ? appModule.databases : [appModule.database];
    this.routes = appModule.routes;
  }

  /**
   * Enable production mode
   * @param boolean bool - Turn on prod mode
   */
  prodMode(bool: boolean): this {
    this.isProd = bool ? true : this.isProd;
    return this;
  }

  /**
   * Run the server using the port specified or the default port : 3333
   * @param port number - Specify port number that the server will listen too.
   */
  start(port: number = 3333): any {
    port = this.port ? this.port : port;

    const server = http.createServer(this.onInit());

    try {
      server.listen(port, this.onListen(port));
    } catch (error) {
      server.close();
      throw new Error(error);
    }
  }

  /**
   * Adds middleware to our route
   * @param middleware RequestHandler - Callback function from a middleware
   */
  use(middleware: RequestHandler): this {
    this.app.use(middleware);
    return this;
  }

  /**
   * Initialize server
   */
  private onInit(): (req: http.IncomingMessage, res: http.ServerResponse) => void {
    return (req: http.IncomingMessage, res: http.ServerResponse) => {
      req.connection.on("close", data => {
        // code to handle connection abort
      });

      this.app(req, res);

      process
        .on("unhandledRejection", (reason, promise) => {
          console.log(reason, "Unhandled Rejection", promise);
          res.statusCode = 500;
          res.end();
        })
        .on("uncaughtException", err => {
          console.log(err, "Uncaught Exception thrown");
          res.statusCode = 500;
          res.end();
        });
    };
  }

  /**
   * Sets the routes to be injected as a middleware
   *
   * @param routes IRoutesOptions[] - A list of routes options for each routes
   */
  private setRoutes(routes: IRoutesOptions[]): void {
    routes.map((route: IRoutesOptions) => {
      const { path, middlewares, router } = this.configRoutes(route);
      this.app.use(path, middlewares, router);
    });
  }

  private unhandleErrors(app: Express): void {
    app.use((req: Request, res: Response) => {
      if (!req.route) {
        const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        res.status(405).json({ status: "Invalid Request", message: `Request: (${req.method}) ${url} is invalid!` });
      }
    });
  }

  private onListen(port: any): () => void {
    return () => {
      if (this.hasLogs) {
        console.log(`\x1b[32m[mayajs] Server running on port ${port}\x1b[0m`);
      }

      this.connectDatabase(this.databases)
        .then(() => {
          this.setRoutes(this.routes);
          this.unhandleErrors(this.app);
        })
        .catch(error => {
          console.log(`\n\x1b[31m${error}\x1b[0m`);
        });
    };
  }

  private cors(bool: boolean): void {
    if (bool) {
      this.app.use(cors());
    }
  }

  private logs(mode: string): void {
    if (mode.includes("dev")) {
      this.hasLogs = true;
      this.app.use(morgan("dev"));
      return;
    }

    if (this.isProd || mode.includes("prod")) {
      this.app.use(morgan("common"));
      return;
    }
  }

  private connectDatabase(databases: DatabaseModule[]): Promise<void[]> {
    if (databases.length > 0) {
      return Promise.all(
        databases.map((db: DatabaseModule) => {
          db.connect().then(() => {
            const models = db.models();
            addDatabase(db, models);
          });
          db.connection(this.hasLogs);
        })
      );
    }

    return Promise.resolve([]);
  }

  private configRoutes(args: IRoutesOptions): IRoutes {
    const { middlewares = [], callback = (error: any, req: Request, res: Response, next: NextFunction): void => next() } = args;
    const router = express.Router();

    args.controllers.map((controller: any) => {
      const instance = Injector.resolve<typeof controller>(controller);
      const prefix: string = Reflect.getMetadata("prefix", controller);
      const routes: IRoute[] = Reflect.getMetadata("routes", controller);
      const method = (name: string): Callback => (req: Request, res: Response, next: NextFunction): void => instance[name](req, res, next);
      routes.map((route: IRoute) => router[route.requestMethod](prefix + route.path, route.middlewares, method(route.methodName), callback));
    });
    return { path: args.path || "", middlewares, router };
  }
}
