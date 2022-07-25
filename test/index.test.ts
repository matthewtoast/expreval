import { evaluateExpr } from "../src";

describe('evalexpr', () => {
  it('evalexpr', async () => {
    expect((await evaluateExpr('1 + (3 * 4) - add(5, 6)')).result).toBe("2")
    expect((await evaluateExpr('1 > 2')).result).toBe(false)
    expect((await evaluateExpr(`
      do(
        a := 1,//
        a += 2, // comment
        a - 8//comment2
      )
    `)).result).toBe("-5")
  });
});
