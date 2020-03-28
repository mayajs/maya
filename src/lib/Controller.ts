import callsite from "callsite";
import path from "path";

/**
 * Decorator for a controller of a route
 * @param prefix name of the controller that will be added on the route name
 */
export function Controller({ route, model = "" }: { route: string; model?: string }): ClassDecorator {
  let modelPath = "";

  if (model) {
    callsite().forEach(site => {
      const fullPath = site.getFileName();

      if (!fullPath || !fullPath.includes(".controller.")) {
        return;
      }

      const fileDir = fullPath.includes("/") ? fullPath.split("/") : fullPath.split("\\");
      const filename = fileDir[fileDir.length - 1];
      const noFilename = fullPath.replace(filename, "");
      modelPath = path.resolve(noFilename, model);
    });
  }

  if (!modelPath) {
    console.log(`Model not found for controller ${route}.`);
  }

  return (target: any): void => {
    Reflect.defineMetadata("prefix", route, target);
    Reflect.defineMetadata("model", modelPath, target);

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
}
