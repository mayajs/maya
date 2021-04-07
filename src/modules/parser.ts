// LOCAL IMPORTS
import { Class, MayaJSModule } from "../interfaces";
import { DuplicateDeclarationError, UndeclaredDeclarationError } from "../exceptions";
import { CONTROLLER_NAME, MODULE_BOOTSTRAP, MODULE_DECLARATIONS, MODULE_IMPORTS, MODULE_NAME, MODULE_PATH } from "../utils/constants";
import { Metadata } from "./metadata";

interface MemoizeControllers {
  [name: string]: Class<any>;
}

/**
 * Shape of a module controller object
 *
 * @property path
 * @property controller
 */
interface ModuleController {
  /**
   * Controller path reference when creating a route
   */
  path: string;

  /**
   * Controller class that will be used for routing
   */
  controller: Class<any>;
}

/**
 * Extended module controller object for bootstrap contoller
 *
 * @property path
 * @property controller
 * @property key
 */
interface BootstrapController extends ModuleController {
  /**
   * Key of controller
   */
  key: string;
}

/**
 * Shape of entry point controller object
 *
 * @property declared
 * @property index
 */
interface EntryPoint {
  /**
   * State if an entry point controller is declared. Default `false`
   */
  declared: boolean;

  /**
   * State the index of entry point controller. Default `0`
   */
  index: number;
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
export function moduleParser(module: MayaJSModule, routes: ModuleController[] = []): ModuleController[] {
  // Create an instance of metadata
  const metadata = new Metadata(module);
  // Get module declaration metadata
  const declarations = metadata.get(MODULE_DECLARATIONS);

  // Check if declrations has items
  if (declarations?.length > 0) {
    // Define module controllers
    let parsedDeclarations: ModuleController[] = parseModuleDeclarations(module, metadata, declarations);

    // Set routes from parsed declarations
    mapModuleController(parsedDeclarations, routes);
  }

  // Get imports metadata in a module
  const imports: Class<any>[] = metadata.get(MODULE_IMPORTS);

  // Check imports if undefined or empty
  if (imports === undefined || imports.length === 0) {
    return routes;
  }

  // Recursively calls modules in imports
  return imports.flatMap(imp => {
    return moduleParser(imp, routes);
  });
}

/**
 * Parse declared controllers in a module
 *
 * @param module MayaJSModule
 */
function parseModuleDeclarations(module: MayaJSModule, metadata: Metadata, declarations: any): ModuleController[] {
  // Define module controllers
  let moduleControllers: ModuleController[] = [];

  // Defines entry point object
  const entryPoint: EntryPoint = { declared: false, index: 0 };

  // Get bootstrap metadata in a module
  const bootstrap = metadata.get(MODULE_BOOTSTRAP);

  // Resolve boostrap controller
  const resolve = resolveBoostrap(bootstrap);

  // Map all declarations and return an array of cotrollers
  moduleControllers = declarations.map(iterateControllerModule(metadata, resolve, entryPoint));

  if (!resolve && !entryPoint.declared) {
    // If bootstrap is not resolve throw an error
    throw UndeclaredDeclarationError(bootstrap.name, module.name);
  }

  // If resolve is not a boolean get the module path and assign it to resolve.path
  if (typeof resolve !== "boolean") {
    // Remove entry point index in controllers
    moduleControllers.splice(entryPoint.index, 1);

    // Add resolve controller in the start of controllers
    moduleControllers.unshift({ path: metadata.get(MODULE_PATH), controller: resolve.controller });
  }

  return moduleControllers;
}

/**
 * Map and push controllers that are not cached
 *
 * @param moduleControllers ModuleController[]
 * @param routes ModuleController[]
 */
function mapModuleController(moduleControllers: ModuleController[], routes: ModuleController[]) {
  moduleControllers.map(route => {
    // Get metadata for controller key
    const controlKey = getControllerKey(route.controller);

    // Create path key
    const pathKey = `${route.path}-${controlKey}`;

    // Check controller if its already cache
    if (!CONTROLLERS[pathKey]) {
      // If not add it on cached controllers
      CONTROLLERS[pathKey] = route.controller;

      // Push route
      routes.push(route);
    }
  });
}

/**
 * Resolve bootstrap metadata controller
 *
 * @param bootstrap Instance of controller class
 */
function resolveBoostrap(bootstrap: Class<any>): BootstrapController | boolean {
  if (!bootstrap) {
    // If boostrap is undefined return immediately
    return true;
  }

  // Get controller key metadata in boostrap
  const key = getControllerKey(bootstrap);

  // Return bootstrap controller object
  return { key, path: "", controller: bootstrap };
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
function iterateControllerModule(metadata: Metadata, resolve: boolean | BootstrapController, entryPoint: EntryPoint, controllers: string[] = []) {
  // Get module name metadata
  const moduleName = metadata.get(MODULE_NAME);

  // Get module path metadata
  const modulePath = metadata.get(MODULE_PATH);

  // Arrow function that will be use to iterate inside Array.map()
  return (controller: Class<any>, idx: number): ModuleController => {
    // Get metadata for controller key
    const controlKey = getControllerKey(controller);

    if (typeof resolve !== "boolean" && resolve.key === controlKey) {
      // Set entry point index value
      entryPoint.index = idx;
    }

    if (typeof resolve !== "boolean" && !entryPoint.declared) {
      // Set entry point declared value
      entryPoint.declared = resolve.key === controlKey;
    }

    // Check if controller is duplicate
    const hasDuplicate = controllers.some(key => key === controlKey);

    if (hasDuplicate) {
      // Throw error if module controller is duplicated
      throw DuplicateDeclarationError(moduleName, controller.name);
    }

    // Check controller if its already cache
    if (!CONTROLLERS[`${modulePath}-${controlKey}`]) {
      // Add control key on declared controllers
      controllers.push(controlKey);
    }

    // Return module controller object
    return { path: modulePath, controller };
  };
}
