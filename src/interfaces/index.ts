import { Callback, RequestMethod } from "../types";
import { Router } from "express";

export interface IRoute {
  path: string; // Path to our route
  requestMethod: RequestMethod; // HTTP Request method (get, post, patch, delete, put)
  methodName: string; // Method name within our class responsible for this route
  middlewares: Callback[]; // Middleware for validition of route
}

export interface IMethod {
  path: string; // Path to our method
  middlewares?: Callback[]; // Middleware for validition of method
}

export interface IFunctions<Chain> {
  body(): this;
  params(): this;
  isBoolean(value?: RegExp): Chain;
  isString(value?: RegExp): Chain;
  isAddress(value?: RegExp): Chain;
  minLength(value: number): Chain;
  maxLength(value: number): Chain;
  isDate(): Chain;
  isEmail(): Chain;
  isPassword(): Chain;
}

export interface IChain extends IFunctions<IChain> {
  (req: any, res: any, next: (error?: any) => void): void;
}

export interface DatabaseModule {
  name: string;
  instance: any;
  connect: () => Promise<any>;
  connection: (logs: boolean) => void;
  models: (array?: ModelList[]) => any;
}

export interface IAppModuleOptions {
  declarations?: any[];
  imports?: any[];
  exports?: any[];
  databases?: DatabaseModule[]; // List of Database module
  routes?: IRoutesOptions[]; // List of routes with controllers and middlewares
}

export interface ModelList {
  name: string;
  path: string;
}

export interface AppModule extends IAppModuleOptions {
  new (): {};
}

export interface Class<T> extends Function {
  new (...args: any[]): T;
}

export interface IRoutesOptions {
  path: string;
  canActivate?: Class<any>;
  canActivateChild?: Class<any>;
  controller?: Class<any>;
  children?: IRoutesOptions[];
}

export interface IRoutes {
  path: string;
  middlewares?: any;
  router: Router;
}

export interface ModelDictionary<T> {
  [k: string]: T;
}
