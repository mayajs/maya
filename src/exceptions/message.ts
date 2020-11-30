/**
 * An error message for duplicated controller declaration of a module
 */
export const DUPLICATE_DECLARATIONS = (module: string, controller: string) => `${module} has duplicated declaration for ${controller}.`;

/**
 * An error message for empty declaration
 */
export const EMPTY_DECLARATIONS = (module: string) => `${module} has no declared controllers.`;

/**
 * An error message for not finding something
 */
export const NOT_FOUND = (message: string) => `${message} not found.`;
