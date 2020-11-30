// LOCAL IMPORTS
import { Class, MayaJSModule } from "../interfaces";
import { DuplicateDeclarationError, EmptyDeclarationError, UndeclaredDeclarationError } from "../exceptions";
import { CONTROLLER_NAME, MODULE_BOOTSTRAP, MODULE_DECLARATIONS, MODULE_PATH } from "../utils/constants";
import { Metadata } from "./metadata";

interface MemoizeControllers {
  [name: string]: Class<any>;
}

interface ModuleController {
  path: string;
  controller: Class<any>;
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

  // Map all declarations and return an array of cotrollers
  const controllers = declarations.map(iterateControllerModule(module.name));

  // Get bootstrap metadata in a module
  const bootstrap = metadata.get(MODULE_BOOTSTRAP);

  // Resolve boostrap controller
  const resolve = resolveBoostrap(bootstrap);

  if (!resolve) {
    // If bootstrap is not resolve throw an error
    throw UndeclaredDeclarationError(bootstrap.name, module.name);
  }

  // If resolve is not a boolean get the module path and assign it to resolve.path
  if (typeof resolve !== "boolean") {
    const modulePath = metadata.get(MODULE_PATH);
    resolve.path = modulePath;
  }
}

/**
 * Resolve bootstrap metadata controller
 *
 * @param bootstrap Instance of controller class
 */
function resolveBoostrap(bootstrap: Class<any>): ModuleController | boolean {
  if (!bootstrap) {
    // If boostrap is undefined return immediately
    return true;
  }

  // Get controller key metadata in boostrap and check if it is already cached
  if (!CONTROLLERS[getControllerKey(bootstrap)]) {
    // If not cached return false
    return false;
  }

  return { path: "", controller: bootstrap };
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

    // Return controller that are not duplicate
    return controller;
  };
}
