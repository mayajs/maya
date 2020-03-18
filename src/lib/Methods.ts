import { RequestMethod, InjectableDecorator, Type } from "../types";
import { Runner, Functions, DIContainer } from "../validator";
import { NextFunction, Request, Response } from "express";
import { IChain, IRoute, IMethod } from "../interfaces";
import { MethodDecoratorFactory } from "./Factory";
import callsite from "callsite";
import path from "path";

/**
 * GET Method Decorator
 *
 * @deprecated Since version 0.3.0. Will be deleted in version 1.0.0. Import this method in `@mayajs/common` instead.
 * @param properties - Sets the path and validation for this method.
 */
export function Get(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  console.log("Get Decorator is deprecated since version 0.3.0. Will be deleted in version 1.0.0. Import this decorator in @mayajs/common instead.");
  return MethodDecoratorFactory("get")(properties);
}

/**
 * POST Method Decorator
 *
 * @deprecated Since version 0.3.0. Will be deleted in version 1.0.0. Import this method in `@mayajs/common` instead.
 * @param properties - Sets the path and validation for this method.
 */
export function Post(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  console.log("Post decorator is deprecated since version 0.3.0. Will be deleted in version 1.0.0. Import this decorator in @mayajs/common instead.");
  return MethodDecoratorFactory("post")(properties);
}

/**
 * PATCH Method Decorator
 *
 * @deprecated Since version 0.3.0. Will be deleted in version 1.0.0. Import this method in `@mayajs/common` instead.
 * @param properties - Sets the path and validation for this method.
 */
export function Patch(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  console.log("Patch decorator is deprecated since version 0.3.0. Will be deleted in version 1.0.0. Import this decorator in @mayajs/common instead.");
  return MethodDecoratorFactory("patch")(properties);
}

/**
 * PUT Method Decorator
 *
 * @deprecated Since version 0.3.0. Will be deleted in version 1.0.0. Import this method in `@mayajs/common` instead.
 * @param properties - Sets the path and validation for this method.
 */
export function Put(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  console.log("Put decorator is deprecated since version 0.3.0. Will be deleted in version 1.0.0. Import this decorator in @mayajs/common instead.");
  return MethodDecoratorFactory("put")(properties);
}

/**
 * DELETE Method Decorator
 *
 * @deprecated Since version 0.3.0. Will be deleted in version 1.0.0. Import this method in `@mayajs/common` instead.
 * @param properties - Sets the path and validation for this method.
 */
export function Delete(properties: { path: string; middlewares?: Array<(...args: any[]) => void> }): MethodDecorator {
  console.log("Delete decorator is deprecated since version 0.3.0. Will be deleted in version 1.0.0. Import this decorator in @mayajs/common instead.");
  return MethodDecoratorFactory("delete")(properties);
}

/**
 * Decorator for a controller of a route
 * @param prefix name of the controller that will be added on the route name
 */
export function Controller({ route, model = "" }: { route: string; model?: string }): ClassDecorator {
  let modelPath = "";

  callsite().forEach(site => {
    const fullPath = site.getFileName();
    if (fullPath.includes(".controller.")) {
      const fileDir = fullPath.includes("/") ? fullPath.split("/") : fullPath.split("\\");
      const filename = fileDir[fileDir.length - 1];
      const noFilename = fullPath.replace(filename, "");
      if (model) {
        modelPath = path.resolve(noFilename, model);
      }
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

/**
 * Checks a specified field for validation
 *
 * @deprecated Since version 0.3.0. Will be deleted in version 1.0.0. Import this method in `@mayajs/common` instead.
 * @param fieldName name of the field to be checked
 */
export function Check(fieldName: string): IChain {
  console.log("Check is deprecated since version 0.3.0. Will be deleted in version 1.0.0. Import this decorator in @mayajs/common instead.");
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
