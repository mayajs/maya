import { Controller } from "../../src/decorators";

test("should output a function", () => {
  const controller = Controller({ selector: "test" });
  expect(typeof controller).toBe("function");
});
