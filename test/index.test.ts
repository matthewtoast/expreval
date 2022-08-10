import { createExprContext, evaluateExpr } from "../src";

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

    const t1 = await evaluateExpr("`foo${1 + 2}bar${`moo${3+4}`}`")
    expect(t1.result).toBe("foo3barmoo7")

    const t2 = await evaluateExpr(`
        deep("moo.ma.mee")
    `, createExprContext({
      heap: {
        moo: {ma: {mee: 6790}}
      }
    }))
    expect(t2.result).toBe("6790")
  });
});
