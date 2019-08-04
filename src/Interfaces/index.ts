import { Callback, RequestMethod } from "..";

export interface IRoute {
  // Path to our route
  path: string;
  // HTTP Request method (get, post, ...)
  requestMethod: RequestMethod;
  // Method name within our class responsible for this route
  methodName: string;
  // Middleware for validition of route
  validations: Callback[];
}

export interface IMethod {
  path: string;
  validations?: Callback[];
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
  (req: Request, res: any, next: (error?: any) => void): void;
}
