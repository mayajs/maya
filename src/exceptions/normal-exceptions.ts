import { DUPLICATE_DECLARATIONS } from "./message";

/**
 * Create an Error instance for duplicated declaration
 */
export const DuplicateDeclarationError = (module: string, controller: string) => new Error(DUPLICATE_DECLARATIONS(module, controller));
