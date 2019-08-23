import { Callback, RequestMethod, ErrorCallback } from "../typings";
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

export interface Database {
  connect: () => Promise<any>;
  connection: (logs: boolean) => void;
}

export interface IAppSettings {
  cors?: boolean; // Enable CORS default false
  database?: Database; // Database module
  logs?: string; // Enable logging OPTIONAL
  port?: number; // Port number where the server will listen Default 3333
  routes: IRoutesOptions[]; // List of routes with controllers and middlewares
}

export interface ModelList {
  name: string;
  path: string;
}

export interface AppModule {
  models: ModelList[];
  cors: boolean;
  database: Database;
  logs: string;
  port: number;
  routes: IRoutes[];
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

export interface Controllers {}
