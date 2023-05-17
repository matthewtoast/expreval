import evaluateExpr, { createExprContext, parseExpr, rewriteCode } from '../src';

describe('evalexpr', () => {
  it('evalexpr', async () => {
    expect((await evaluateExpr('a := 1')).result).toBe(1);
    expect((await (await evaluateExpr('map([1,2,3], (n) => n + 1)'))).result).toStrictEqual([
      2, 3, 4,
    ]);
    expect((await evaluateExpr('1 + (3 * 4) - add(5, 6)')).result).toBe(2);
    expect((await evaluateExpr('1 > 2')).result).toBe(false);
    expect((await evaluateExpr('"bob" + "jones"')).result).toBe('bobjones');
    expect(
      (await evaluateExpr(`
      do(
        a := 1,//
        a += 2, // comment
        a - 8//comment2
      )
    `)).result,
    ).toBe(-5);
    expect(
      (await evaluateExpr(`
      do(
        a := 5,
        b := 6,
        a += b,
        a - 8
      )
    `)).result,
    ).toBe(3);
    expect(
      (await evaluateExpr(`
      do(
        a := 'yaya',
        b := 'bobo',
        a += b,
        a + 'mumu'
      )
    `)).result,
    ).toBe('yayabobomumu');
    expect((await evaluateExpr('`foo${1 + 2}bar${`moo${3+4}`}`')).result).toBe(
      'foo3barmoo7',
    );
    expect(
      (await evaluateExpr(
        `moo.ma.mee + 1.23`,
        createExprContext({
          async get(key) {
            return 6790;
          },
        }),
      )).result,
    ).toBe(6791.23);
    expect((await evaluateExpr('join([1,2,2+1], " ")')).result).toBe('1 2 3');
    expect(
      (await evaluateExpr('join(keysOf({a: 1, b: 2, [66*6]: 3}), " ")')).result,
    ).toBe('396 a b');
    expect(
      (await evaluateExpr(`
        do(
          a := 1,
          b := {
            a,
            c: "haha"
          },
          getProperty(b, "a") + 3
        )
      `)).result,
    ).toBe(4);
    expect(
      rewriteCode(
        `
      do(
        a:=1,
        b := {
          a,
          c: "haha"
        },
        getProperty(b, "a") + 3
      )`,
        (v) => {
          if (v === 'a') {
            return 'AAA';
          }
          return v;
        },
        {},
      ),
    ).toBe('do(AAA := 1, b := {AAA, c: "haha"}, getProperty(b, "a") + 3)');
    expect(parseExpr('a$1:ac', {})).toEqual({ type: 'Identifier', name: 'a$1:ac' })
  });
});
