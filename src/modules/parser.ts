// LOCAL IMPORTS
import { Class, MayaJSModule } from "../interfaces";
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

  // Define a list of declared control key
  const declared: string[] = [];

  // Map declarations
  declarations.map((controller: Class<any>) => {
    // Get metadata for control key
    const controlKey = Reflect.getMetadata(CONTROLLER_NAME, controller);
    // Check if controller is already been declared
    const hasDuplicate = declared.some(key => key === controlKey);

    // Check duplicated controller for current module
    if (hasDuplicate) {
      // Create error message
      const error = `${module.name} has duplicated declaration for ${controller.name}.`;

      // Throw error if module has no declared controllers
      throw new Error(error);
    }

    // Check controller if its already cache
    if (!CONTROLLERS[controlKey]) {
      // If not add it on cached controllers
      CONTROLLERS[controlKey] = controller;

      // Add control key on declared controllers
      declared.push(controlKey);
    }
  });
}
