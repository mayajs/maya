import express, { Request, RequestHandler, Response, Express, NextFunction } from "express";
import { IRoutes, DatabaseModule } from "./interfaces";
import * as bodyparser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import * as shell from "shelljs";
import { argv } from "yargs";

export * from "./interfaces";
export * from "./utils/App";
export * from "./utils/Methods";
export { Controller } from "./utils/Controller";
export { Injectable } from "./utils/Injectable";
export { Request, Response, NextFunction };

export class MayaJS {
  private app: Express;
  private port: number;
  private models: any[];
  private isProd = false;
  private hasLogs = false;
  private databases: DatabaseModule[] = [];
  private routes: IRoutes[] = [];

  constructor(appModule: any) {
    this.app = express();
    this.app.use(bodyparser.json({ limit: "50mb" }));
    this.app.use(bodyparser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000000 }));
    this.port = argv.port ? argv.port : appModule.port;
    this.models = [];
    this.logs(appModule.logs);
    this.cors(appModule.cors);
    this.databases = appModule.databases.length > 0 ? appModule.databases : [appModule.database];
    this.routes = appModule.routes;
  }

  /**
   * Enable production mode
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
    port = port ? port : this.port;

    const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
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
    });

    try {
      server.listen(port, () => {
        this.onListen(port);
        this.connectDatabase(this.databases)
          .then(() => {
            this.setRoutes(this.routes);
            this.unhandleErrors(this.app);
            this.warnings();
          })
          .catch(error => {
            console.log(`\n\x1b[31m${error}\x1b[0m`);
          });
      });
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

  private setRoutes(routes: IRoutes[]): void {
    routes.map(({ path, middlewares, router }) => {
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

  private onListen(port: any): void {
    if (this.hasLogs) {
      console.log(`\x1b[32m[mayajs] Server running on port ${port}\x1b[0m`);
    }
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
            db.models();
          });
          db.connection(this.hasLogs);
        })
      );
    }

    return Promise.resolve([]);
  }

  private warnings(): void {
    const { stdout } = shell.exec("npm list --depth=0", { silent: true });
    const iSMongoDeprecated = stdout.includes("@mayajs/mongo@0.1.0");

    if (iSMongoDeprecated) {
      console.log(
        `\n\x1b[33mWARNING: MayaJS is now using MongoSchema and MongoModel for adding Mongoose models. This will be the standard way in the future. You can update to latest @mayajs/mongo version to use this feature.\x1b[0m\n`
      );
      console.log(`Usage:\n
      import { MongoSchema, MongoModel } from "@mayajs/mongo";
      
      const schema = MongoSchema({
        fieldName: String,
      }, options);

      export default MongoModel("Sample", schema);\n`);
    }
  }
}
