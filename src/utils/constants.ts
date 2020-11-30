import { ModuleConstantsKeys } from "../types";

// VARIABLES
export const PATH = "__path__";
export const METHOD = "__method__";
export const NAME = "__name__";
export const MIDDLEWARE = "__middleware__";
export const GUARDS = "__guards__";
export const MODULE_PATH = "__mod:path__";
export const MODULE_NAME = "__mod:name__";
export const MODULE_IMPORTS = "__mod:imports__";
export const MODULE_EXPORTS = "__mod:exports__";
export const MODULE_DECLARATIONS = "__mod:declarations__";
export const MODULE_BOOTSTRAP = "__mod:bootstrap__";
export const CONTROLLER_NAME = "__control:name__";
export const CONTROLLER_ROUTES = "__control:routes__";
export const DATABASE = "__database__";
export const DATABASE_NAME = "__db:name__";
export const DATABASE_CONNECTION = "__db:conn__";
export const MODULE_CONSTANTS = { MODULE_PATH, MODULE_IMPORTS, MODULE_EXPORTS, MODULE_DECLARATIONS, MODULE_BOOTSTRAP };

// FUNCTIONS
export const getModuleConstant = (key: string): string => {
  const value = MODULE_CONSTANTS[key as ModuleConstantsKeys];

  if (!value || value === undefined) {
    throw new Error("Constants key value is not found");
  }

  return value;
};
