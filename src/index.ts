import * as seedrandom from 'seedrandom';
import { z } from 'zod';

export type DictOf<T> = { [key: string]: T };

export const ZExprScalar = z.union([
  z.number(),
  z.string(),
  z.boolean(),
  z.null(),
]);
export type TExprScalar = number | string | boolean | null;
export type TExprArray = TExprValue[];
export type TExprObject = { [key: string]: TExprValue };
export type TExprValue = TExprScalar | TExprObject | TExprArray;

export type TExprFuncSync = (
  ctx: TExprContext,
  scope: TScope,
  ...args: TExprValue[]
) => TExprValue;
export type TExprFuncLazy = (
  ctx: TExprContext,
  scope: TScope,
  ...args: TExpression[]
) => TExprValue;
export type TExprFuncDef =
  | {
      assignment?: true;
      lazy?: undefined;
      f: TExprFuncSync;
    }
  | {
      lazy: true;
      f: TExprFuncLazy;
    };

export type TBinopDef = {
  alias: string;
};
export type TUnopDef = {
  alias: string;
};

export type TExprResult = {
  result: TExprValue;
  ctx: TExprContext;
};

export type TExprContext = {
  rng: () => number;
  funcs: DictOf<TExprFuncDef>;
  binops: DictOf<TBinopDef>;
  unops: DictOf<TUnopDef>;
  get: (scope: TScope, key: string) => TExprValue;
  set: (scope: TScope, key: string, value: TExprValue) => void;
  call?:
    | ((
        ctx: TExprContext,
        scope: TScope,
        method: string,
        args: TExprValue[],
      ) => TExprValue)
    | undefined;
  lazy?:
    | ((
        ctx: TExprContext,
        scope: TScope,
        method: string,
        args: TExpression[],
      ) => TExprValue)
    | undefined;
};

export type TScope = { [key: string]: TExprValue };

export type TExpression =
  | TCallExpression
  | TIdentifierExpression
  | TBinaryExpression
  | TLiteralExpression
  | TConditionalExpression
  | TUnaryExpression
  | TTemplateLiteralExpression
  | TArrayLiteralExpression
  | TObjectLiteralExpression
  | TComputedPropertyExpression;

export type TTemplateLiteralExpression = {
  type: 'TemplateLiteral';
  parts: [['chunks', string] | ['expression', TExpression]];
};

export type TComputedPropertyExpression = {
  type: 'ComputedProperty';
  expression: TExpression;
};

export type TArrayLiteralExpression = {
  type: 'ArrayLiteral';
  elements: TExpression[];
};

export type TObjectLiteralExpression = {
  type: 'ObjectLiteral';
  properties: {
    name:
      | TIdentifierExpression
      | TLiteralExpression
      | TComputedPropertyExpression;
    value: TExpression | undefined;
  }[];
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

export type TConditionalExpression = {
  type: 'ConditionalExpression';
  test: TExpression;
  consequent: TExpression;
  alternate: TExpression | undefined;
};

export type TUnaryExpression = {
  type: 'UnaryExpression';
  argument: TExpression;
  operator: string;
};

export const CONSTS: DictOf<TExprValue> = {
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
  '??': { alias: 'nullCoalesce' },
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
  '??',
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
  const vars: { [key: string]: TExprValue } = {};
  return {
    rng: seedrandom.default(seed),
    funcs: { ...STDLIB, ...funcs },
    binops: { ...BINOP_MAP, ...binops },
    unops: { ...UNOP_MAP, ...unops },
    get: (scope, name) => {
      if (name.match(INVALID_IDENT_REGEX)) {
        return 0;
      }
      if (get) {
        return get(scope, name) ?? null;
      }
      return vars[name] ?? null;
    },
    set: (scope, name, value) => {
      if (name.match(INVALID_IDENT_REGEX)) {
        return;
      }
      if (set) {
        return set(scope, name, value);
      }
      vars[name] = value;
      return;
    },
    call,
  };
}

export function evaluateExpr(
  code: string,
  ctx: TExprContext = createExprContext({}),
  scope: TScope = {},
): TExprResult {
  return {
    result: executeAst(parseExpr(code), ctx, scope),
    ctx,
  };
}

export default evaluateExpr;

export function parseExpr(code: string): TExpression {
  const parser = Parser(DefaultGrammar);
  return parser(code.replace(/\/\/.*\n/g, ''));
}

export function executeAst(
  ast: TExpression,
  ctx: TExprContext = createExprContext({}),
  scope: TScope,
): TExprValue {
  switch (ast.type) {
    case 'Literal':
      return ast.value;
    case 'Identifier':
      const value = ctx.get(scope, ast.name);
      return value !== undefined ? value : ast.name;
    case 'CallExpression':
      const fdef = Object.keys(ctx.funcs).includes(ast.callee.name)
        ? ctx.funcs[ast.callee.name]
        : null;
      if (fdef && fdef.lazy) {
        return fdef.f(ctx, scope, ...ast.arguments);
      }
      const args: TExprValue[] = [];
      if (fdef && fdef.assignment && ast.arguments.length > 1) {
        const left = exprToIdentifier(ast.arguments[0]!) ?? '';
        const right = ast.arguments.slice(1);
        args.push(left, ...right.map((expr) => executeAst(expr, ctx, scope)));
      } else {
        args.push(...ast.arguments.map((expr) => executeAst(expr, ctx, scope)));
      }
      if (fdef) {
        const result = fdef.f(ctx, scope, ...args);
        return result;
      }
      if (ctx.call) {
        return ctx.call(ctx, scope, ast.callee.name, args);
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
          scope,
        );
      }
      throw new Error(`Operator not found: '${ast.operator}'`);
    case 'ConditionalExpression':
      const result = executeAst(ast.test, ctx, scope);
      if (toBoolean(result)) {
        return executeAst(ast.consequent, ctx, scope);
      }
      if (!ast.alternate) {
        return null;
      }
      return executeAst(ast.alternate, ctx, scope);
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
          scope,
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
          accum += executeAst(value, ctx, scope) + '';
        }
      }
      return accum;
    case 'ComputedProperty':
      return executeAst(ast.expression, ctx, scope);
    case 'ArrayLiteral':
      return ast.elements.map((element) => executeAst(element, ctx, scope));
    case 'ObjectLiteral':
      const obj = {};
      for (let i = 0; i < ast.properties.length; i++) {
        const { name, value } = ast.properties[i]!;
        let key: string = '';
        if (name.type === 'ComputedProperty') {
          key = toString(executeAst(name.expression, ctx, scope));
        } else if (name.type === 'Identifier') {
          key = name.name; // Don't evaluate this if 'bare'
        } else if (name.type === 'Literal') {
          key = name.value;
        }
        obj[key] = executeAst(value ? value : name, ctx, scope);
      }
      return obj;
    default:
      console.info(ast);
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

export function toBoolean(v: TExprValue): boolean {
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

export function toString(v: any, radix: number = 10): string {
  if (typeof v === 'number') {
    return v.toString(radix);
  }
  if (v === true || v === 'true') {
    return 'true';
  }
  if (!v) {
    return '';
  }
  return v + '';
}

export function toObject(v: any): TExprObject {
  if (!v) {
    return {};
  }
  if (v && typeof v === 'object') {
    return v;
  }
  return {};
}

export function toArray(v: any): TExprArray {
  if (!v) {
    return [];
  }
  if (Array.isArray(v)) {
    return v.map((e) => toScalar(e));
  }
  if (v && typeof v === 'object') {
    return Object.keys(v).map((k) => toScalar(v[k]));
  }
  if (
    typeof v === 'number' ||
    typeof v === 'string' ||
    typeof v === 'boolean'
  ) {
    return [v];
  }
  return [];
}

export function toScalar(n: any, radix: number = 10): TExprScalar {
  if (typeof n === 'number') {
    return n;
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
  if (typeof n === 'object') {
    return '';
  }
  return n + '';
}

function setVar<T extends TExprValue>(
  ctx: TExprContext,
  scope: TScope,
  name: any,
  value: T,
): T {
  const key = toString(name);
  ctx.set(scope, key, value);
  return value;
}

function getVar(ctx: TExprContext, scope: TScope, name: any): TExprValue {
  return ctx.get(scope, name + '') ?? null;
}

export const STDLIB: DictOf<TExprFuncDef> = {
  do: {
    f(ctx, scope, ...args) {
      return args[args.length - 1] ?? null;
    },
  },
  defp: {
    lazy: true,
    f(ctx, scope, ...args) {
      return 0;
    },
  },
  present: {
    f(ctx, scope, v) {
      return !!v;
    },
  },
  empty: {
    f(ctx, scope, v) {
      if (Array.isArray(v)) {
        return v.length < 1;
      }
      if (v && typeof v === 'object') {
        return Object.keys(v).length < 1;
      }
      return !v;
    },
  },
  blank: {
    f(ctx, scope, v) {
      if (Array.isArray(v)) {
        return v.length < 1;
      }
      if (v && typeof v === 'object') {
        return Object.keys(v).length < 1;
      }
      if (typeof v === 'string' && (!v || v.match(/^\s+$/))) {
        return true;
      }
      return !v;
    },
  },
  setVar: {
    assignment: true,
    f(ctx, scope, left, right) {
      return setVar(ctx, scope, left, right);
    },
  },
  setAdd: {
    assignment: true,
    f(ctx, scope, left, right) {
      const lval = getVar(ctx, scope, left);
      if (typeof lval === 'string') {
        return setVar(ctx, scope, left, lval + right + '');
      }
      return setVar(ctx, scope, left, toNumber(lval) + toNumber(right));
    },
  },
  setSub: {
    assignment: true,
    f(ctx, scope, left, right) {
      return setVar(
        ctx,
        scope,
        left,
        toNumber(getVar(ctx, scope, left)) - toNumber(right),
      );
    },
  },
  setMul: {
    assignment: true,
    f(ctx, scope, left, right) {
      return setVar(
        ctx,
        scope,
        left,
        toNumber(getVar(ctx, scope, left)) * toNumber(right),
      );
    },
  },
  setDiv: {
    assignment: true,
    f(ctx, scope, left, right) {
      return setVar(
        ctx,
        scope,
        left,
        toNumber(getVar(ctx, scope, left)) / toNumber(right),
      );
    },
  },
  nullCoalesce: {
    f(ctx, scope, a, b) {
      return a ?? b;
    },
  },
  unixTimestampNow: {
    f() {
      return Date.now();
    },
  },
  unixTimestampForDate: {
    f(ctx, scope, year, mon, day, hour, min, second) {
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
    f(ctx, scope, xs) {
      if (!Array.isArray(xs)) {
        return !!xs;
      }
      for (let i = 0; i < xs.length; i++) {
        if (!xs[i]) {
          return false;
        }
      }
      return true;
    },
  },
  any: {
    f(ctx, scope, xs) {
      if (!Array.isArray(xs)) {
        return !!xs;
      }
      for (let i = 0; i < xs.length; i++) {
        if (xs[i]) {
          return true;
        }
      }
      return false;
    },
  },
  some: {
    f(ctx, scope, xs) {
      return !!STDLIB['any']!.f(ctx, scope, xs as any);
    },
  },
  none: {
    f(ctx, scope, xs) {
      return !STDLIB['any']!.f(ctx, scope, xs as any);
    },
  },
  or: {
    f(ctx, scope, a, b) {
      return toBoolean(a) || toBoolean(b);
    },
  },
  and: {
    f(ctx, scope, a, b) {
      return toBoolean(a) && toBoolean(b);
    },
  },
  not: {
    f(ctx, scope, a) {
      return !toBoolean(a);
    },
  },
  gt: {
    f(ctx, scope, a, b) {
      return toNumber(a) > toNumber(b);
    },
  },
  gte: {
    f(ctx, scope, a, b) {
      return toNumber(a) > toNumber(b);
    },
  },
  lt: {
    f(ctx, scope, a, b) {
      return toNumber(a) > toNumber(b);
    },
  },
  lte: {
    f(ctx, scope, a, b) {
      return toNumber(a) > toNumber(b);
    },
  },
  eq: {
    f(ctx, scope, a, b) {
      return toString(a) === toString(b);
    },
  },
  neq: {
    f(ctx, scope, a, b) {
      return toString(a) !== toString(b);
    },
  },
  rand: {
    f(ctx) {
      return ctx.rng();
    },
  },
  randInRange: {
    f(ctx, scope, min, max) {
      return ctx.rng() * (Number(max) - Number(min)) + Number(min);
    },
  },
  randInt: {
    f(ctx) {
      return Math.floor(ctx.rng() * 10);
    },
  },
  randIntInRange: {
    f(ctx, scope, min, max) {
      min = Math.ceil(Number(min));
      max = Math.floor(Number(max));
      return Math.floor(ctx.rng() * (max - min + 1)) + min;
    },
  },
  number: {
    f(ctx, scope, a) {
      return Number(a);
    },
  },
  bitwiseOr: {
    f(ctx, scope, a, b) {
      return Number(a) | Number(b);
    },
  },
  bitwiseXor: {
    f(ctx, scope, a, b) {
      return Number(a) ^ Number(b);
    },
  },
  bitwiseAnd: {
    f(ctx, scope, a, b) {
      return Number(a) & Number(b);
    },
  },
  bitwiseNot: {
    f(ctx, scope, a) {
      return ~Number(a);
    },
  },
  bitwiseLeftShift: {
    f(ctx, scope, a, b) {
      return Number(a) << Number(b);
    },
  },
  bitwiseRightShift: {
    f(ctx, scope, a, b) {
      return Number(a) >> Number(b);
    },
  },
  bitwiseRightshiftUnsigned: {
    f(ctx, scope, a, b) {
      return Number(a) >>> Number(b);
    },
  },
  negate: {
    f(ctx, scope, a) {
      return -toNumber(a);
    },
  },
  add: {
    f(ctx, scope, a, b) {
      if (typeof a === 'string') {
        return a + b + '';
      }
      return toNumber(a) + toNumber(b);
    },
  },
  sub: {
    f(ctx, scope, a, b) {
      return toNumber(a) - toNumber(b);
    },
  },
  div: {
    f(ctx, scope, a, b) {
      return toNumber(a) / toNumber(b);
    },
  },
  mul: {
    f(ctx, scope, a, b) {
      return toNumber(a) * toNumber(b);
    },
  },
  mod: {
    f(ctx, scope, a, b) {
      return toNumber(a) % toNumber(b);
    },
  },
  pow: {
    f(ctx, scope, a, b) {
      return Math.pow(toNumber(a), toNumber(b));
    },
  },
  abs: {
    f(ctx, scope, a) {
      return Math.abs(toNumber(a));
    },
  },
  acos: {
    f(ctx, scope, a) {
      return Math.acos(toNumber(a));
    },
  },
  acosh: {
    f(ctx, scope, a) {
      return Math.acosh(toNumber(a));
    },
  },
  asin: {
    f(ctx, scope, a) {
      return Math.asin(toNumber(a));
    },
  },
  asinh: {
    f(ctx, scope, a) {
      return Math.asinh(toNumber(a));
    },
  },
  atan: {
    f(ctx, scope, a) {
      return Math.atan(toNumber(a));
    },
  },
  atan2: {
    f(ctx, scope, a, b) {
      return Math.atan2(toNumber(a), toNumber(b));
    },
  },
  atanh: {
    f(ctx, scope, a) {
      return Math.atanh(toNumber(a));
    },
  },
  cbrt: {
    f(ctx, scope, a) {
      return Math.cbrt(toNumber(a));
    },
  },
  ceil: {
    f(ctx, scope, a) {
      return Math.ceil(toNumber(a));
    },
  },
  cos: {
    f(ctx, scope, a) {
      return Math.cos(toNumber(a));
    },
  },
  cosh: {
    f(ctx, scope, a) {
      return Math.cosh(toNumber(a));
    },
  },
  exp: {
    f(ctx, scope, a) {
      return Math.exp(toNumber(a));
    },
  },
  floor: {
    f(ctx, scope, a) {
      return Math.floor(toNumber(a));
    },
  },
  hypot: {
    f(ctx, scope, a) {
      return Math.hypot(toNumber(a));
    },
  },
  log: {
    f(ctx, scope, a) {
      return Math.log(toNumber(a));
    },
  },
  log10: {
    f(ctx, scope, a) {
      return Math.log10(toNumber(a));
    },
  },
  log2: {
    f(ctx, scope, a) {
      return Math.log2(toNumber(a));
    },
  },
  max: {
    f(ctx, scope, a) {
      return Math.max(toNumber(a));
    },
  },
  min: {
    f(ctx, scope, a) {
      return Math.min(toNumber(a));
    },
  },
  round: {
    f(ctx, scope, a) {
      return Math.round(toNumber(a));
    },
  },
  sign: {
    f(ctx, scope, a) {
      return Math.sign(toNumber(a));
    },
  },
  sin: {
    f(ctx, scope, a) {
      return Math.sin(toNumber(a));
    },
  },
  sinh: {
    f(ctx, scope, a) {
      return Math.sinh(toNumber(a));
    },
  },
  sqrt: {
    f(ctx, scope, a) {
      return Math.sqrt(toNumber(a));
    },
  },
  tan: {
    f(ctx, scope, a) {
      return Math.tan(toNumber(a));
    },
  },
  tanh: {
    f(ctx, scope, a) {
      return Math.tanh(toNumber(a));
    },
  },
  trunc: {
    f(ctx, scope, a) {
      return Math.trunc(toNumber(a));
    },
  },
  fromCharCode: {
    f(ctx, scope, a) {
      return String.fromCharCode(Number(a));
    },
  },
  fromCodePoint: {
    f(ctx, scope, a) {
      return String.fromCodePoint(Number(a));
    },
  },
  parseInt: {
    f(ctx, scope, a, b) {
      return parseInt(toString(a), Number(b));
    },
  },
  parseFloat: {
    f(ctx, scope, a) {
      return parseFloat(toString(a));
    },
  },
  charAt: {
    f(ctx, scope, a, b) {
      return toString(a).charAt(Number(b));
    },
  },
  charCodeAt: {
    f(ctx, scope, a, b) {
      return toString(a).charCodeAt(Number(b));
    },
  },
  codePointAt: {
    f(ctx, scope, a, b) {
      return toString(a).codePointAt(Number(b)) ?? 0;
    },
  },
  localeCompare: {
    f(ctx, scope, a, b) {
      return toString(a).localeCompare(toString(b));
    },
  },
  match: {
    f(ctx, scope, a, b) {
      return !!toString(a).match(toString(b));
    },
  },
  matchAll: {
    f(ctx, scope, a, b) {
      return !!toString(a).match(toString(b));
    },
  },
  padEnd: {
    f(ctx, scope, a, b, c) {
      return toString(a).padEnd(Number(b), toString(c ?? ''));
    },
  },
  padStart: {
    f(ctx, scope, a, b, c) {
      return toString(a).padStart(Number(b), toString(c ?? ''));
    },
  },
  repeat: {
    f(ctx, scope, a, b) {
      return toString(a).repeat(Number(b));
    },
  },
  replace: {
    f(ctx, scope, a, b, c) {
      return toString(a).replace(toString(b), toString(c));
    },
  },
  replaceAll: {
    f(ctx, scope, a, b, c) {
      return toString(a).replaceAll(toString(b), toString(c));
    },
  },
  startsWith: {
    f(ctx, scope, a, b) {
      return toString(a).startsWith(toString(b));
    },
  },
  substring: {
    f(ctx, scope, a, b, c) {
      return toString(a).substring(Number(b), Number(c));
    },
  },
  toLowerCase: {
    f(ctx, scope, a) {
      return toString(a).toLowerCase();
    },
  },
  toUpperCase: {
    f(ctx, scope, a) {
      return toString(a).toUpperCase();
    },
  },
  trim: {
    f(ctx, scope, a) {
      return toString(a).trim();
    },
  },
  trimEnd: {
    f(ctx, scope, a) {
      return toString(a).trimEnd();
    },
  },
  trimStart: {
    f(ctx, scope, a) {
      return toString(a).trimStart();
    },
  },
  clamp: {
    f(ctx, a, min, max) {
      return clamp(toNumber(a), toNumber(min), toNumber(max));
    },
  },
  avg: {
    f(ctx, nn) {
      return avg(toArray(nn).map((n) => toNumber(n)));
    },
  },
  sum: {
    f(ctx, nn) {
      return sum(toArray(nn).map((n) => toNumber(n)));
    },
  },
  join: {
    f(ctx, scope, ss, spacer) {
      return toArray(ss).join(toString(spacer));
    },
  },
  split: {
    f(ctx, scope, s, spacer) {
      return toString(s).split(toString(spacer));
    },
  },
  first: {
    f(ctx, scope, arr) {
      if (typeof arr === 'string') {
        return arr[0] ?? null;
      }
      return toArray(arr)[0] ?? null;
    },
  },
  last: {
    f(ctx, scope, arr) {
      if (typeof arr === 'string') {
        return arr[arr.length] ?? null;
      }
      arr = toArray(arr);
      return arr[arr.length] ?? null;
    },
  },
  length: {
    f(ctx, scope, arr) {
      if (typeof arr === 'string') {
        return arr.length;
      }
      return toArray(arr).length;
    },
  },
  concat: {
    f(ctx, scope, aa, bb) {
      if (typeof aa === 'string') {
        return aa + toString(bb);
      }
      return [...toArray(aa), ...toArray(bb)];
    },
  },
  endsWith: {
    f(ctx, scope, a, b, c = '') {
      if (Array.isArray(a)) {
        a = a.join(toString(c));
      }
      return toString(a).endsWith(toString(b));
    },
  },
  includes: {
    f(ctx, scope, a, b) {
      if (typeof a === 'string') {
        return a.includes(toString(b));
      }
      return toArray(a).includes(b);
    },
  },
  lastIndexOf: {
    f(ctx, scope, a, b) {
      if (typeof a === 'string') {
        return a.lastIndexOf(toString(b));
      }
      return toArray(a).lastIndexOf(b);
    },
  },
  indexOf: {
    f(ctx, scope, a, b) {
      if (typeof a === 'string') {
        return a.indexOf(toString(b));
      }
      return toArray(a).indexOf(b);
    },
  },
  nth: {
    f(ctx, scope, a, b) {
      if (typeof a === 'string') {
        return a[toNumber(b)] ?? null;
      }
      return toArray(a)[toNumber(b)] ?? null;
    },
  },
  reverse: {
    f(ctx, scope, a) {
      if (typeof a === 'string') {
        return a.split('').reverse().join('');
      }
      return toArray(a).reverse();
    },
  },
  take: {
    f(ctx, scope, a, n) {
      if (typeof a === 'string') {
        return a.slice(0, toNumber(n));
      }
      return toArray(a).slice(0, toNumber(n));
    },
  },
  head: {
    f(ctx, scope, arr) {
      return toArray(arr).slice(0, -1);
    },
  },
  tail: {
    f(ctx, scope, arr) {
      return toArray(arr).slice(1);
    },
  },
  slice: {
    f(ctx, scope, arr, a, b) {
      if (typeof arr === 'string') {
        return arr.slice(toNumber(a), toNumber(b));
      }
      return toArray(arr).slice(toNumber(a), toNumber(b));
    },
  },
  randEl: {
    f(ctx, scope, arr) {
      arr = toArray(arr);
      const i = STDLIB['randIntInRange']!.f(
        ctx,
        scope,
        0 as any,
        (arr.length - 1) as any,
      ) as number;
      return arr[i] ?? null;
    },
  },
  push: {
    f(ctx, scope, arr, value) {
      if (Array.isArray(arr)) {
        arr.push(value);
        return arr.length;
      }
      return -1;
    },
  },
  pop: {
    f(ctx, scope, arr) {
      if (Array.isArray(arr)) {
        return arr.pop() ?? null;
      }
      return null;
    },
  },
  shift: {
    f(ctx, scope, arr) {
      if (Array.isArray(arr)) {
        return arr.shift() ?? null;
      }
      return null;
    },
  },
  unshift: {
    f(ctx, scope, arr, value) {
      if (Array.isArray(arr)) {
        arr.unshift(value);
        return arr.length;
      }
      return -1;
    },
  },
  keys: {
    f(ctx, scope, obj) {
      return Object.keys(toObject(obj));
    },
  },
  values: {
    f(ctx, scope, obj) {
      return Object.values(toObject(obj));
    },
  },
  get: {
    f(ctx, scope, obj, key) {
      return toObject(obj)[toString(key)] ?? null;
    },
  },
  set: {
    f(ctx, scope, obj, key, value) {
      if (obj && typeof obj === 'object') {
        obj[toString(key)] = value;
      }
      return obj;
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
    const ComputedPropertyName = Node(
      All('[', CompoundExpression, ']'),
      ([expression]) => ({ type: 'ComputedProperty', expression }),
    );
    const PropertyName = Any(
      Identifier,
      StringLiteral,
      NumericLiteral,
      ComputedPropertyName,
    );
    const ShortNotation = Node(Identifier, ([expr], $, $next) =>
      srcMap({ ...expr, shortNotation: true }, $, $next),
    );
    const PropertyDefinition = Node(
      Any(All(PropertyName, ':', Expression), ShortNotation),
      ([name, value]) => ({
        name,
        value,
      }),
    );
    const PropertyDefinitions = All(
      PropertyDefinition,
      Star(All(',', PropertyDefinition)),
    );
    const PropertyDefinitionList = Optional(
      All(PropertyDefinitions, Optional(',')),
    );
    const ObjectLiteral = Node(
      All('{', PropertyDefinitionList, '}'),
      (properties) => ({ type: 'ObjectLiteral', properties }),
    );
    const Element = Any(Expression);
    const ElementList = All(Element, Star(All(',', Element)));
    const ArrayLiteral = Node(All('[', ElementList, ']'), (elements) => ({
      type: 'ArrayLiteral',
      elements,
    }));
    const PrimaryExpression = Node(
      Any(
        Literal,
        Identifier,
        ArrayLiteral,
        ObjectLiteral,
        All('(', CompoundExpression, ')'),
      ),
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
      ([test, consequent, alternate]) => {
        return consequent
          ? { type: 'ConditionalExpression', test, consequent, alternate }
          : test;
      },
    );
    return Node(Any(TernaryExpression), ([expr], $, $next) =>
      srcMap(expr, $, $next),
    );
  }),
);

export function clamp(n: number, min: number = 0, max: number = 1): number {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}
export function avg(nn: number[]): number {
  if (nn.length < 1) return 0;
  return sum(nn) / nn.length;
}
export function sum(nn: number[]): number {
  let n = 0;
  for (let i = 0; i < nn.length; i++) n += nn[i]!;
  return n;
}
