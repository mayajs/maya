// LOCAL IMPORTS
import { Class, MayaJSModule } from "../interfaces";
import { DuplicateDeclarationError } from "../exceptions";
import { CONTROLLER_NAME, MODULE_DECLARATIONS } from "../utils/constants";

interface MemoizeControllers {
  [name: string]: Class<any>;
}

/**
 * List of all cached controllers
 */
let CONTROLLERS: MemoizeControllers = {};

/**
 * Parse a MayaJS Module
 *
 * @param module MayaJSModule
 */
export function moduleParser(module: MayaJSModule) {
  // Get module declaration metadata
  const declarations = Reflect.getMetadata(MODULE_DECLARATIONS, module);

  // Check if declrations has items
  if (declarations.length === 0) {
    // Create error message
    const error = `${module.name} has no declared controllers.`;

    // Throw error if module has no declared controllers
    throw new Error(error);
  }

  // Map declarations
  declarations.map(iterateControllerModule(module.name));
}

/**
 * Factory function for mapping of declarations
 *
 * @param moduleName Name of the module
 * @param controllers List of controllers that has already been cache
 */
function iterateControllerModule(moduleName: string, controllers: string[] = []) {
  return (controller: Class<any>) => {
    // Get metadata for control key
    const controlKey = Reflect.getMetadata(CONTROLLER_NAME, controller);
    // Check if controller is already been declared
    const hasDuplicate = controllers.some(key => key === controlKey);

    // Check duplicated controller for current module
    if (hasDuplicate) {
      // Throw error if module has no declared controllers
      throw DuplicateDeclarationError(moduleName, controller.name);
    }

    // Check controller if its already cache
    if (!CONTROLLERS[controlKey]) {
      // If not add it on cached controllers
      CONTROLLERS[controlKey] = controller;

      // Add control key on declared controllers
      controllers.push(controlKey);
    }
  };
}
