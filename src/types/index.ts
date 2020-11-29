import { NextFunction, Request, Response } from "express";
import { ModuleOptions } from "../interfaces";

/**
 * Type for what object is instances of
 */
export type Type<T> = new (...args: any[]) => T;

/**
 * Generic `ClassDecorator` type
 */
export type InjectableDecorator<T> = (target: T, ...args: any[]) => void;

/**
 * Type for function request callback
 */
export type Callback = (...args: any[]) => void;

/**
 * Type of request method
 */
export type RequestMethod = "get" | "post" | "delete" | "options" | "put" | "patch";

export type ErrorCallback = (error: any, req: Request, res: Response, next: NextFunction) => void;

export type ModuleOptionsKeys = keyof ModuleOptions;
