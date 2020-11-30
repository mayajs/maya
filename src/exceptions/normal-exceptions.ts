import { DUPLICATE_DECLARATIONS, EMPTY_DECLARATIONS, NOT_DECLARED, NOT_DECLARED_MODULE, NOT_FOUND } from "./message";

/**
 * Create an Error instance for duplicated declaration
 */
export const DuplicateDeclarationError = (module: string, controller: string) => new Error(DUPLICATE_DECLARATIONS(module, controller));

/**
 * Create an Error instance for empty declaration
 */
export const EmptyDeclarationError = (module: string) => new Error(EMPTY_DECLARATIONS(module));

/**
 * Create an Error instance for not found
 */
export const NotFoundError = (target: string) => new Error(NOT_FOUND(target));

/**
 * Create an Error instance for undeclared components
 */
export const NotDeclaredError = (target: string) => new Error(NOT_DECLARED(target));

/**
 * Create an Error instance for undeclared components on a module
 */
export const UndeclaredDeclarationError = (target: string, module: string) => new Error(NOT_DECLARED_MODULE(target, module));
