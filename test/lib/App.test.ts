import { App } from "../../src/lib/App";

test("should output a function", () => {
  const controller = App({ routes: [] });
  expect(typeof controller).toBe("function");
});
