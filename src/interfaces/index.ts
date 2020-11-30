import { Callback, RequestMethod } from "../types";
import { RequestHandler, Router } from "express";

export interface Route {
  path: string; // Path to our route
  requestMethod: RequestMethod; // HTTP Request method (get, post, patch, delete, put)
  methodName: string; // Method name within our class responsible for this route
  middlewares: Callback[]; // Middleware for validition of route
}

export interface DatabaseModule {
  name: string;
  instance: any;
  connect: () => Promise<any>;
  connection: (logs: boolean) => void;
  models: (array?: ModelList[]) => any;
}

export interface ModuleOptions {
  bootstrap?: Class<any>;
  declarations?: Class<any>[];
  imports?: Class<any>[];
  exports?: Class<any>[];
}

export interface ModelList {
  name: string;
  path: string;
}

export interface MayaJSModule extends Partial<ModuleOptions> {
  new (): {};
}

export interface Class<T> extends Function {
  new (...args: any[]): T;
}

export interface RoutesOptions {
  path: string;
  canActivate?: Class<any>;
  canActivateChild?: Class<any>;
  controller?: Class<any>;
  children?: RoutesOptions[];
}

export interface IRoutes {
  path: string;
  middlewares?: any;
  router: Router;
}

export interface ModelDictionary<T> {
  [k: string]: T;
}

export interface IBodyParser {
  json: RequestHandler;
  urlencoded: RequestHandler;
}
