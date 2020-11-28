import { App } from "../../src/decorators";

test("should output a function", () => {
  const controller = App({ routes: [] });
  expect(typeof controller).toBe("function");
});
