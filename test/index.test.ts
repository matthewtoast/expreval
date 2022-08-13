import { createExprContext, evaluateExpr } from "../src";

describe('evalexpr', () => {
  it('evalexpr', async () => {
    expect((await evaluateExpr('1 + (3 * 4) - add(5, 6)')).result).toBe(2)
    expect((await evaluateExpr('1 > 2')).result).toBe(false)
    expect((await evaluateExpr('"bob" + "jones"')).result).toBe("bobjones")
    expect((await evaluateExpr(`
      do(
        a := 1,//
        a += 2, // comment
        a - 8//comment2
      )
    `)).result).toBe(-5)
    expect((await evaluateExpr(`
      do(
        a := 5,
        b := 6,
        a += b,
        a - 8
      )
    `)).result).toBe(3)
    expect((await evaluateExpr(`
      do(
        a := 'yaya',
        b := 'bobo',
        a += b,
        a + 'mumu'
      )
    `)).result).toBe('yayabobomumu')
    expect((await evaluateExpr("`foo${1 + 2}bar${`moo${3+4}`}`")).result).toBe("foo3barmoo7")
    expect((await evaluateExpr(`moo.ma.mee + 1.23`, createExprContext({
      async get(key) {
        return 6790
      }
    }))).result).toBe(6791.23)
  });
});
