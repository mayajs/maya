import { Get, Post, Put, Delete, Patch } from "../../src/utils/Methods";

describe("Method Decorator functions", () => {
  test("Test GET MethodDecorator", () => {
    const method = Get({ path: "test" });
    expect(typeof method).toBe("function");
  });

  test("Test POST MethodDecorator", () => {
    const method = Post({ path: "test" });
    expect(typeof method).toBe("function");
  });

  test("Test PUT MethodDecorator", () => {
    const method = Put({ path: "test" });
    expect(typeof method).toBe("function");
  });

  test("Test PATCH MethodDecorator", () => {
    const method = Delete({ path: "test" });
    expect(typeof method).toBe("function");
  });

  test("Test DELETE MethodDecorator", () => {
    const method = Patch({ path: "test" });
    expect(typeof method).toBe("function");
  });
});
