import express, { NextFunction, Request, Response, Router } from "express";
import { Route, RoutesOptions } from "../interfaces";
import { CONTROLLER_ROUTES } from "../utils";
import { Callback } from "../types";
import { Injector } from "../di";

/**
 * Sets the routes to be injected as a middleware
 *
 * @param routes IRoutesOptions[] - A list of routes options for each routes
 * @return Router instance
 */
export function setRoutes(routes: RoutesOptions[] = []): Router {
  // Create a router instance
  let router = express.Router();

  if (!routes) {
    // Returns router instance if routes is undefined
    return router;
  }

  // Map all rooutes
  routes.map((route: RoutesOptions) => {
    // Resolve route controller
    router = resolveControllerRoutes(route.controller, route.path, router);
    // Map route children
    router = mapRouteChildren(route, route.path, router);
  });

  // Returns router instance
  return router;
}

/**
 * Recursively map all children form a route
 *
 * @param route IRoutesOptions - An object defining a route
 * @param parentPath Name of the path from a parent
 * @param router Instance of Router class
 * @returns Router instance
 */
function mapRouteChildren(route: RoutesOptions, parentPath: string, router: Router): Router {
  // Checks if children has routes
  if (route?.children?.length === 0) {
    // Returns router instance
    return router;
  }

  // Map all children
  route.children?.map((child: RoutesOptions) => {
    // Checks if child has controller
    if (child?.controller) {
      // Resolves controller routes
      router = resolveControllerRoutes(child.controller, parentPath + child.path, router);
    }

    // Recursive call
    mapRouteChildren(child, parentPath + child.path, router);
  });

  // Returns router instance
  return router;
}

/**
 * Factory method for setting status code of a response
 *
 * @param res  Response object
 * @returns Middleware
 */
function setStatusCode(res: Response) {
  return (code: number) => {
    res.status(code);
  };
}

/**
 * Factory method for generating instance route
 *
 * @param instance Instance of a controller class
 * @param name The name of the method
 */
function instanceMethodFactory(instance: any, name: string): Callback {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Set header to powered by MayaJS
    res.setHeader("X-Powered-By", "MayaJS");

    // Defines a function to set response status code
    const statusCode = setStatusCode(res);

    // Try to execute route method
    try {
      // Wait for the method to finished
      const object = await instance[name]({ req, res, statusCode });

      // Send data if there is any
      if (object) {
        res.send(object);
      }
    } catch (error) {
      // Creates url request
      const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

      // Send a 500 status code and message when an error is caught
      res.status(500).json({ status: "Internal Server Error", message: `MayaJS Error: Can't proccess request from ${url}.` });
    }
  };
}

/**
 * Resolves all routes from the controller metadata
 *
 * @param controller Instance of a controller class
 * @param parent The name of the parent route
 * @param router Instance of a Router class
 */
export function resolveControllerRoutes(controller: any, parent: string, router: Router) {
  if (!controller) {
    // Return router instance if controller is undefined
    return router;
  }

  // Resolve controller dependy injection
  const instance = Injector.resolve<typeof controller>(controller);

  // Get all the routes from metadata
  const routes: Route[] = Reflect.getMetadata(CONTROLLER_ROUTES, controller);

  // Map all the routes from the controller
  routes.map((route: Route) => router[route.requestMethod](parent + route.path, route.middlewares, instanceMethodFactory(instance, route.methodName)));

  // Return router instance
  return router;
}

/**
 * Function that checks unhandle route errors from the app/express instance
 */
export function unhandleRoutes(): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    if (!req.route) {
      res.setHeader("X-Powered-By", "MayaJS");
      const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
      return res.status(500).json({ status: "Invalid Request", message: `MayaJS Error: (${req.method}) ${url} is not defined!` });
    }
  };
}
