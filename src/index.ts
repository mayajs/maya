import express, { Request, RequestHandler, Response, Express } from "express";
import { Database, IRoutes, AppModule } from "./interfaces";
import * as bodyparser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import http from "http";

export * from "./core";
export * from "./interfaces";
export * from "./lib/App";

export class MayaJS {
  private app: Express;
  private port: number;
  private isProd = false;
  private hasLogs = false;

  constructor(appModule: AppModule) {
    this.app = express();
    this.app.use(bodyparser.json({ limit: "50mb" }));
    this.app.use(bodyparser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000000 }));
    this.port = appModule.port;
    this.logs(appModule.logs);
    this.cors(appModule.cors);
    this.connectDatabase(appModule.database);
    this.setRoutes(appModule.routes);
    this.unhandleErrors(this.app);
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
      console.log(`\n\x1b[32mServer is running on \x1b[31m${this.isProd ? "PROD" : "DEV"} MODE.\x1b[0m`);
    }
    console.log("\x1b[32mListening on port:", `\x1b[36m${port}\x1b[0m`);
  }

  private cors(bool: boolean): void {
    if (bool) {
      this.app.use(cors());
      if (this.hasLogs) {
        console.log("\x1b[33mCORS\x1b[36m is enabled.\x1b[0m");
      }
    }
  }

  private logs(bool: string): void {
    if (bool !== "") {
      this.hasLogs = true;
      this.app.use(morgan(this.isProd || bool ? "common" : "dev"));
      console.log(`\x1b[33mLOGS\x1b[36m is enabled.`);
    }
  }

  private connectDatabase(db: Database): void {
    if (db) {
      db.connect()
        .then(conn => {
          console.log("\x1b[36mDatabase \x1b[32mconnected.\x1b[0m");
        })
        .catch(error => {
          console.log("\x1b[31mDatabase connection problem.\x1b[0m", error);
        });

      db.connection(this.hasLogs);
    }
  }
}
