import express, { NextFunction, Request, RequestHandler, Response, Express } from "express";
import { MongoConnectionOptions, IRoutes } from "./interfaces";
import { connect, connection } from "mongoose";
import * as bodyparser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import http from "http";

export * from "./core";
export * from "./models";
export * from "./common/App";

export class MayaJS {
  private app: Express;
  private isProd = false;
  private port: number;

  constructor(appModule: any) {
    this.app = express();
    this.app.use(bodyparser.json({ limit: "50mb" }));
    this.app.use(bodyparser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000000 }));
    this.port = appModule.port;
    this.setRoutes(appModule.routes);
    this.unhandleErrors(this.app);
    this.cors(appModule.cors);
    this.logs(appModule.logs);
    this.connectDatabase(appModule.mongoConnection);
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
  start(port?: number): Promise<string> {
    port = port ? port : this.port;
    const server = http.createServer(this.app);
    try {
      server.listen(port, () => {
        this.onListen(port);
      });
      return Promise.resolve("Server running!");
    } catch (error) {
      return Promise.resolve(error);
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
      console.log(path, middlewares, router);
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
    console.log("\x1b[32mListening on port:", `\x1b[36m${port}\x1b[0m`);
  }

  private cors(bool: boolean): void {
    if (bool) {
      this.app.use(cors());
      console.log("\x1b[CORS\x1b[36m is enabled\x1b[0m.");
    }
  }

  private logs(bool: boolean): void {
    if (bool) {
      if (this.isProd) {
        this.app.use(morgan("common"));
      } else {
        this.app.use(morgan("dev"));
      }
    }
  }

  private connectDatabase(mongoConnection: MongoConnectionOptions): void {
    if (mongoConnection !== undefined && connection.readyState === 0) {
      const { connectionString, options } = mongoConnection;
      connect(
        connectionString,
        options
      )
        .then(conn => {
          console.log("Database connected.");
        })
        .catch(error => {
          console.log("\x1b[31mDatabase connection problem.\x1b[0m", error);
        });
    }

    const checkConnection = setInterval(() => {
      if (connection.readyState === 2) {
        console.log("\x1b[33mConnecting to database.\x1b[0m");
      } else {
        clearInterval(checkConnection);
      }
    }, 1000);
  }
}
