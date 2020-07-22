import { App } from "../../src/utils/App";

test("should output a function", () => {
  const controller = App({ routes: [] });
  expect(typeof controller).toBe("function");
});
