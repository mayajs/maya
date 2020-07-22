import { Injectable } from "../../src/utils/Injectable";

test("should output a anonymouse class", () => {
  const injectable = Injectable();
  expect(typeof injectable).toBe("function");
});
