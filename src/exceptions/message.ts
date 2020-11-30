/**
 * An error message for duplicated controller declaration of a module
 */
export const DUPLICATE_DECLARATIONS = (module: string, controller: string) => `${module} has duplicated declaration for ${controller}.`;
