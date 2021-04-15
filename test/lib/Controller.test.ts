import { Controller } from "../../src/decorators";

test("should output a function", () => {
  const controller = Controller();
  expect(typeof controller).toBe("function");
});
