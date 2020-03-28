import { RequestMethod, InjectableDecorator, Type } from "../types";

/**
 * @returns {InjectableDecaorator<Type<any>>}
 * @constructor
 */
export function Injectable(): InjectableDecorator<Type<any>> {
  return <T extends new (...args: any[]) => {}>(constructor: T): T => {
    return class extends constructor {};
  };
}
