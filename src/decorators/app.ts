import { IAppModuleOptions } from "../interfaces";

/**
 * Decorator for app module
 *
 * @param options Settings for app module
 */
export function App(options: IAppModuleOptions): <T extends new (...args: Array<{}>) => any>(target: T) => void {
  const { databases = [], routes = [], exports = [], imports = [], declarations = [] } = options;

  return (target: any): void => {
    target.routes = routes;
    target.databases = databases;
    target.exports = exports;
    target.imports = imports;
    target.declarations = declarations;
  };
}
