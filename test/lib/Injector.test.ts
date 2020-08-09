import { Injector } from "../../src/utils/Injector";
import "reflect-metadata";

test("should output an object", () => {
  const controller = class {};
  const injector = Injector.resolve<typeof controller>(controller);
  expect(typeof injector).toBe("object");
});
