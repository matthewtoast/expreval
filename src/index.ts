import * as seedrandom from "seedrandom"
import Decimal from 'decimal.js'

export type DictOf<T> = { [key: string]: T }
export type TExprScalar = number | string | boolean | null
export type TExprFunc = (ctx: TExprContext, ...args: TExprScalar[]) => Promise<TExprScalar>
export type TExprFuncDef = {
  f: TExprFunc
}

export type TExprContext = {
  rng: () => number
  funcs: DictOf<TExprFuncDef>
  vars: DictOf<TExprScalar>
  consts: DictOf<TExprScalar>
}

export type TExpression =
  | TCallExpression
  | TIdentifierExpression
  | TBinaryExpression
  | TLiteralExpression
  | TConditionalExpression
  | TUnaryExpression

export type TCallExpression = {
  type: "CallExpression"
  callee: TIdentifierExpression
  arguments: TExpression[]
}

export type TIdentifierExpression = {
  type: "Identifier"
  name: string
}

export type TBinaryExpression = {
  type: "BinaryExpression"
  left: TExpression
  operator: string
  right: TExpression
}

export type TLiteralExpression = {
  type: "Literal"
  value: string
  raw: string
}

export type TConditionalExpression = {
  type: "ConditionalExpression"
  left: TExpression
  operator: string
  right: TExpression
}

export type TUnaryExpression = {
  type: "UnaryExpression"
  argument: TExpression
  operator: string
}

export const CONSTS: DictOf<TExprScalar> = {
  E: Math.E,
  LN10: Math.LN10,
  LN2: Math.LN2,
  LOG10E: Math.LOG10E,
  LOG2E: Math.LOG2E,
  PI: Math.PI,
  SQRT1_2: Math.SQRT1_2,
  SQRT2: Math.SQRT2,
}

const BINOP_MAP = {
  "**": "pow",
  "*": "mul",
  "/": "div",
  "%": "mod",
  "+": "add",
  "-": "sub",
  ">>>": "bitwiseRightShiftUnsigned",
  "<<": "bitwiseLeftShift",
  ">>": "bitwiseRightShift",
  "<=": "lte",
  ">=": "gte",
  "<": "lt",
  ">": "gt",
  "===": "eq",
  "!==": "neq",
  "==": "eq",
  "!=": "neq",
  "&": "bitwiseAnd",
  "^": "bitwiseXor",
  "|": "bitwiseOr",
  "&&": "and",
  "||": "or",
}

const UNOP_MAP = {
  "+": "number",
  "-": "negate",
  "~": "bitwiseNot",
  "!": "not",
}

const IgnoreWhitespace = (Rule) => Ignore(/^\s+/, Rule)
const QuoteToken = Any(/^('[^'\\]*(?:\\.[^'\\]*)*')/, /^("[^"\\]*(?:\\.[^"\\]*)*")/)
const NumericToken = Any(/^((?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:[eE][-+]?[0-9]+)?)\b/, /^(0[xX][0-9a-fA-F]+)\b/)
const NullToken = /^(null)\b/
const BooleanToken = /^(true|false)\b/
const IdentifierToken = /^([a-zA-Z_$][a-zA-Z0-9_$]*)/
const BinaryOperatorPrecedence = [
  "**",
  Any("*", "/", "%"),
  Any("+", "-"),
  Any(">>>", "<<", ">>"),
  Any("<=", ">=", "<", ">"),
  Any("===", "!==", "==", "!="),
  /^&(?!&)/,
  "^",
  /^\|(?!\|)/,
  "&&",
  "||",
]

export function createExprContext(
  funcs: DictOf<TExprFuncDef> = {},
  vars: DictOf<TExprScalar> = {},
  consts: DictOf<TExprScalar> = {},
  seed: string = "expreval"
): TExprContext {
  return {
    rng: seedrandom.default(seed),
    vars: { ...vars },
    funcs: { ...STDLIB, ...funcs },
    consts: { ...CONSTS, ...consts },
  }
}

export async function evaluateExpr(code: string, ctx: TExprContext = createExprContext()): Promise<TExprScalar> {
  return executeExpr(parseExpr(code), ctx)
}

export default evaluateExpr

export function parseExpr(code: string): TExpression {
  const parser = Parser(DefaultGrammar)
  return parser(code)
}

export async function executeExpr(ast: TExpression, ctx: TExprContext = createExprContext()): Promise<TExprScalar> {
  switch (ast.type) {
    case "Literal":
      return ast.value
    case "Identifier":
      if (Object.keys(ctx.vars).includes(ast.name)) {
        return ctx.vars[ast.name]!
      }
      if (Object.keys(ctx.consts).includes(ast.name)) {
        return ctx.consts[ast.name]!
      }
      return ast.name
    case "CallExpression":
      const func = Object.keys(ctx.funcs).includes(ast.callee.name) ? ctx.funcs[ast.callee.name] : null
      if (func && typeof func.f === "function") {
        const args = await asyncMap(ast.arguments, async (expr) => executeExpr(expr, ctx))
        return await func.f(ctx, ...args)
      }
      throw new Error(`Function not found: '${ast.callee.name}'`)
    case "BinaryExpression":
    case "ConditionalExpression":
      const binop = Object.keys(BINOP_MAP).includes(ast.operator) ? BINOP_MAP[ast.operator] : null
      if (binop) {
        return executeExpr(
          {
            type: "CallExpression",
            callee: {
              name: binop,
              type: "Identifier",
            },
            arguments: [ast.left, ast.right],
          },
          ctx
        )
      }
      throw new Error(`Operator not found: '${ast.operator}'`)
    case "UnaryExpression":
      const unop = Object.keys(UNOP_MAP).includes(ast.operator) ? BINOP_MAP[ast.operator] : null
      if (unop) {
        return executeExpr(
          {
            type: "CallExpression",
            callee: {
              name: unop,
              type: "Identifier",
            },
            arguments: [ast.argument],
          },
          ctx
        )
      }
      throw new Error(`Operator not found: '${ast.operator}'`)
    default:
      throw new Error(`Syntax error`)
  }
}

async function attempt<T>(f: () => Promise<T>, err?: Error): Promise<T | Error> {
  try {
    return await f()
  } catch (exception) {
    console.warn(exception)
    return err ?? (exception as Error)
  }
}

function toNumber(v: any, fallback: number = 0): number {
  if (typeof v === "number") {
    return isNaN(v) ? fallback : v
  }
  if (typeof v === "string") {
    if (v.includes(".")) {
      return parseFloat(v)
    }
    return parseInt(v)
  }
  return fallback
}

function toBoolean(v: TExprScalar): boolean {
  if (!v) {
    return false
  }
  if (typeof v === "string" && v.match(/^\s+$/)) {
    return false
  }
  if (v === "false") {
    return false
  }
  if (v === "0") {
    return false
  }
  return true
}

function toString(v: TExprScalar, radix: number = 10): string {
  if (typeof v === "number") {
    return v.toString(radix)
  }
  if (v === true || v === "true") {
    return "true"
  }
  if (!v || v === "false") {
    return "false"
  }
  return v + ""
}

function toDecimal(n: TExprScalar): Decimal {
  if (!n) {
    return new Decimal(0)
  }
  if (n === true) {
    return new Decimal(1)
  }
  if (typeof n === "number") {
    return new Decimal(n)
  }
  if (!toBoolean(n)) {
    return new Decimal(0)
  }
  return new Decimal(n)
}

async function asyncMap<V, T>(
  array: V[],
  callback: (el: V, idx: number, arr: V[]) => Promise<T>
) {
  const out: T[] = []
  for (let index = 0; index < array.length; index++) {
    const m = await callback(array[index]!, index, array)
    out.push(m)
  }
  return out
}

export const STDLIB: DictOf<TExprFuncDef> = {
  unixTimestampNow: {
    async f() {
      return Date.now()
    },
  },
  unixTimestampForDate: {
    async f(ctx, year, mon, day, hour, min, second) {
      return new Date(
        toNumber(year),
        toNumber(mon),
        toNumber(day),
        toNumber(hour),
        toNumber(min),
        toNumber(second)
      ).getTime()
    },
  },

  all: {
    async f(ctx, ...xs) {
      for (let i = 0; i < xs.length; i++) {
        if (!xs[i]) {
          return false
        }
      }
      return true
    },
  },
  any: {
    async f(ctx, ...xs) {
      for (let i = 0; i < xs.length; i++) {
        if (xs[i]) {
          return true
        }
      }
      return false
    },
  },
  some: {
    async f(ctx, ...xs) {
      return STDLIB["any"]!.f(ctx, ...xs)
    },
  },
  none: {
    async f(ctx, ...xs) {
      return !STDLIB["any"]!.f(ctx, ...xs)
    },
  },

  or: {
    async f(ctx, a, b) {
      return toBoolean(a) || toBoolean(b)
    },
  },
  and: {
    async f(ctx, a, b) {
      return toBoolean(a) && toBoolean(b)
    },
  },
  not: {
    async f(ctx, a) {
      return !toBoolean(a)
    },
  },

  gt: {
    async f(ctx, a, b) {
      return toDecimal(a).gt(toDecimal(b))
    },
  },
  gte: {
    async f(ctx, a, b) {
      return toDecimal(a).gte(toDecimal(b))
    },
  },
  lt: {
    async f(ctx, a, b) {
      return toDecimal(a).lt(toDecimal(b))
    },
  },
  lte: {
    async f(ctx, a, b) {
      return toDecimal(a).lte(toDecimal(b))
    },
  },
  eq: {
    async f(ctx, a, b) {
      return toString(a) === toString(b)
    },
  },
  neq: {
    async f(ctx, a, b) {
      return toString(a) !== toString(b)
    },
  },

  rand: {
    async f(ctx) {
      return ctx.rng()
    },
  },
  randInRange: {
    async f(ctx, min, max) {
      return ctx.rng() * (Number(max) - Number(min)) + Number(min)
    },
  },
  randInt: {
    async f(ctx) {
      return Math.floor(ctx.rng() * 10)
    },
  },
  randIntInRange: {
    async f(ctx, min, max) {
      min = Math.ceil(Number(min))
      max = Math.floor(Number(max))
      return Math.floor(ctx.rng() * (max - min + 1)) + min
    },
  },

  number: {
    async f(ctx, a) {
      return Number(a)
    },
  },
  bitwiseOr: {
    async f(ctx, a, b) {
      return Number(a) | Number(b)
    },
  },
  bitwiseXor: {
    async f(ctx, a, b) {
      return Number(a) ^ Number(b)
    },
  },
  bitwiseAnd: {
    async f(ctx, a, b) {
      return Number(a) & Number(b)
    },
  },
  bitwiseNot: {
    async f(ctx, a) {
      return ~Number(a)
    },
  },
  bitwiseLeftShift: {
    async f(ctx, a, b) {
      return Number(a) << Number(b)
    },
  },
  bitwiseRightShift: {
    async f(ctx, a, b) {
      return Number(a) >> Number(b)
    },
  },
  bitwiseRightshiftUnsigned: {
    async f(ctx, a, b) {
      return Number(a) >>> Number(b)
    },
  },
  negate: {
    async f(ctx, a) {
      return toDecimal(a).neg().toString()
    },
  },
  add: {
    async f(ctx, a, b) {
      return toDecimal(a).add(toDecimal(b)).toString()
    },
  },
  sub: {
    async f(ctx, a, b) {
      return toDecimal(a).sub(toDecimal(b)).toString()
    },
  },
  div: {
    async f(ctx, a, b) {
      return toDecimal(a).div(toDecimal(b)).toString()
    },
  },
  mul: {
    async f(ctx, a, b) {
      return toDecimal(a).mul(toDecimal(b)).toString()
    },
  },
  mod: {
    async f(ctx, a, b) {
      return toDecimal(a).mod(toDecimal(b)).toString()
    },
  },
  pow: {
    async f(ctx, a, b) {
      return toDecimal(a).pow(toDecimal(b)).toString()
    },
  },

  abs: {
    async f(ctx, a) {
      return Decimal.abs(toDecimal(a)).toString()
    },
  },
  acos: {
    async f(ctx, a) {
      return Decimal.acos(toDecimal(a)).toString()
    },
  },
  acosh: {
    async f(ctx, a) {
      return Decimal.acosh(toDecimal(a)).toString()
    },
  },
  asin: {
    async f(ctx, a) {
      return Decimal.asin(toDecimal(a)).toString()
    },
  },
  asinh: {
    async f(ctx, a) {
      return Decimal.asinh(toDecimal(a)).toString()
    },
  },
  atan: {
    async f(ctx, a) {
      return Decimal.atan(toDecimal(a)).toString()
    },
  },
  atan2: {
    async f(ctx, a, b) {
      return Decimal.atan2(toDecimal(a), toDecimal(b)).toString()
    },
  },
  atanh: {
    async f(ctx, a) {
      return Decimal.atanh(toDecimal(a)).toString()
    },
  },
  cbrt: {
    async f(ctx, a) {
      return Decimal.cbrt(toDecimal(a)).toString()
    },
  },
  ceil: {
    async f(ctx, a) {
      return Decimal.ceil(toDecimal(a)).toString()
    },
  },
  cos: {
    async f(ctx, a) {
      return Decimal.cos(toDecimal(a)).toString()
    },
  },
  cosh: {
    async f(ctx, a) {
      return Decimal.cosh(toDecimal(a)).toString()
    },
  },
  exp: {
    async f(ctx, a) {
      return Decimal.exp(toDecimal(a)).toString()
    },
  },
  floor: {
    async f(ctx, a) {
      return Decimal.floor(toDecimal(a)).toString()
    },
  },
  hypot: {
    async f(ctx, a) {
      return Decimal.hypot(toDecimal(a)).toString()
    },
  },
  log: {
    async f(ctx, a) {
      return Decimal.log(toDecimal(a)).toString()
    },
  },
  log10: {
    async f(ctx, a) {
      return Decimal.log10(toDecimal(a)).toString()
    },
  },
  log2: {
    async f(ctx, a) {
      return Decimal.log2(toDecimal(a)).toString()
    },
  },
  max: {
    async f(ctx, a) {
      return Decimal.max(toDecimal(a)).toString()
    },
  },
  min: {
    async f(ctx, a) {
      return Decimal.min(toDecimal(a)).toString()
    },
  },
  round: {
    async f(ctx, a) {
      return Decimal.round(toDecimal(a)).toString()
    },
  },
  sign: {
    async f(ctx, a) {
      return Decimal.sign(toDecimal(a)).toString()
    },
  },
  sin: {
    async f(ctx, a) {
      return Decimal.sin(toDecimal(a)).toString()
    },
  },
  sinh: {
    async f(ctx, a) {
      return Decimal.sinh(toDecimal(a)).toString()
    },
  },
  sqrt: {
    async f(ctx, a) {
      return Decimal.sqrt(toDecimal(a)).toString()
    },
  },
  tan: {
    async f(ctx, a) {
      return Decimal.tan(toDecimal(a)).toString()
    },
  },
  tanh: {
    async f(ctx, a) {
      return Decimal.tanh(toDecimal(a)).toString()
    },
  },
  trunc: {
    async f(ctx, a) {
      return Decimal.trunc(toDecimal(a)).toString()
    },
  },

  fromCharCode: {
    async f(ctx, a) {
      return String.fromCharCode(Number(a))
    },
  },
  fromCodePoint: {
    async f(ctx, a) {
      return String.fromCodePoint(Number(a))
    },
  },
  parseInt: {
    async f(ctx, a, b) {
      return parseInt(toString(a), Number(b))
    },
  },
  parseFloat: {
    async f(ctx, a) {
      return parseFloat(toString(a))
    },
  },
  length: {
    async f(ctx, a) {
      return toString(a).length
    },
  },
  charAt: {
    async f(ctx, a, b) {
      return toString(a).charAt(Number(b))
    },
  },
  charCodeAt: {
    async f(ctx, a, b) {
      return toString(a).charCodeAt(Number(b))
    },
  },
  codePointAt: {
    async f(ctx, a, b) {
      return toString(a).codePointAt(Number(b)) ?? 0
    },
  },
  concat: {
    async f(ctx, ...ss) {
      return "".concat(...ss.map((s) => toString(s)))
    },
  },
  endsWith: {
    async f(ctx, a, b) {
      return toString(a).endsWith(toString(b))
    },
  },
  includes: {
    async f(ctx, a, b) {
      return toString(a).includes(toString(b))
    },
  },
  indexOf: {
    async f(ctx, a, b) {
      return toString(a).indexOf(toString(b))
    },
  },
  lastIndexOf: {
    async f(ctx, a, b) {
      return toString(a).lastIndexOf(toString(b))
    },
  },
  localeCompare: {
    async f(ctx, a, b) {
      return toString(a).localeCompare(toString(b))
    },
  },
  match: {
    async f(ctx, a, b) {
      return !!toString(a).match(toString(b))
    },
  },
  matchAll: {
    async f(ctx, a, b) {
      return !!toString(a).match(toString(b))
    },
  },
  padEnd: {
    async f(ctx, a, b, c) {
      return toString(a).padEnd(Number(b), toString(c ?? ""))
    },
  },
  padStart: {
    async f(ctx, a, b, c) {
      return toString(a).padStart(Number(b), toString(c ?? ""))
    },
  },
  repeat: {
    async f(ctx, a, b) {
      return toString(a).repeat(Number(b))
    },
  },
  replace: {
    async f(ctx, a, b, c) {
      return toString(a).replace(toString(b), toString(c))
    },
  },
  replaceAll: {
    async f(ctx, a, b, c) {
      return toString(a).replaceAll(toString(b), toString(c))
    },
  },
  slice: {
    async f(ctx, a, b, c) {
      return toString(a).slice(Number(b), Number(c ?? toString(a).length))
    },
  },
  startsWith: {
    async f(ctx, a, b) {
      return toString(a).startsWith(toString(b))
    },
  },
  substring: {
    async f(ctx, a, b, c) {
      return toString(a).substring(Number(b), Number(c))
    },
  },
  toLowerCase: {
    async f(ctx, a) {
      return toString(a).toLowerCase()
    },
  },
  toUpperCase: {
    async f(ctx, a) {
      return toString(a).toUpperCase()
    },
  },
  trim: {
    async f(ctx, a) {
      return toString(a).trim()
    },
  },
  trimEnd: {
    async f(ctx, a) {
      return toString(a).trimEnd()
    },
  },
  trimStart: {
    async f(ctx, a) {
      return toString(a).trimStart()
    },
  },
}

// The code below is derived from code at https://github.com/dmaevsky/rd-parse. License:
// The MIT License (MIT)
// Copyright 2013 - present Dmitry Maevsky
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const associativity = (binop) => (binop === "**" ? r2l : l2r)

function locAt(text, newPos, { pos, line, column }) {
  while (pos < newPos) {
    const ch = text[pos++]
    if (ch === "\n") {
      column = 1
      line++
    } else {
      column++
    }
  }
  return { pos, line, column }
}

const markSeen = ($) => {
  if ($.pos > $.lastSeen.pos) {
    Object.assign($.lastSeen, locAt($.text, $.pos, $.lastSeen))
  }
}

function RegexToken(pattern) {
  return ($) => {
    markSeen($)
    const match = pattern.exec($.text.substring($.pos))
    if (!match) {
      return $
    }
    const $next = {
      ...$,
      pos: $.pos + match[0].length,
    }
    for (let i = 1; i < match.length; i++) {
      $.stack[$next.sp++] = match[i]
    }
    return $next
  }
}

function StringToken(pattern) {
  return ($) => {
    markSeen($)
    if ($.text.startsWith(pattern, $.pos)) {
      return {
        ...$,
        pos: $.pos + pattern.length,
      }
    }
    return $
  }
}

function Use(rule) {
  if (typeof rule === "function") {
    return rule
  }
  if (rule instanceof RegExp) {
    return RegexToken(rule)
  }
  if (typeof rule === "string") {
    return StringToken(rule)
  }
  throw new Error("Invalid rule")
}

function Ignore(toIgnore, rule) {
  rule = Use(rule)
  if (toIgnore) {
    toIgnore = Ignore(null, Plus(toIgnore))
  }

  return ($) => {
    const $cur = toIgnore ? toIgnore($) : $
    $.ignore.push(toIgnore)
    const $next = rule($cur)
    $.ignore.pop()
    return $next === $cur ? $ : toIgnore ? toIgnore($next) : $next
  }
}

const skipIgnored = ($) => {
  if (!$.ignore.length) {
    return $
  }
  const toIgnore = $.ignore[$.ignore.length - 1]
  return toIgnore ? toIgnore($) : $
}

function All(...rules) {
  rules = rules.map(Use)
  return ($) => {
    let $cur = $
    for (let i = 0; i < rules.length; i++) {
      const $before = i > 0 ? skipIgnored($cur) : $cur
      const $after = rules[i]($before)
      if ($after === $before) {
        return $
      }
      if ($after.pos > $before.pos || $after.sp > $before.sp) {
        $cur = $after
      }
    }
    return $cur
  }
}

function Any(...rules) {
  rules = rules.map(Use)
  return ($) => {
    for (let i = 0; i < rules.length; i++) {
      const $next = rules[i]($)
      if ($next !== $) {
        return $next
      }
    }
    return $
  }
}

function Plus(rule) {
  rule = Use(rule)
  return ($) => {
    while (true) {
      const $cur = skipIgnored($)
      const $next = rule($cur)
      if ($next === $cur) {
        return $
      }
      $ = $next
    }
  }
}

function Optional(rule) {
  rule = Use(rule)
  return ($) => {
    const $next = rule($)
    if ($next !== $) {
      return $next
    }
    return { ...$ }
  }
}

function Node(rule, reducer) {
  rule = Use(rule)
  return ($) => {
    const $next = rule($)
    if ($next === $) {
      return $
    }
    const node = reducer($.stack.slice($.sp, $next.sp), $, $next)
    $next.sp = $.sp
    if (node !== null) {
      $.stack[$next.sp++] = node
    }
    return $next
  }
}

const Star = (rule) => Optional(Plus(rule))

const Y = (proc) => ((x) => proc((y) => x(x)(y)))((x) => proc((y) => x(x)(y)))

const START = (text, pos = 0) => ({
  text,
  ignore: [],
  stack: [],
  sp: 0,
  lastSeen: locAt(text, pos, { pos: 0, line: 1, column: 1 }),
  pos,
})

function Parser(Grammar, pos = 0, partial = false): (text: string) => TExpression {
  return (text) => {
    if (typeof text !== "string") {
      throw new Error("Parsing function expects a string input")
    }
    const $ = START(text, pos)
    const $next = Grammar($)
    if ($ === $next || (!partial && $next.pos < text.length)) {
      throw new Error(
        `Unexpected token at ${$.lastSeen.line}:${$.lastSeen.column}. Remainder: ${text.slice($.lastSeen.pos)}`
      )
    }
    return $.stack[0] as unknown as TExpression
  }
}

function l2r(parts, $) {
  let left = parts[0]
  for (let i = 1; i < parts.length; i += 2) {
    const [operator, right] = [parts[i].operator, parts[i + 1]]
    left = srcMap(
      {
        type: "BinaryExpression",
        left,
        operator,
        right,
      },
      $,
      { pos: right.pos + right.text.length }
    )
  }
  return left
}

function r2l(parts, _, $next) {
  let right = parts[parts.length - 1]
  for (let i = parts.length - 2; i >= 0; i -= 2) {
    const [left, operator] = [parts[i - 1], parts[i].operator]
    right = srcMap(
      {
        type: "BinaryExpression",
        left,
        operator,
        right,
      },
      { pos: left.pos },
      $next
    )
  }
  return right
}

const Operator = (Rule) => Node(Rule, (_, $, $next) => ({ $, operator: $.text.substring($.pos, $next.pos) }))

const srcMap = (obj, $, $next) =>
  Object.defineProperties(obj, {
    pos: { writable: true, configurable: true, value: $.pos },
    text: {
      writable: true,
      configurable: true,
      value: ($.text || $next.text).slice($.pos, $next.pos),
    },
  })

const DefaultGrammar = IgnoreWhitespace(
  Y((Expression) => {
    const Identifier = Node(IdentifierToken, ([name]) => ({ type: "Identifier", name }))
    const StringLiteral = Node(QuoteToken, ([raw]) => ({
      type: "Literal",
      value: raw.slice(1, -1),
      raw,
    }))
    const NumericLiteral = Node(NumericToken, ([raw]) => ({ type: "Literal", value: +raw, raw }))
    const NullLiteral = Node(NullToken, ([raw]) => ({ type: "Literal", value: null, raw }))
    const BooleanLiteral = Node(BooleanToken, ([raw]) => ({
      type: "Literal",
      value: raw === "true",
      raw,
    }))
    const Literal = Any(StringLiteral, NumericLiteral, NullLiteral, BooleanLiteral)
    const ArgumentsList = All(Expression, Star(All(",", Expression)))
    const Arguments = Node(All("(", Optional(All(ArgumentsList, Optional(","))), ")"), (args) => ({
      args,
    }))
    const ArgumentsExpression = Node(Any(Arguments), ([part], _, $next) => ({ part, $next }))
    const CompoundExpression = Node(All(Expression, Star(All(",", Expression))), (leafs) =>
      leafs.length > 1 ? { type: "CompoundExpression", leafs } : leafs[0]
    )
    const PrimaryExpression = Node(Any(Literal, Identifier, All("(", CompoundExpression, ")")), ([expr], $, $next) =>
      srcMap(expr, $, $next)
    )
    const CallExpression = Node(All(PrimaryExpression, Star(ArgumentsExpression)), (parts, $, $last) => {
      return parts.reduce((acc, { part, $next }) => {
        return srcMap({ type: "CallExpression", callee: acc, arguments: part.args }, $, $next)
      })
    })
    const UnaryOperator = Operator(Any("+", "-", "~", "!"))
    const UnaryExpression = Node(All(Star(UnaryOperator), CallExpression), (parts, _, $next) =>
      parts.reduceRight((argument, { $, operator }) =>
        srcMap({ type: "UnaryExpression", argument, operator }, $, $next)
      )
    )
    const LogicalExpressionOrExpression = BinaryOperatorPrecedence.reduce(
      (Expr, BinaryOp) => Node(All(Expr, Star(All(Operator(BinaryOp), Expr))), associativity(BinaryOp)),
      UnaryExpression
    )
    const ConditionalExpression = Node(
      All(LogicalExpressionOrExpression, Optional(All("?", Expression, ":", Expression))),
      ([test, consequent, alternate]) =>
        consequent ? { type: "ConditionalExpression", test, consequent, alternate } : test
    )
    return Node(Any(ConditionalExpression), ([expr], $, $next) => srcMap(expr, $, $next))
  })
)
