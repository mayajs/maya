// LOCAL IMPORTS
import { Class, MayaJSModule } from "../interfaces";
import { DuplicateDeclarationError, EmptyDeclarationError, NotDeclaredError } from "../exceptions";
import { CONTROLLER_NAME, MODULE_BOOTSTRAP, MODULE_DECLARATIONS } from "../utils/constants";
import { Metadata } from "./metadata";

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
  // Create an instance of metadata
  const metadata = new Metadata(module);
  // Get module declaration metadata
  const declarations = metadata.get(MODULE_DECLARATIONS);

  // Check if declrations has items
  if (declarations.length === 0) {
    // Throw error if module has no declared controllers
    throw EmptyDeclarationError(module.name);
  }

  // Map declarations
  declarations.map(iterateControllerModule(module.name));

  // Get bootstrap metadata in a module
  const bootstrap = metadata.get(MODULE_BOOTSTRAP);

  // Resolve boostrap controller
  resolveBoostrap(bootstrap);
}

/**
 * Resolve bootstrap metadata controller
 *
 * @param bootstrap Instance of controller class
 */
function resolveBoostrap(bootstrap: Class<any>) {
  if (!bootstrap) {
    // If boostrap is undefined return immediately
    return;
  }

  // Get controller key metadata in boostrap
  const controlKey = getControllerKey(bootstrap);
  // Check if controller key is cached
  const isCached = CONTROLLERS[controlKey];

  if (!isCached) {
    // If not cached throw an error
    throw NotDeclaredError(bootstrap.name);
  }
}

/**
 * Get controller key from metadata
 *
 * @param controller Instance of controller class
 */
function getControllerKey(controller: Class<any>) {
  return Reflect.getMetadata(CONTROLLER_NAME, controller);
}

/**
 * Factory function for mapping of declarations
 *
 * @param moduleName Name of the module
 * @param controllers List of controllers that has already been cache
 */
function iterateControllerModule(moduleName: string, controllers: string[] = []) {
  return (controller: Class<any>) => {
    // Get metadata for controller key
    const controlKey = getControllerKey(controller);
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
