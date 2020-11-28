import express, { NextFunction, Request, Response, Router } from "express";
import { IRoute, IRoutesOptions } from "..";
import { Callback } from "../types";
import { Injector } from "../di";

/**
 * Sets the routes to be injected as a middleware
 *
 * @param routes IRoutesOptions[] - A list of routes options for each routes
 * @return Router instance
 */
export function setRoutes(routes: IRoutesOptions[] = []): Router {
  // Create a router instance
  let router = express.Router();

  // Map all rooutes
  routes.map((route: IRoutesOptions) => {
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
function mapRouteChildren(route: IRoutesOptions, parentPath: string, router: Router): Router {
  // Checks if children has routes
  if (route?.children?.length === 0) {
    // Returns router instance
    return router;
  }

  // Map all children
  route.children?.map((child: IRoutesOptions) => {
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

function instanceMethodFactory(instance: any, name: string): Callback {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Set header to powered by MayaJS
    res.setHeader("X-Powered-By", "MayaJS");

    // Try to execute route method
    try {
      // Wait for the method to finished
      const object = await instance[name](req, res, next);

      // Set status code if there is any
      if (object.statusCode) {
        res.status(object.statusCode);

        // Remove status code from data object
        delete object.statusCode;
      }

      // Send data.response if there is any
      if (object.response) {
        res.send(object.response);
        return;
      }

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
  // Create a callback function
  const callback = (error: any, req: Request, res: Response, next: NextFunction): void => next();

  // Resolve controller dependy injection
  const instance = Injector.resolve<typeof controller>(controller);

  // Get all the routes from metadata
  const routes: IRoute[] = Reflect.getMetadata("routes", controller);

  // Map all the routes from the controller
  routes.map((route: IRoute) => router[route.requestMethod](parent + route.path, route.middlewares, instanceMethodFactory(instance, route.methodName)));

  // Return router instance
  return router;
}
