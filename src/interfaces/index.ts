import { Callback, RequestMethod, ErrorCallback } from "../types";
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

export interface IAppSettings {
  plugins?: any[]; // Enable CORS default false
  cors?: boolean; // Enable CORS default false
  database?: DatabaseModule; // Database module
  databases?: DatabaseModule[]; // List of Database module
  logs?: string; // Enable logging OPTIONAL
  port?: number; // Port number where the server will listen Default 3333
  routes: IRoutesOptions[]; // List of routes with controllers and middlewares
}

export interface ModelList {
  name: string;
  path: string;
}

export interface AppModule {
  new (): {};
  cors?: boolean;
  logs?: string;
  port?: number;
  databases?: DatabaseModule[];
  plugins?: any[];
  routes?: IRoutes[];
}

export interface IRoutesOptions {
  path?: string;
  controllers: any[];
  middlewares?: any[];
  callback?: ErrorCallback;
}

export interface IRoutes {
  path: string;
  middlewares?: any;
  router: Router;
}

export interface ModelDictionary<T> {
  [k: string]: T;
}
