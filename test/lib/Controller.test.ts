import { Controller } from "../../src/utils/Controller";

test("should output a function", () => {
  const controller = Controller({ route: "test", model: "./test.model" });
  expect(typeof controller).toBe("function");
});
