import express, { Request, RequestHandler, Response, Express, NextFunction, Router } from "express";

// Node import
import http from "http";

// 3rd party plugin imports
import * as bodyparser from "body-parser";
import morgan from "morgan";
import cors from "cors";

// Local imports
import { setRoutes, resolveControllerRoutes, unhandleRoutes, connectDatabase } from "./modules";
import { DatabaseModule, AppModule } from "./interfaces";
import { CONTROLLER_ROUTES, DATABASE, MODULE_BOOTSTRAP } from "./utils";

// MayaJS exports
export * from "./interfaces";
export * from "./decorators";
export * from "./di";
export { Request, Response, NextFunction };

let PRODUCTION = false;
let CORS: RequestHandler = cors();

/**
 * Enable MayaJS to run on production mode
 */
export const enableProdMode = () => {
  PRODUCTION = true;
};

/**
 * Set default CORS options
 *
 * @param cors A middleware function that sets the cors settings of an incoming request
 */
export const setCORS = (cors: RequestHandler) => {
  CORS = cors;
};

export class MayaJS {
  // Express variables
  private app: Express = express();
  private routes: Router = express.Router();

  // Defines 3rd party plugins
  private logger: RequestHandler | null = null;
  private bodyParser: { json?: RequestHandler; urlencoded?: RequestHandler } = {
    json: bodyparser.json({ limit: "50mb" }),
    urlencoded: bodyparser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000000 }),
  };

  // Local variables
  private hasLogs = false;
  private entryPoint = express.Router();

  // Array of database
  private databases: DatabaseModule[] = [];

  constructor(module: AppModule) {
    // Sets default values from app module options
    this.parseAppModuleOptions(module);
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
      // Set body parser object
      this.bodyParser = bodyParser;
    }
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
    const routes = Reflect.getMetadata(CONTROLLER_ROUTES, module);
    const databases = Reflect.getMetadata(DATABASE, module);
    const entryPoint = Reflect.getMetadata(MODULE_BOOTSTRAP, module);

    // Sets database value
    this.databases = databases;

    // Sets routes value
    this.routes = setRoutes(routes);

    // Sets entry point
    this.entryPoint = resolveControllerRoutes(entryPoint, "", express.Router());
  }

  /**
   * Sets the default plugins for MayaJS routes
   */
  private setDefaultPlugins() {
    // Sets default cors plugin
    this.app.use(CORS);

    // Sets default body parser plugin
    this.app.use(this.bodyParser.json as RequestHandler);
    this.app.use(this.bodyParser.urlencoded as RequestHandler);

    // Sets default logger plugin
    this.app.use(this.logger ? this.logger : morgan(PRODUCTION ? "tiny" : "dev"));
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

      // Sets default logger, body parser and cors plugin
      this.setDefaultPlugins();

      // Use the routes before connecting the database
      this.app.use("/", this.entryPoint);
      this.app.use("/", this.routes);
      this.app.use(unhandleRoutes());

      // Connects all database instances
      connectDatabase(this.databases, this.hasLogs).catch(error => {
        // Catch any errors
        console.log(`\n\x1b[31m${error}\x1b[0m`);
      });
    };
  }
}
