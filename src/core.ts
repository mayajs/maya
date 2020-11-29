import express, { RequestHandler, Express, Router } from "express";

// Node import
import http from "http";

// 3rd party plugin imports
import * as bodyparser from "body-parser";
import morgan from "morgan";
import cors from "cors";

// Local imports
import { setRoutes, resolveControllerRoutes, unhandleRoutes, connectDatabase } from "./modules";
import { DatabaseModule, AppModule, Class, IBodyParser } from "./interfaces";
import { CONTROLLER_ROUTES, DATABASE, MODULE_BOOTSTRAP } from "./utils";
import { BodyParserKeys } from "./types";

/**
 * Defines an instance of ExpressJS
 */
const APP: Express = express();

/**
 * Defines production variable. Default = false
 */
let PRODUCTION = false;

/**
 * Defines logging permission. Default = true
 */
let LOGS = true;

/**
 * Defines cors settings
 */
let CORS: RequestHandler = cors();

/**
 * Defines logger middleware
 */
let LOGGER: RequestHandler | null = null;

/**
 * Defines a parsers for request body
 */
let BODY_PARSER: IBodyParser = {
  json: bodyparser.json({ limit: "50mb" }),
  urlencoded: bodyparser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000000 }),
};

/**
 * Defines a list of RequestHandler
 */
let PLUGINS: RequestHandler[] = [];

/**
 * Enable MayaJS to run on production mode
 */
export const enableProdMode = () => {
  PRODUCTION = true;
};

/**
 * Sets MayaJS logging permissions
 */
export const setLogging = (hasLogs: boolean) => {
  LOGS = hasLogs;
};

/**
 * Set default CORS options
 *
 * @param cors A middleware function that sets the cors settings of an incoming request
 */
export const setCORS = (cors: RequestHandler) => {
  CORS = cors;
};

/**
 * Set default logger
 *
 * @param logger A middleware function that logs request
 */
export const setLogger = (logger: RequestHandler) => {
  LOGGER = logger;
};

/**
 * Set default parser for request body
 *
 * @param parser A set of middleware functions that parses an incoming request body
 */
export const setBodyParser = (parser: Partial<IBodyParser>) => {
  const keys = Object.keys(parser);
  // Check if body parser has keys
  if (keys.length > 0) {
    // Set body parser object
    keys.map(key => {
      // Define body parser key
      const parserKey = key as BodyParserKeys;

      // Set parser key value to BODY_PARSER with the same key
      BODY_PARSER[parserKey] = parser[parserKey] as RequestHandler;
    });
  }
};

/**
 * Adds array of middleware functions before initialization routes
 *
 * @param plugins RequestHandler[] - List callback function from a middleware
 */
export const setPlugins = (plugins: RequestHandler[]) => {
  PLUGINS = plugins;
};

/**
 * Adds middleware function to app instance
 *
 * @param middleware RequestHandler - Callback function from a middleware
 */
export const usePlugin = (middleware: RequestHandler) => {
  APP.use(middleware);
};

/**
 * Creates an instance of MayaJS Server on runtime.
 *
 * @param module MayaJS Module
 */
export const bootstrapModule = (module: Class<any>) => {
  return new MayaJS(module);
};

class MayaJS {
  /**
   * Defines list of routes
   */
  private routes: Router = express.Router();

  /**
   * Defines entry point for the main route
   */
  private entryPoint = express.Router();

  /**
   * Defines list of databases
   */
  private databases: DatabaseModule[] = [];

  constructor(private module: AppModule) {
    // Initialize MayaJS components
    this.onInit();
  }

  /**
   * Run the server using the port specified.
   * @param port number - Specify port number that the server will listen too. Default `3333`.
   * @returns An instance of http.Server
   */
  start(port: number = 3333): http.Server {
    // Create server instance
    const server = http.createServer(APP);

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
   * Inititalize Mayajs
   *
   * @returns Mayajs instance
   */
  private onInit() {
    // Sets default values from app module options
    this.parseAppModuleOptions(this.module);

    // Use all defined plugins
    this.iteratePlugins();

    return this;
  }

  /**
   * Iterate all plugins and use it on the app instance
   */
  private iteratePlugins() {
    // Iterate all plugins
    for (const plugin of PLUGINS) {
      // Use plugins on app instance
      APP.use(plugin);
    }
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
    APP.use(CORS);

    // Sets default body parser plugin
    APP.use(BODY_PARSER.json);
    APP.use(BODY_PARSER.urlencoded);

    // Only sets logger if logging is enable
    if (LOGS) {
      // Sets default logger plugin
      APP.use(LOGGER ? LOGGER : morgan(PRODUCTION ? "tiny" : "dev"));
    }
  }

  /**
   * A factory function for listening to server calls
   *
   * @param port Port number where the server is running
   */
  private onListen(port: number): () => void {
    return () => {
      // Check if logs are enable
      if (LOGS) {
        console.log(`\x1b[32m[mayajs] Server running on port ${port}\x1b[0m`);
      }

      // Sets default logger, body parser and cors plugin
      this.setDefaultPlugins();

      // Use the routes before connecting the database
      APP.use("/", this.entryPoint);
      APP.use("/", this.routes);
      APP.use(unhandleRoutes());

      // Connects all database instances
      connectDatabase(this.databases, LOGS).catch(error => {
        // Catch any errors
        console.log(`\n\x1b[31m${error}\x1b[0m`);
      });
    };
  }
}
