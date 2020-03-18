import { RequestMethod, InjectableDecorator, Type } from "../types";
import { Runner, Functions, DIContainer } from "../validator";
import { NextFunction, Request, Response } from "express";
import { IChain, IRoute, IMethod } from "../interfaces";
import { MethodDecoratorFactory } from "./Factory";

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
