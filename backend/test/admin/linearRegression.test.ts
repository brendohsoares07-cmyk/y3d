import assert from "node:assert/strict";
import test from "node:test";
import { linearRegression } from "../../src/admin/linearRegression";

test("mantém uma série perfeitamente linear", () => {
  assert.deepEqual(linearRegression([10, 20, 30]), [10, 20, 30]);
});

test("retorna a média como tendência para uma série constante", () => {
  assert.deepEqual(linearRegression([3, 3, 3, 3]), [3, 3, 3, 3]);
});

test("retorna uma série vazia quando não há observações", () => {
  assert.deepEqual(linearRegression([]), []);
});
