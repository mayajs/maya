import { RequestMethod, InjectableDecorator, Type } from "../typings";
import { Runner, Functions, DIContainer } from "../validator";
import { NextFunction, Request, Response } from "express";
import { IChain, IRoute, IMethod } from "../interfaces";
import callsite from "callsite";
import path from "path";

/**
 * Factory function for a decorator that recieve a method type and return a MethodDecorator
 * @param method Type of method to be applied on the route ie: "get" | "post" | "delete" | "options" | "put" | "patch"
 * @returns Function(param: IMethod) => MethodDecorator
 */
function MethodDecoratorFactory(method: RequestMethod): (param: IMethod) => MethodDecorator {
  return ({ path, middlewares = [] }: IMethod): MethodDecorator => {
    return (target: object, propertyKey: string | symbol): void => {
      // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
      // To prevent any further validation simply set it to an empty array here.
      if (!Reflect.hasMetadata("routes", target.constructor)) {
        Reflect.defineMetadata("routes", [], target.constructor);
      }

      // Get the routes stored so far, extend it by the new route and re-set the metadata.
      const routes = Reflect.getMetadata("routes", target.constructor) as IRoute[];

      routes.push({
        methodName: propertyKey as string,
        middlewares,
        path,
        requestMethod: method,
      });

      // Add routes metadata to the target object
      Reflect.defineMetadata("routes", routes, target.constructor);
    };
  };
}

/**
 * GET Method Decorator
 * @param properties - Sets the path and validation for this method.
 */
export function Get(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  return MethodDecoratorFactory("get")(properties);
}

/**
 * POST Method Decorator
 * @param properties - Sets the path and validation for this method.
 */
export function Post(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  return MethodDecoratorFactory("post")(properties);
}

/**
 * PATCH Method Decorator
 * @param properties - Sets the path and validation for this method.
 */
export function Patch(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  return MethodDecoratorFactory("patch")(properties);
}

/**
 * PUT Method Decorator
 * @param properties - Sets the path and validation for this method.
 */
export function Put(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  return MethodDecoratorFactory("put")(properties);
}

/**
 * DELETE Method Decorator
 * @param properties - Sets the path and validation for this method.
 */
export function Delete(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  return MethodDecoratorFactory("delete")(properties);
}

/**
 * Decorator for a controller of a route
 * @param prefix name of the controller that will be added on the route name
 */
export function Controller({ route, model }: { route: string; model: string }): ClassDecorator {
  let modelPath = "";

  callsite().forEach(site => {
    const fullPath = site.getFileName();
    if (fullPath.includes(".controller.")) {
      const fileDir = fullPath.includes("/") ? fullPath.split("/") : fullPath.split("\\");
      const filename = fileDir[fileDir.length - 1];
      const noFilename = fullPath.replace(filename, "");
      modelPath = path.join(noFilename, model).replace(/\\/g, "/");
    }
  });

  return (target: any): void => {
    Reflect.defineMetadata("prefix", route, target);
    Reflect.defineMetadata("model", modelPath, target);

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
}

/**
 * @returns {InjectableDecaorator<Type<any>>}
 * @constructor
 */
export function Injectable(): InjectableDecorator<Type<any>> {
  return <T extends new (...args: any[]) => {}>(constructor: T): T => {
    return class extends constructor {};
  };
}

export function Check(fieldName: string): IChain {
  const runner = new Runner(fieldName);
  const middleware: any = (req: Request, res: Response, next: NextFunction) => {
    const error = runner.run(req);
    if (error.status) {
      res.status(403).json({ status: "Validation Error", message: error.message });
    } else {
      next();
    }
  };
  return Object.assign(middleware, DIContainer(new Functions<IChain>(runner, middleware)));
}
