import { evaluateExpr } from "../src";

describe('evalexpr', () => {
  it('evalexpr', async () => {
    expect(await evaluateExpr('1 + (3 * 4)')).toBe("13")
  });
});
