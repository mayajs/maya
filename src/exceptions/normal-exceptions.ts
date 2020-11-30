import { DUPLICATE_DECLARATIONS, EMPTY_DECLARATIONS, NOT_FOUND } from "./message";

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
export const NotFoundError = (message: string) => new Error(NOT_FOUND(message));
