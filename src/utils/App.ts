import { IAppSettings } from "../interfaces";

export function App(settings: IAppSettings): <T extends new (...args: Array<{}>) => any>(target: T) => void {
  const { databases = [], routes = [] } = settings;

  return (target: any): void => {
    target.routes = routes;
    target.databases = databases;
  };
}
