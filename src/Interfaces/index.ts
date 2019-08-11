import { Callback, RequestMethod } from "../typings";
import { ConnectionOptions } from "mongoose";

export interface IRoute {
  path: string; // Path to our route
  requestMethod: RequestMethod; // HTTP Request method (get, post, patch, delete, put)
  methodName: string; // Method name within our class responsible for this route
  validations: Callback[]; // Middleware for validition of route
}

export interface IMethod {
  path: string; // Path to our method
  validations?: Callback[]; // Middleware for validition of method
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

export interface IAppSettings {
  cors?: boolean; // Enable CORS default false
  logs?: string; // Enable logging OPTIONAL

  // Connect to MongoDB OPTIONAL
  mongoConnection?: {
    url: string; // Connection string
    options?: ConnectionOptions | undefined; // Mongoose connect options OPTIONAL
  };

  // Port number where the server will listen
  port?: number; // Default 3333

  // List of routes with controllers and middlewares
  routes: Array<{
    callback?: Function; // This call function will be called last
    controllers: Controllers[]; // List of Controllers
    middlewares: Function[]; // Middlewares for all the routes i.e. JWT Authentication
    path: string; // Main path of this route
  }>;
}
