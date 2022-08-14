import * as seedrandom from 'seedrandom';

export type DictOf<T> = { [key: string]: T };
export type TExprScalar = number | string | boolean | null;
export type TExprFuncAsync = (
  ctx: TExprContext,
  ...args: TExprScalar[]
) => Promise<TExprScalar>;
export type TExprFuncSync = (
  ctx: TExprContext,
  ...args: TExprScalar[]
) => TExprScalar;
export type TExprFuncDef = {
  assignment?: true;
  lazy?: true;
} & (
  | {
      async: true;
      f: TExprFuncAsync;
    }
  | {
      async?: false;
      f: TExprFuncSync;
    }
);

export type TBinopDef = {
  alias: string;
};
export type TUnopDef = {
  alias: string;
};

export type TExprResult = {
  result: TExprScalar;
  ctx: TExprContext;
};

export type TExprContext = {
  rng: () => number;
  funcs: DictOf<TExprFuncDef>;
  binops: DictOf<TBinopDef>;
  unops: DictOf<TUnopDef>;
  get: (key: string) => Promise<TExprScalar>;
  set: (key: string, value: TExprScalar) => Promise<void>;
  call?: TExprFuncAsync | undefined;
};

export type TExpression =
  | TCallExpression
  | TIdentifierExpression
  | TBinaryExpression
  | TLiteralExpression
  | TTernaryExpression
  | TUnaryExpression
  | TTemplateLiteralExpression;

export type TTemplateLiteralExpression = {
  type: 'TemplateLiteral';
  parts: [['chunks', string] | ['expression', TExpression]];
};

export type TCallExpression = {
  type: 'CallExpression';
  callee: TIdentifierExpression;
  arguments: TExpression[];
};

export type TIdentifierExpression = {
  type: 'Identifier';
  name: string;
};

export type TBinaryExpression = {
  type: 'BinaryExpression';
  left: TExpression;
  operator: string;
  right: TExpression;
};

export type TLiteralExpression = {
  type: 'Literal';
  value: string;
  raw: string;
};

export type TTernaryExpression = {
  type: 'TernaryExpression';
  test: TExpression;
  consequent: TExpression;
  alternate: TExpression;
};

export type TUnaryExpression = {
  type: 'UnaryExpression';
  argument: TExpression;
  operator: string;
};

export const CONSTS: DictOf<TExprScalar> = {
  E: Math.E,
  LN10: Math.LN10,
  LN2: Math.LN2,
  LOG10E: Math.LOG10E,
  LOG2E: Math.LOG2E,
  PI: Math.PI,
  SQRT1_2: Math.SQRT1_2,
  SQRT2: Math.SQRT2,
};

const BINOP_MAP = {
  '**': { alias: 'pow' },
  '*': { alias: 'mul' },
  '/': { alias: 'div' },
  '%': { alias: 'mod' },
  '+': { alias: 'add' },
  '-': { alias: 'sub' },
  '>>>': { alias: 'bitwiseRightShiftUnsigned' },
  '<<': { alias: 'bitwiseLeftShift' },
  '>>': { alias: 'bitwiseRightShift' },
  '<=': { alias: 'lte' },
  '>=': { alias: 'gte' },
  '<': { alias: 'lt' },
  '>': { alias: 'gt' },
  '===': { alias: 'eq' },
  '!==': { alias: 'neq' },
  '==': { alias: 'eq' },
  '!=': { alias: 'neq' },
  '&': { alias: 'bitwiseAnd' },
  '^': { alias: 'bitwiseXor' },
  '|': { alias: 'bitwiseOr' },
  '&&': { alias: 'and' },
  '||': { alias: 'or' },
  ':=': { alias: 'setVar' },
  '+=': { alias: 'setAdd' },
  '-=': { alias: 'setSub' },
  '/=': { alias: 'setDiv' },
  '*=': { alias: 'setMul' },
};

const UNOP_MAP = {
  '+': { alias: 'number' },
  '-': { alias: 'negate' },
  '~': { alias: 'bitwiseNot' },
  '!': { alias: 'not' },
};

const IgnoreWhitespace = (Rule) => Ignore(/^\s+/, Rule);
const QuoteToken = Any(
  /^('[^'\\]*(?:\\.[^'\\]*)*')/,
  /^("[^"\\]*(?:\\.[^"\\]*)*")/,
);
const NumericToken = Any(
  /^((?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:[eE][-+]?[0-9]+)?)\b/,
  /^(0[xX][0-9a-fA-F]+)\b/,
);
const NullToken = /^(null)\b/;
const BooleanToken = /^(true|false)\b/;
const IdentifierToken = /^([a-zA-Z_$][a-zA-Z0-9_$.]*)/;
const InterpolationChunkToken = /^((?:\$(?!{)|\\.|[^`$\\])+)/;
const BinaryOperatorPrecedence = [
  '**',
  Any('*', '/', '%'),
  Any('+', '-'),
  Any('>>>', '<<', '>>'),
  Any('<=', '>=', '<', '>'),
  Any('===', '!==', '==', '!='),
  /^&(?!&)/,
  '^',
  /^\|(?!\|)/,
  '&&',
  '||',
  Any(':=', '+=', '-=', '*=', '/='),
];

const INVALID_IDENT_REGEX = /^__proto__|prototype|constructor$/;

export function createExprContext({
  funcs,
  binops,
  unops,
  seed = 'expreval',
  get,
  set,
  call,
}: Partial<TExprContext> & { seed?: string }): TExprContext {
  const vars: { [key: string]: TExprScalar } = {};
  return {
    rng: seedrandom.default(seed),
    funcs: { ...STDLIB, ...funcs },
    binops: { ...BINOP_MAP, ...binops },
    unops: { ...UNOP_MAP, ...unops },
    get: async (name) => {
      if (name.match(INVALID_IDENT_REGEX)) {
        return 0;
      }
      if (get) {
        return (await get(name)) ?? null;
      }
      return vars[name] ?? null;
    },
    set: async (name, value) => {
      if (name.match(INVALID_IDENT_REGEX)) {
        return;
      }
      if (set) {
        return await set(name, value);
      }
      vars[name] = value;
      return;
    },
    call,
  };
}

export async function evaluateExpr(
  code: string,
  ctx: TExprContext = createExprContext({}),
): Promise<TExprResult> {
  return {
    result: await executeAst(parseExpr(code), ctx),
    ctx,
  };
}

export default evaluateExpr;

export function parseExpr(code: string): TExpression {
  const parser = Parser(DefaultGrammar);
  return parser(code.replace(/\/\/.*\n/g, ''));
}

export async function executeAst(
  ast: TExpression,
  ctx: TExprContext = createExprContext({}),
): Promise<TExprScalar> {
  switch (ast.type) {
    case 'Literal':
      return ast.value;
    case 'Identifier':
      const value = await ctx.get(ast.name);
      return value !== undefined ? value : ast.name;
    case 'CallExpression':
      const fdef = Object.keys(ctx.funcs).includes(ast.callee.name)
        ? ctx.funcs[ast.callee.name]
        : null;
      const args: TExprScalar[] = [];
      if (fdef && fdef.assignment && ast.arguments.length > 1) {
        const left = exprToIdentifier(ast.arguments[0]!) ?? '';
        const right = ast.arguments.slice(1);
        args.push(
          left,
          ...(await asyncMap(
            right,
            async (expr) => await executeAst(expr, ctx),
          )),
        );
      } else {
        args.push(
          ...(await asyncMap(
            ast.arguments,
            async (expr) => await executeAst(expr, ctx),
          )),
        );
      }
      if (fdef) {
        if (fdef.async) {
          return await fdef.f(ctx, ...args);
        }
        return fdef.f(ctx, ...args);
      } else if (ctx.call) {
        return await ctx.call(ctx, ast.callee.name, ...args);
      }
      throw new Error(`Function not found: '${ast.callee.name}'`);
    case 'BinaryExpression':
      const binop = Object.keys(ctx.binops).includes(ast.operator)
        ? ctx.binops[ast.operator]
        : null;
      if (binop) {
        return executeAst(
          {
            type: 'CallExpression',
            callee: {
              name: binop.alias,
              type: 'Identifier',
            },
            arguments: [ast.left, ast.right],
          },
          ctx,
        );
      }
      throw new Error(`Operator not found: '${ast.operator}'`);
    case 'TernaryExpression':
      const result = await executeAst(ast.test, ctx);
      if (toBoolean(result)) {
        return await executeAst(ast.consequent, ctx);
      }
      return await executeAst(ast.alternate, ctx);
    case 'UnaryExpression':
      const unop = Object.keys(ctx.unops).includes(ast.operator)
        ? ctx.unops[ast.operator]
        : null;
      if (unop) {
        return executeAst(
          {
            type: 'CallExpression',
            callee: {
              name: unop.alias,
              type: 'Identifier',
            },
            arguments: [ast.argument],
          },
          ctx,
        );
      }
      throw new Error(`Operator not found: '${ast.operator}'`);
    case 'TemplateLiteral':
      let accum = '';
      for (let i = 0; i < ast.parts.length; i++) {
        const [kind, value] = ast.parts[i]!;
        if (kind === 'chunks') {
          accum += value;
        } else if (kind === 'expression') {
          accum += (await executeAst(value, ctx)) + '';
        }
      }
      return accum;
    default:
      throw new Error(`Syntax error`);
  }
}

export function exprToIdentifier(v: TExpression): string | null {
  if (v.type === 'Identifier') {
    return v.name;
  }
  return null;
}

export function toNumber(v: any, fallback: number = 0): number {
  if (typeof v === 'number') {
    return isNaN(v) ? fallback : v;
  }
  if (typeof v === 'string') {
    if (v.includes('.')) {
      return parseFloat(v);
    }
    return parseInt(v);
  }
  return fallback;
}

export function toBoolean(v: TExprScalar): boolean {
  if (!v) {
    return false;
  }
  if (typeof v === 'string' && v.match(/^\s+$/)) {
    return false;
  }
  if (v === 'false') {
    return false;
  }
  if (v === '0') {
    return false;
  }
  return true;
}

export function toString(v: TExprScalar, radix: number = 10): string {
  if (typeof v === 'number') {
    return v.toString(radix);
  }
  if (v === true || v === 'true') {
    return 'true';
  }
  if (!v || v === 'false') {
    return 'false';
  }
  return v + '';
}

export function toScalar(n: any, radix: number = 10): TExprScalar {
  if (typeof n === 'number') {
    return n.toString(radix);
  }
  if (typeof n === 'string') {
    return n;
  }
  if (typeof n === 'boolean') {
    return n;
  }
  if (!n) {
    return null;
  }
  return n + '';
}

async function asyncMap<V, T>(
  array: V[],
  callback: (el: V, idx: number, arr: V[]) => Promise<T>,
) {
  const out: T[] = [];
  for (let index = 0; index < array.length; index++) {
    const m = await callback(array[index]!, index, array);
    out.push(m);
  }
  return out;
}

async function setVar<T extends TExprScalar>(
  ctx: TExprContext,
  name: any,
  value: T,
): Promise<T> {
  const key = toString(name);
  await ctx.set(key, value);
  return value;
}

async function getVar(ctx: TExprContext, name: any): Promise<TExprScalar> {
  return (await ctx.get(name + '')) ?? null;
}

export const STDLIB: DictOf<TExprFuncDef> = {
  do: {
    f(ctx, ...args) {
      return args[args.length - 1] ?? null;
    },
  },

  present: {
    f(ctx, v) {
      return !!v;
    },
  },
  empty: {
    f(ctx, v) {
      return !v;
    },
  },
  blank: {
    f(ctx, v) {
      if (typeof v === 'string' && (!v || v.match(/^\s+$/))) {
        return true;
      }
      return !v;
    },
  },

  join: {
    f(ctx, spacer, ...ss) {
      return ss.join(toString(spacer));
    },
  },

  setVar: {
    assignment: true,
    async: true,
    async f(ctx, left, right) {
      return await setVar(ctx, left, right);
    },
  },
  setAdd: {
    assignment: true,
    async: true,
    async f(ctx, left, right) {
      const lval = await getVar(ctx, left);
      if (typeof lval === 'string') {
        return await setVar(ctx, left, lval + right + '');
      }
      return await setVar(ctx, left, toNumber(lval) + toNumber(right));
    },
  },
  setSub: {
    assignment: true,
    async: true,
    async f(ctx, left, right) {
      return await setVar(
        ctx,
        left,
        toNumber(await getVar(ctx, left)) - toNumber(right),
      );
    },
  },
  setMul: {
    assignment: true,
    async: true,
    async f(ctx, left, right) {
      return await setVar(
        ctx,
        left,
        toNumber(await getVar(ctx, left)) * toNumber(right),
      );
    },
  },
  setDiv: {
    assignment: true,
    async: true,
    async f(ctx, left, right) {
      return await setVar(
        ctx,
        left,
        toNumber(await getVar(ctx, left)) / toNumber(right),
      );
    },
  },

  unixTimestampNow: {
    f() {
      return Date.now();
    },
  },
  unixTimestampForDate: {
    f(ctx, year, mon, day, hour, min, second) {
      return new Date(
        toNumber(year),
        toNumber(mon),
        toNumber(day),
        toNumber(hour),
        toNumber(min),
        toNumber(second),
      ).getTime();
    },
  },

  all: {
    f(ctx, ...xs) {
      for (let i = 0; i < xs.length; i++) {
        if (!xs[i]) {
          return false;
        }
      }
      return true;
    },
  },
  any: {
    f(ctx, ...xs) {
      for (let i = 0; i < xs.length; i++) {
        if (xs[i]) {
          return true;
        }
      }
      return false;
    },
  },
  some: {
    f(ctx, ...xs) {
      return !!STDLIB['any']!.f(ctx, ...xs);
    },
  },
  none: {
    f(ctx, ...xs) {
      return !STDLIB['any']!.f(ctx, ...xs);
    },
  },

  or: {
    f(ctx, a, b) {
      return toBoolean(a) || toBoolean(b);
    },
  },
  and: {
    f(ctx, a, b) {
      return toBoolean(a) && toBoolean(b);
    },
  },
  not: {
    f(ctx, a) {
      return !toBoolean(a);
    },
  },

  gt: {
    f(ctx, a, b) {
      return toNumber(a) > toNumber(b);
    },
  },
  gte: {
    f(ctx, a, b) {
      return toNumber(a) > toNumber(b);
    },
  },
  lt: {
    f(ctx, a, b) {
      return toNumber(a) > toNumber(b);
    },
  },
  lte: {
    f(ctx, a, b) {
      return toNumber(a) > toNumber(b);
    },
  },
  eq: {
    f(ctx, a, b) {
      return toString(a) === toString(b);
    },
  },
  neq: {
    f(ctx, a, b) {
      return toString(a) !== toString(b);
    },
  },

  rand: {
    f(ctx) {
      return ctx.rng();
    },
  },
  randInRange: {
    f(ctx, min, max) {
      return ctx.rng() * (Number(max) - Number(min)) + Number(min);
    },
  },
  randInt: {
    f(ctx) {
      return Math.floor(ctx.rng() * 10);
    },
  },
  randIntInRange: {
    f(ctx, min, max) {
      min = Math.ceil(Number(min));
      max = Math.floor(Number(max));
      return Math.floor(ctx.rng() * (max - min + 1)) + min;
    },
  },

  number: {
    f(ctx, a) {
      return Number(a);
    },
  },
  bitwiseOr: {
    f(ctx, a, b) {
      return Number(a) | Number(b);
    },
  },
  bitwiseXor: {
    f(ctx, a, b) {
      return Number(a) ^ Number(b);
    },
  },
  bitwiseAnd: {
    f(ctx, a, b) {
      return Number(a) & Number(b);
    },
  },
  bitwiseNot: {
    f(ctx, a) {
      return ~Number(a);
    },
  },
  bitwiseLeftShift: {
    f(ctx, a, b) {
      return Number(a) << Number(b);
    },
  },
  bitwiseRightShift: {
    f(ctx, a, b) {
      return Number(a) >> Number(b);
    },
  },
  bitwiseRightshiftUnsigned: {
    f(ctx, a, b) {
      return Number(a) >>> Number(b);
    },
  },
  negate: {
    f(ctx, a) {
      return -toNumber(a);
    },
  },
  add: {
    f(ctx, a, b) {
      if (typeof a === 'string') {
        return a + b + '';
      }
      return toNumber(a) + toNumber(b);
    },
  },
  sub: {
    f(ctx, a, b) {
      return toNumber(a) - toNumber(b);
    },
  },
  div: {
    f(ctx, a, b) {
      return toNumber(a) / toNumber(b);
    },
  },
  mul: {
    f(ctx, a, b) {
      return toNumber(a) * toNumber(b);
    },
  },
  mod: {
    f(ctx, a, b) {
      return toNumber(a) % toNumber(b);
    },
  },
  pow: {
    f(ctx, a, b) {
      return Math.pow(toNumber(a), toNumber(b));
    },
  },

  abs: {
    f(ctx, a) {
      return Math.abs(toNumber(a));
    },
  },
  acos: {
    f(ctx, a) {
      return Math.acos(toNumber(a));
    },
  },
  acosh: {
    f(ctx, a) {
      return Math.acosh(toNumber(a));
    },
  },
  asin: {
    f(ctx, a) {
      return Math.asin(toNumber(a));
    },
  },
  asinh: {
    f(ctx, a) {
      return Math.asinh(toNumber(a));
    },
  },
  atan: {
    f(ctx, a) {
      return Math.atan(toNumber(a));
    },
  },
  atan2: {
    f(ctx, a, b) {
      return Math.atan2(toNumber(a), toNumber(b));
    },
  },
  atanh: {
    f(ctx, a) {
      return Math.atanh(toNumber(a));
    },
  },
  cbrt: {
    f(ctx, a) {
      return Math.cbrt(toNumber(a));
    },
  },
  ceil: {
    f(ctx, a) {
      return Math.ceil(toNumber(a));
    },
  },
  cos: {
    f(ctx, a) {
      return Math.cos(toNumber(a));
    },
  },
  cosh: {
    f(ctx, a) {
      return Math.cosh(toNumber(a));
    },
  },
  exp: {
    f(ctx, a) {
      return Math.exp(toNumber(a));
    },
  },
  floor: {
    f(ctx, a) {
      return Math.floor(toNumber(a));
    },
  },
  hypot: {
    f(ctx, a) {
      return Math.hypot(toNumber(a));
    },
  },
  log: {
    f(ctx, a) {
      return Math.log(toNumber(a));
    },
  },
  log10: {
    f(ctx, a) {
      return Math.log10(toNumber(a));
    },
  },
  log2: {
    f(ctx, a) {
      return Math.log2(toNumber(a));
    },
  },
  max: {
    f(ctx, a) {
      return Math.max(toNumber(a));
    },
  },
  min: {
    f(ctx, a) {
      return Math.min(toNumber(a));
    },
  },
  round: {
    f(ctx, a) {
      return Math.round(toNumber(a));
    },
  },
  sign: {
    f(ctx, a) {
      return Math.sign(toNumber(a));
    },
  },
  sin: {
    f(ctx, a) {
      return Math.sin(toNumber(a));
    },
  },
  sinh: {
    f(ctx, a) {
      return Math.sinh(toNumber(a));
    },
  },
  sqrt: {
    f(ctx, a) {
      return Math.sqrt(toNumber(a));
    },
  },
  tan: {
    f(ctx, a) {
      return Math.tan(toNumber(a));
    },
  },
  tanh: {
    f(ctx, a) {
      return Math.tanh(toNumber(a));
    },
  },
  trunc: {
    f(ctx, a) {
      return Math.trunc(toNumber(a));
    },
  },

  fromCharCode: {
    f(ctx, a) {
      return String.fromCharCode(Number(a));
    },
  },
  fromCodePoint: {
    f(ctx, a) {
      return String.fromCodePoint(Number(a));
    },
  },
  parseInt: {
    f(ctx, a, b) {
      return parseInt(toString(a), Number(b));
    },
  },
  parseFloat: {
    f(ctx, a) {
      return parseFloat(toString(a));
    },
  },
  length: {
    f(ctx, a) {
      return toString(a).length;
    },
  },
  charAt: {
    f(ctx, a, b) {
      return toString(a).charAt(Number(b));
    },
  },
  charCodeAt: {
    f(ctx, a, b) {
      return toString(a).charCodeAt(Number(b));
    },
  },
  codePointAt: {
    f(ctx, a, b) {
      return toString(a).codePointAt(Number(b)) ?? 0;
    },
  },
  concat: {
    f(ctx, ...ss) {
      return ''.concat(...ss.map((s) => toString(s)));
    },
  },
  endsWith: {
    f(ctx, a, b) {
      return toString(a).endsWith(toString(b));
    },
  },
  includes: {
    f(ctx, a, b) {
      return toString(a).includes(toString(b));
    },
  },
  indexOf: {
    f(ctx, a, b) {
      return toString(a).indexOf(toString(b));
    },
  },
  lastIndexOf: {
    f(ctx, a, b) {
      return toString(a).lastIndexOf(toString(b));
    },
  },
  localeCompare: {
    f(ctx, a, b) {
      return toString(a).localeCompare(toString(b));
    },
  },
  match: {
    f(ctx, a, b) {
      return !!toString(a).match(toString(b));
    },
  },
  matchAll: {
    f(ctx, a, b) {
      return !!toString(a).match(toString(b));
    },
  },
  padEnd: {
    f(ctx, a, b, c) {
      return toString(a).padEnd(Number(b), toString(c ?? ''));
    },
  },
  padStart: {
    f(ctx, a, b, c) {
      return toString(a).padStart(Number(b), toString(c ?? ''));
    },
  },
  repeat: {
    f(ctx, a, b) {
      return toString(a).repeat(Number(b));
    },
  },
  replace: {
    f(ctx, a, b, c) {
      return toString(a).replace(toString(b), toString(c));
    },
  },
  replaceAll: {
    f(ctx, a, b, c) {
      return toString(a).replaceAll(toString(b), toString(c));
    },
  },
  slice: {
    f(ctx, a, b, c) {
      return toString(a).slice(Number(b), Number(c ?? toString(a).length));
    },
  },
  startsWith: {
    f(ctx, a, b) {
      return toString(a).startsWith(toString(b));
    },
  },
  substring: {
    f(ctx, a, b, c) {
      return toString(a).substring(Number(b), Number(c));
    },
  },
  toLowerCase: {
    f(ctx, a) {
      return toString(a).toLowerCase();
    },
  },
  toUpperCase: {
    f(ctx, a) {
      return toString(a).toUpperCase();
    },
  },
  trim: {
    f(ctx, a) {
      return toString(a).trim();
    },
  },
  trimEnd: {
    f(ctx, a) {
      return toString(a).trimEnd();
    },
  },
  trimStart: {
    f(ctx, a) {
      return toString(a).trimStart();
    },
  },
};

// The code below is derived from code at https://github.com/dmaevsky/rd-parse. License:
// The MIT License (MIT)
// Copyright 2013 - present Dmitry Maevsky
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const associativity = (binop) => (binop === '**' ? r2l : l2r);

function locAt(text, newPos, { pos, line, column }) {
  while (pos < newPos) {
    const ch = text[pos++];
    if (ch === '\n') {
      column = 1;
      line++;
    } else {
      column++;
    }
  }
  return { pos, line, column };
}

const markSeen = ($) => {
  if ($.pos > $.lastSeen.pos) {
    Object.assign($.lastSeen, locAt($.text, $.pos, $.lastSeen));
  }
};

function RegexToken(pattern) {
  return ($) => {
    markSeen($);
    const match = pattern.exec($.text.substring($.pos));
    if (!match) {
      return $;
    }
    const $next = {
      ...$,
      pos: $.pos + match[0].length,
    };
    for (let i = 1; i < match.length; i++) {
      $.stack[$next.sp++] = match[i];
    }
    return $next;
  };
}

function StringToken(pattern) {
  return ($) => {
    markSeen($);
    if ($.text.startsWith(pattern, $.pos)) {
      return {
        ...$,
        pos: $.pos + pattern.length,
      };
    }
    return $;
  };
}

function Use(rule) {
  if (typeof rule === 'function') {
    return rule;
  }
  if (rule instanceof RegExp) {
    return RegexToken(rule);
  }
  if (typeof rule === 'string') {
    return StringToken(rule);
  }
  throw new Error('Invalid rule');
}

function Ignore(toIgnore, rule) {
  rule = Use(rule);
  if (toIgnore) {
    toIgnore = Ignore(null, Plus(toIgnore));
  }

  return ($) => {
    const $cur = toIgnore ? toIgnore($) : $;
    $.ignore.push(toIgnore);
    const $next = rule($cur);
    $.ignore.pop();
    return $next === $cur ? $ : toIgnore ? toIgnore($next) : $next;
  };
}

const skipIgnored = ($) => {
  if (!$.ignore.length) {
    return $;
  }
  const toIgnore = $.ignore[$.ignore.length - 1];
  return toIgnore ? toIgnore($) : $;
};

function All(...rules) {
  rules = rules.map(Use);
  return ($) => {
    let $cur = $;
    for (let i = 0; i < rules.length; i++) {
      const $before = i > 0 ? skipIgnored($cur) : $cur;
      const $after = rules[i]($before);
      if ($after === $before) {
        return $;
      }
      if ($after.pos > $before.pos || $after.sp > $before.sp) {
        $cur = $after;
      }
    }
    return $cur;
  };
}

function Any(...rules) {
  rules = rules.map(Use);
  return ($) => {
    for (let i = 0; i < rules.length; i++) {
      const $next = rules[i]($);
      if ($next !== $) {
        return $next;
      }
    }
    return $;
  };
}

function Plus(rule) {
  rule = Use(rule);
  return ($) => {
    while (true) {
      const $cur = skipIgnored($);
      const $next = rule($cur);
      if ($next === $cur) {
        return $;
      }
      $ = $next;
    }
  };
}

function Optional(rule) {
  rule = Use(rule);
  return ($) => {
    const $next = rule($);
    if ($next !== $) {
      return $next;
    }
    return { ...$ };
  };
}

function Node(rule, reducer) {
  rule = Use(rule);
  return ($) => {
    const $next = rule($);
    if ($next === $) {
      return $;
    }
    const node = reducer($.stack.slice($.sp, $next.sp), $, $next);
    $next.sp = $.sp;
    if (node !== null) {
      $.stack[$next.sp++] = node;
    }
    return $next;
  };
}

const Star = (rule) => Optional(Plus(rule));

const Y = (proc) => ((x) => proc((y) => x(x)(y)))((x) => proc((y) => x(x)(y)));

const START = (text, pos = 0) => ({
  text,
  ignore: [],
  stack: [],
  sp: 0,
  lastSeen: locAt(text, pos, { pos: 0, line: 1, column: 1 }),
  pos,
});

function Parser(
  Grammar,
  pos = 0,
  partial = false,
): (text: string) => TExpression {
  return (text) => {
    if (typeof text !== 'string') {
      throw new Error('Parsing function expects a string input');
    }
    const $ = START(text, pos);
    const $next = Grammar($);
    if ($ === $next || (!partial && $next.pos < text.length)) {
      throw new Error(
        `Unexpected token at ${$.lastSeen.line}:${
          $.lastSeen.column
        }. Remainder: ${text.slice($.lastSeen.pos)}`,
      );
    }
    return $.stack[0] as unknown as TExpression;
  };
}

function l2r(parts, $) {
  let left = parts[0];
  for (let i = 1; i < parts.length; i += 2) {
    const [operator, right] = [parts[i].operator, parts[i + 1]];
    left = srcMap(
      {
        type: 'BinaryExpression',
        left,
        operator,
        right,
      },
      $,
      { pos: right.pos + right.text.length },
    );
  }
  return left;
}

function r2l(parts, _, $next) {
  let right = parts[parts.length - 1];
  for (let i = parts.length - 2; i >= 0; i -= 2) {
    const [left, operator] = [parts[i - 1], parts[i].operator];
    right = srcMap(
      {
        type: 'BinaryExpression',
        left,
        operator,
        right,
      },
      { pos: left.pos },
      $next,
    );
  }
  return right;
}

const Operator = (Rule) =>
  Node(Rule, (_, $, $next) => ({
    $,
    operator: $.text.substring($.pos, $next.pos),
  }));

const srcMap = (obj, $, $next) =>
  Object.defineProperties(obj, {
    pos: { writable: true, configurable: true, value: $.pos },
    text: {
      writable: true,
      configurable: true,
      value: ($.text || $next.text).slice($.pos, $next.pos),
    },
  });

const DefaultGrammar = IgnoreWhitespace(
  Y((Expression) => {
    const Identifier = Node(IdentifierToken, ([name]) => ({
      type: 'Identifier',
      name,
    }));
    const StringLiteral = Node(QuoteToken, ([raw]) => ({
      type: 'Literal',
      value: raw.slice(1, -1),
      raw,
    }));
    const NumericLiteral = Node(NumericToken, ([raw]) => ({
      type: 'Literal',
      value: +raw,
      raw,
    }));
    const NullLiteral = Node(NullToken, ([raw]) => ({
      type: 'Literal',
      value: null,
      raw,
    }));
    const BooleanLiteral = Node(BooleanToken, ([raw]) => ({
      type: 'Literal',
      value: raw === 'true',
      raw,
    }));
    const InterpolationChunk = Node(InterpolationChunkToken, ([raw]) => [
      'chunks',
      raw,
    ]);
    const TemplateInlineExpression = Node(
      All('${', IgnoreWhitespace(Expression), '}'),
      ([expression]) => ['expression', expression],
    );
    const TemplateLiteral = Node(
      Ignore(
        null,
        All('`', Star(Any(InterpolationChunk, TemplateInlineExpression)), '`'),
      ),
      (parts) => ({ type: 'TemplateLiteral', parts }),
    );
    const Literal = Any(
      StringLiteral,
      NumericLiteral,
      NullLiteral,
      BooleanLiteral,
      TemplateLiteral,
    );
    const ArgumentsList = All(Expression, Star(All(',', Expression)));
    const Arguments = Node(
      All('(', Optional(All(ArgumentsList, Optional(','))), ')'),
      (args) => ({
        args,
      }),
    );
    const ArgumentsExpression = Node(Any(Arguments), ([part], _, $next) => ({
      part,
      $next,
    }));
    const CompoundExpression = Node(
      All(Expression, Star(All(',', Expression))),
      (leafs) =>
        leafs.length > 1 ? { type: 'CompoundExpression', leafs } : leafs[0],
    );
    const PrimaryExpression = Node(
      Any(Literal, Identifier, All('(', CompoundExpression, ')')),
      ([expr], $, $next) => srcMap(expr, $, $next),
    );
    const CallExpression = Node(
      All(PrimaryExpression, Star(ArgumentsExpression)),
      (parts, $, $last) => {
        return parts.reduce((acc, { part, $next }) => {
          return srcMap(
            { type: 'CallExpression', callee: acc, arguments: part.args },
            $,
            $next,
          );
        });
      },
    );
    const UnaryOperator = Operator(Any('+', '-', '~', '!'));
    const UnaryExpression = Node(
      All(Star(UnaryOperator), CallExpression),
      (parts, _, $next) =>
        parts.reduceRight((argument, { $, operator }) =>
          srcMap({ type: 'UnaryExpression', argument, operator }, $, $next),
        ),
    );
    const LogicalExpressionOrExpression = BinaryOperatorPrecedence.reduce(
      (Expr, BinaryOp) =>
        Node(
          All(Expr, Star(All(Operator(BinaryOp), Expr))),
          associativity(BinaryOp),
        ),
      UnaryExpression,
    );
    const TernaryExpression = Node(
      All(
        LogicalExpressionOrExpression,
        Optional(All('?', Expression, ':', Expression)),
      ),
      ([test, consequent, alternate]) =>
        consequent
          ? { type: 'TernaryExpression', test, consequent, alternate }
          : test,
    );
    return Node(Any(TernaryExpression), ([expr], $, $next) =>
      srcMap(expr, $, $next),
    );
  }),
);
