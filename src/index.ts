import express, { Request, RequestHandler, Response, Express, NextFunction, Router } from "express";

// Node import
import http from "http";

// 3rd party plugin imports
import * as bodyparser from "body-parser";
import morgan from "morgan";
import cors from "cors";

// Local imports
import { setRoutes, connectDatabase } from "./modules";
import { DatabaseModule, AppModule } from "./interfaces";

// MayaJS exports
export * from "./interfaces";
export * from "./decorators";
export * from "./di";
export { Request, Response, NextFunction };

export class MayaJS {
  private app: Express;
  private isProd = false;
  private hasLogs = false;
  private databases: DatabaseModule[] = [];
  private routes: Router = express.Router();
  private cors!: RequestHandler;
  private logger!: RequestHandler;
  private bodyParser: { json?: RequestHandler; urlencoded?: RequestHandler } = {};

  constructor(module: AppModule) {
    // Creates an express instance
    this.app = express();

    // Sets default plugins settings for MayaJS
    this.setDefaultPluginsSettings();

    // Sets default values from app module options
    this.parseAppModuleOptions(module);
  }

  /**
   * Enable production mode
   *
   * @param boolean bool - Turn on prod mode
   * @returns MayaJS instance
   */
  prodMode(bool: boolean): this {
    // Sets the MayaJS to production if true
    this.isProd = bool ? true : this.isProd;
    return this;
  }

  /**
   * Run the server using the port specified or the default port : 3333
   * @param port number - Specify port number that the server will listen too.
   * @returns An instance of http.Server
   */
  start(port: number = 3333): http.Server {
    // Create server instance
    const server = http.createServer(this.app);

    // Try to start the server
    try {
      server.listen(port, this.onListen(port));
    } catch (error) {
      server.close();
      throw new Error(error);
    }

    // Catch any unhandled error if any
    process
      .on("unhandledRejection", (reason, promise) => {
        console.log(reason, "Unhandled Rejection", promise);
      })
      .on("uncaughtException", err => {
        console.log(err, "Uncaught Exception thrown");
      });

    // Returns a server instance
    return server;
  }

  /**
   * Adds array of middleware functions before initialization routes
   *
   * @param plugins RequestHandler[] - Callback function from a middleware
   * @returns MayaJS instance
   */
  plugins(plugins: RequestHandler[]): this {
    // Iterate all plugins
    for (const plugin of plugins) {
      this.app.use(plugin);
    }
    return this;
  }

  /**
   * Adds middleware function before initialization of routes
   *
   * @param middleware RequestHandler - Callback function from a middleware
   * @returns MayaJS instance
   */
  use(middleware: RequestHandler): this {
    this.app.use(middleware);
    return this;
  }

  /**
   * Set default body parser
   *
   * @param bodyParser A set of middleware functions that parses an incoming request body
   * @returns MayaJS instance
   */
  setBodyParser(bodyParser: { json?: RequestHandler; urlencoded?: RequestHandler }): this {
    // Check if body parser has keys
    if (Object.keys(bodyParser).length > 0) {
      this.bodyParser = bodyParser;
    }
    return this;
  }

  /**
   * Set default CORS options
   *
   * @param cors A middleware function that sets the cors settings of a request
   * @returns MayaJS instance
   */
  setCORS(cors: RequestHandler): this {
    this.cors = cors;
    return this;
  }

  /**
   * Set default logger
   *
   * @param logger A middleware function that logs request
   * @returns MayaJS instance
   */
  setLogger(logger: RequestHandler): this {
    this.logger = logger;
    return this;
  }

  /**
   * Parse app module options for initialization
   *
   * @param module AppModule - A simple class that invoke before initialization
   */
  private parseAppModuleOptions(module: AppModule) {
    // Sets database value
    this.databases = module?.databases ?? [];
    // Sets routes value
    this.routes = setRoutes(module?.routes);
  }

  /**
   * Sets the default plugins settings for MayaJS plugins
   */
  private setDefaultPluginsSettings() {
    // Sets default settings for body parser plugin
    this.bodyParser["json"] = bodyparser.json({ limit: "50mb" });
    this.bodyParser["urlencoded"] = bodyparser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000000 });

    // Sets default settings for cors plugin
    this.cors = cors();
  }

  /**
   * Sets the default plugins for MayaJS routes
   */
  private setDefaultPlugins() {
    // Sets default cors plugin
    this.app.use(this.cors);

    // Sets default body parser plugin
    this.app.use(this.bodyParser.json as RequestHandler);
    this.app.use(this.bodyParser.urlencoded as RequestHandler);

    // Sets default logger plugin
    this.app.use(this.logger ? this.logger : morgan(this.isProd ? "tiny" : "dev"));
  }

  /**
   * Handles unhandle errors from the app/express instance
   *
   * @param app Instance of a Express class
   */
  private unhandleErrors(app: Express): void {
    app.use((req: Request, res: Response) => {
      if (!req.route) {
        const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        return res.status(405).json({ status: "Invalid Request", message: `Request: (${req.method}) ${url} is invalid!` });
      }
    });
  }

  /**
   * A factory function for listening to server calls
   *
   * @param port Port number where the server is running
   */
  private onListen(port: number): () => void {
    return () => {
      // Check if logs are enable
      if (this.hasLogs) {
        console.log(`\x1b[32m[mayajs] Server running on port ${port}\x1b[0m`);
      }

      // Use the routes before connecting the database
      this.app.use("", [], this.routes);

      // Sets default logger, body parser and cors plugin
      this.setDefaultPlugins();

      // Connects all database instances
      connectDatabase(this.databases, this.hasLogs)
        .then(() => {
          // This will caught any unhandled routes
          this.unhandleErrors(this.app);
        })
        .catch(error => {
          // Catch any errors
          console.log(`\n\x1b[31m${error}\x1b[0m`);
        });
    };
  }
}
