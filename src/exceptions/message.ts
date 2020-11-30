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
export const NOT_FOUND = (target: string) => `${target} not found.`;

/**
 * An error message for undeclared components
 */
export const NOT_DECLARED = (target: string) => `${target} is not declared.`;

/**
 * An error message for undeclared components on a module
 */
export const NOT_DECLARED_MODULE = (target: string, module: string) => `${target} is not declared in ${module}.`;
