import { App } from "../../src/decorators";

test("should output a function", () => {
  const controller = App({});
  expect(typeof controller).toBe("function");
});
