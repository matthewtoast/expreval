import { createExprContext, evaluateExpr, rewriteCode } from '../src';

describe('evalexpr', () => {
  it('evalexpr', () => {
    expect(evaluateExpr('1 + (3 * 4) - add(5, 6)').result).toBe(2);
    expect(evaluateExpr('1 > 2').result).toBe(false);
    expect(evaluateExpr('"bob" + "jones"').result).toBe('bobjones');
    expect(
      evaluateExpr(`
      do(
        a := 1,//
        a += 2, // comment
        a - 8//comment2
      )
    `).result,
    ).toBe(-5);
    expect(
      evaluateExpr(`
      do(
        a := 5,
        b := 6,
        a += b,
        a - 8
      )
    `).result,
    ).toBe(3);
    expect(
      evaluateExpr(`
      do(
        a := 'yaya',
        b := 'bobo',
        a += b,
        a + 'mumu'
      )
    `).result,
    ).toBe('yayabobomumu');
    expect(evaluateExpr('`foo${1 + 2}bar${`moo${3+4}`}`').result).toBe(
      'foo3barmoo7',
    );
    expect(
      evaluateExpr(
        `moo.ma.mee + 1.23`,
        createExprContext({
          get(key) {
            return 6790;
          },
        }),
      ).result,
    ).toBe(6791.23);

    expect(evaluateExpr('join([1,2,2+1], " ")').result).toBe('1 2 3');
    expect(
      evaluateExpr('join(keys({a: 1, b: 2, [66*6]: 3}), " ")').result,
    ).toBe('396 a b');
    expect(
      evaluateExpr(`
        do(
          a := 1,
          b := {
            a,
            c: "haha"
          },
          get(b, "a") + 3
        )
      `).result,
    ).toBe(4);

    expect(
      rewriteCode(
        `
      do(
        a := 1,
        b := {
          a,
          c: "haha"
        },
        get(b, "a") + 3
      )`,
        (v) => {
          if (v === 'a') {
            return 'AAA';
          }
          return v;
        },
      ),
    ).toBe('do(AAA := 1, b := {a, c: "haha"}, get(b, "a") + 3)');
  });
});
