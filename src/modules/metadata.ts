import { Class } from "../interfaces";

export class Metadata {
  constructor(private target: Class<any>) {}

  /**
   * Get metadata for a given key
   *
   * @param key Name of the metadata key
   */
  get(key: string) {
    return Reflect.getMetadata(key, this.target);
  }

  /**
   * Defines metadata for a given key and value
   *
   * @param key Name of the metadata key
   * @param value Value of the metadata
   */
  define<T>(key: string, value: T) {
    return Reflect.defineMetadata(key, value, this.target);
  }
}
