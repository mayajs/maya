import { Controller } from "../../src/lib/Controller";

test("should output a function", () => {
  const controller = Controller({ route: "test", model: "./test.model" });
  expect(typeof controller).toBe("function");
});
