import { NextFunction, Request, Response } from "express";
import { IBodyParser, ModuleProperty } from "../interfaces";
import { MODULE_CONSTANTS } from "../utils";

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

/**
 * Callback function for error call
 */
export type ErrorCallback = (error: any, req: Request, res: Response, next: NextFunction) => void;

/**
 * List of module options keys
 */
export type ModuleOptionsKeys = keyof ModuleProperty;

/**
 * List of module constants keys
 */
export type ModuleConstantsKeys = keyof typeof MODULE_CONSTANTS;

/**
 * List of body parser keys
 */
export type BodyParserKeys = keyof IBodyParser;
