import { MethodDecoratorFactory } from "../../src/lib/Factory";

test("should output a get function", () => {
  const methodFactory = MethodDecoratorFactory("get");
  expect(typeof methodFactory).toBe("function");
  const method = methodFactory({ path: "test" });
  expect(typeof method).toBe("function");
});

test("should output a post function", () => {
  const methodFactory = MethodDecoratorFactory("post");
  expect(typeof methodFactory).toBe("function");
  const method = methodFactory({ path: "test" });
  expect(typeof method).toBe("function");
});

test("should output a put function", () => {
  const methodFactory = MethodDecoratorFactory("put");
  expect(typeof methodFactory).toBe("function");
  const method = methodFactory({ path: "test" });
  expect(typeof method).toBe("function");
});

test("should output a patch function", () => {
  const methodFactory = MethodDecoratorFactory("patch");
  expect(typeof methodFactory).toBe("function");
  const method = methodFactory({ path: "test" });
  expect(typeof method).toBe("function");
});

test("should output a delete function", () => {
  const methodFactory = MethodDecoratorFactory("delete");
  expect(typeof methodFactory).toBe("function");
  const method = methodFactory({ path: "test" });
  expect(typeof method).toBe("function");
});
