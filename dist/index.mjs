/*!
 * awne v0.0.0
 * (c) Matthew Trost
 * Released under the MIT License.
 */

import * as seedrandom from 'seedrandom';
import Decimal from 'decimal.js';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var CONSTS = {
    E: Math.E,
    LN10: Math.LN10,
    LN2: Math.LN2,
    LOG10E: Math.LOG10E,
    LOG2E: Math.LOG2E,
    PI: Math.PI,
    SQRT1_2: Math.SQRT1_2,
    SQRT2: Math.SQRT2,
};
var BINOP_MAP = {
    "**": { alias: "pow" },
    "*": { alias: "mul" },
    "/": { alias: "div" },
    "%": { alias: "mod" },
    "+": { alias: "add" },
    "-": { alias: "sub" },
    ">>>": { alias: "bitwiseRightShiftUnsigned" },
    "<<": { alias: "bitwiseLeftShift" },
    ">>": { alias: "bitwiseRightShift" },
    "<=": { alias: "lte" },
    ">=": { alias: "gte" },
    "<": { alias: "lt" },
    ">": { alias: "gt" },
    "===": { alias: "eq" },
    "!==": { alias: "neq" },
    "==": { alias: "eq" },
    "!=": { alias: "neq" },
    "&": { alias: "bitwiseAnd" },
    "^": { alias: "bitwiseXor" },
    "|": { alias: "bitwiseOr" },
    "&&": { alias: "and" },
    "||": { alias: "or" },
    ":=": { alias: "set" },
    "+=": { alias: "setAdd" },
    "-=": { alias: "setSub" },
    "/=": { alias: "setDiv" },
    "*=": { alias: "setMul" },
};
var UNOP_MAP = {
    "+": { alias: "number" },
    "-": { alias: "negate" },
    "~": { alias: "bitwiseNot" },
    "!": { alias: "not" },
};
var IgnoreWhitespace = function (Rule) { return Ignore(/^\s+/, Rule); };
var QuoteToken = Any(/^('[^'\\]*(?:\\.[^'\\]*)*')/, /^("[^"\\]*(?:\\.[^"\\]*)*")/);
var NumericToken = Any(/^((?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:[eE][-+]?[0-9]+)?)\b/, /^(0[xX][0-9a-fA-F]+)\b/);
var NullToken = /^(null)\b/;
var BooleanToken = /^(true|false)\b/;
var IdentifierToken = /^([a-zA-Z_$][a-zA-Z0-9_$]*)/;
var BinaryOperatorPrecedence = [
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
    Any(":=", "+=", "-=", "*=", "/=")
];
function createExprContext(_a) {
    var funcs = _a.funcs, vars = _a.vars, binops = _a.binops, unops = _a.unops, _b = _a.seed, seed = _b === void 0 ? "expreval" : _b;
    return {
        rng: seedrandom.default(seed),
        vars: __assign(__assign({}, CONSTS), vars),
        funcs: __assign(__assign({}, STDLIB), funcs),
        binops: __assign(__assign({}, BINOP_MAP), binops),
        unops: __assign(__assign({}, UNOP_MAP), unops),
    };
}
function evaluateExpr(code, ctx) {
    if (ctx === void 0) { ctx = createExprContext({}); }
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, executeAst(parseExpr(code), ctx)];
                case 1: return [2 /*return*/, (_a.result = _b.sent(),
                        _a.ctx = ctx,
                        _a)];
            }
        });
    });
}
function parseExpr(code) {
    var parser = Parser(DefaultGrammar);
    return parser(code.replace(/\/\/.*\n/g, ''));
}
function executeAst(ast, ctx) {
    var _a;
    if (ctx === void 0) { ctx = createExprContext({}); }
    return __awaiter(this, void 0, void 0, function () {
        var _b, fdef, args, left, right, _c, _d, _e, _f, _g, _h, _j, binop, result, unop;
        var _this = this;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    _b = ast.type;
                    switch (_b) {
                        case "Literal": return [3 /*break*/, 1];
                        case "Identifier": return [3 /*break*/, 2];
                        case "CallExpression": return [3 /*break*/, 3];
                        case "BinaryExpression": return [3 /*break*/, 11];
                        case "TernaryExpression": return [3 /*break*/, 12];
                        case "UnaryExpression": return [3 /*break*/, 17];
                    }
                    return [3 /*break*/, 18];
                case 1: return [2 /*return*/, ast.value];
                case 2:
                    if (Object.keys(ctx.vars).includes(ast.name)) {
                        return [2 /*return*/, ctx.vars[ast.name]];
                    }
                    return [2 /*return*/, ast.name];
                case 3:
                    fdef = Object.keys(ctx.funcs).includes(ast.callee.name) ? ctx.funcs[ast.callee.name] : null;
                    if (!fdef) return [3 /*break*/, 10];
                    args = [];
                    if (!(fdef.assignment && ast.arguments.length > 1)) return [3 /*break*/, 5];
                    left = (_a = exprToIdentifier(ast.arguments[0])) !== null && _a !== void 0 ? _a : '';
                    right = ast.arguments.slice(1);
                    _d = (_c = args.push).apply;
                    _e = [args];
                    _f = [[left]];
                    return [4 /*yield*/, asyncMap(right, function (expr) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, executeAst(expr, ctx)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 4:
                    _d.apply(_c, _e.concat([__spreadArray.apply(void 0, _f.concat([_k.sent(), false]))]));
                    return [3 /*break*/, 7];
                case 5:
                    _h = (_g = args.push).apply;
                    _j = [args];
                    return [4 /*yield*/, asyncMap(ast.arguments, function (expr) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, executeAst(expr, ctx)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 6:
                    _h.apply(_g, _j.concat([_k.sent()]));
                    _k.label = 7;
                case 7:
                    if (!fdef.async) return [3 /*break*/, 9];
                    return [4 /*yield*/, fdef.f.apply(fdef, __spreadArray([ctx], args, false))];
                case 8: return [2 /*return*/, _k.sent()];
                case 9: return [2 /*return*/, fdef.f.apply(fdef, __spreadArray([ctx], args, false))];
                case 10: throw new Error("Function not found: '".concat(ast.callee.name, "'"));
                case 11:
                    binop = Object.keys(ctx.binops).includes(ast.operator) ? ctx.binops[ast.operator] : null;
                    if (binop) {
                        return [2 /*return*/, executeAst({
                                type: "CallExpression",
                                callee: {
                                    name: binop.alias,
                                    type: "Identifier",
                                },
                                arguments: [ast.left, ast.right],
                            }, ctx)];
                    }
                    throw new Error("Operator not found: '".concat(ast.operator, "'"));
                case 12: return [4 /*yield*/, executeAst(ast.test, ctx)];
                case 13:
                    result = _k.sent();
                    if (!toBoolean(result)) return [3 /*break*/, 15];
                    return [4 /*yield*/, executeAst(ast.consequent, ctx)];
                case 14: return [2 /*return*/, _k.sent()];
                case 15: return [4 /*yield*/, executeAst(ast.alternate, ctx)];
                case 16: return [2 /*return*/, _k.sent()];
                case 17:
                    unop = Object.keys(ctx.unops).includes(ast.operator) ? ctx.unops[ast.operator] : null;
                    if (unop) {
                        return [2 /*return*/, executeAst({
                                type: "CallExpression",
                                callee: {
                                    name: unop.alias,
                                    type: "Identifier",
                                },
                                arguments: [ast.argument],
                            }, ctx)];
                    }
                    throw new Error("Operator not found: '".concat(ast.operator, "'"));
                case 18: throw new Error("Syntax error");
            }
        });
    });
}
function exprToIdentifier(v) {
    if (v.type === 'Identifier') {
        return v.name;
    }
    return null;
}
function toNumber(v, fallback) {
    if (fallback === void 0) { fallback = 0; }
    if (typeof v === "number") {
        return isNaN(v) ? fallback : v;
    }
    if (typeof v === "string") {
        if (v.includes(".")) {
            return parseFloat(v);
        }
        return parseInt(v);
    }
    return fallback;
}
function toBoolean(v) {
    if (!v) {
        return false;
    }
    if (typeof v === "string" && v.match(/^\s+$/)) {
        return false;
    }
    if (v === "false") {
        return false;
    }
    if (v === "0") {
        return false;
    }
    return true;
}
function toString(v, radix) {
    if (radix === void 0) { radix = 10; }
    if (typeof v === "number") {
        return v.toString(radix);
    }
    if (v === true || v === "true") {
        return "true";
    }
    if (!v || v === "false") {
        return "false";
    }
    return v + "";
}
function toDecimal(n) {
    if (!n) {
        return new Decimal(0);
    }
    if (n === true) {
        return new Decimal(1);
    }
    if (typeof n === "number") {
        return new Decimal(n);
    }
    if (!toBoolean(n)) {
        return new Decimal(0);
    }
    return new Decimal(n);
}
function asyncMap(array, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var out, index, m;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    out = [];
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < array.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, callback(array[index], index, array)];
                case 2:
                    m = _a.sent();
                    out.push(m);
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, out];
            }
        });
    });
}
function setVar(ctx, name, value) {
    var key = toString(name);
    if (key.match(/^__proto__|prototype|constructor$/)) {
        return value;
    }
    ctx.vars[key] = value;
    return value;
}
function toVar(ctx, name) {
    var _a;
    return (_a = ctx.vars[name + ""]) !== null && _a !== void 0 ? _a : null;
}
var STDLIB = {
    do: {
        f: function (ctx) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = args[args.length - 1]) !== null && _a !== void 0 ? _a : null;
        }
    },
    set: {
        assignment: true,
        f: function (ctx, left, right) {
            return setVar(ctx, left, right);
        }
    },
    setAdd: {
        assignment: true,
        f: function (ctx, left, right) {
            return setVar(ctx, left, toNumber(toVar(ctx, left)) + toNumber(right));
        }
    },
    setSub: {
        assignment: true,
        f: function (ctx, left, right) {
            return setVar(ctx, left, toNumber(toVar(ctx, left)) - toNumber(right));
        }
    },
    setMul: {
        assignment: true,
        f: function (ctx, left, right) {
            return setVar(ctx, left, toNumber(toVar(ctx, left)) * toNumber(right));
        }
    },
    setDiv: {
        assignment: true,
        f: function (ctx, left, right) {
            return setVar(ctx, left, toNumber(toVar(ctx, left)) / toNumber(right));
        }
    },
    unixTimestampNow: {
        f: function () {
            return Date.now();
        },
    },
    unixTimestampForDate: {
        f: function (ctx, year, mon, day, hour, min, second) {
            return new Date(toNumber(year), toNumber(mon), toNumber(day), toNumber(hour), toNumber(min), toNumber(second)).getTime();
        },
    },
    all: {
        f: function (ctx) {
            var xs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                xs[_i - 1] = arguments[_i];
            }
            for (var i = 0; i < xs.length; i++) {
                if (!xs[i]) {
                    return false;
                }
            }
            return true;
        },
    },
    any: {
        f: function (ctx) {
            var xs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                xs[_i - 1] = arguments[_i];
            }
            for (var i = 0; i < xs.length; i++) {
                if (xs[i]) {
                    return true;
                }
            }
            return false;
        },
    },
    some: {
        f: function (ctx) {
            var _a;
            var xs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                xs[_i - 1] = arguments[_i];
            }
            return !!(_a = STDLIB["any"]).f.apply(_a, __spreadArray([ctx], xs, false));
        },
    },
    none: {
        f: function (ctx) {
            var _a;
            var xs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                xs[_i - 1] = arguments[_i];
            }
            return !(_a = STDLIB["any"]).f.apply(_a, __spreadArray([ctx], xs, false));
        },
    },
    or: {
        f: function (ctx, a, b) {
            return toBoolean(a) || toBoolean(b);
        },
    },
    and: {
        f: function (ctx, a, b) {
            return toBoolean(a) && toBoolean(b);
        },
    },
    not: {
        f: function (ctx, a) {
            return !toBoolean(a);
        },
    },
    gt: {
        f: function (ctx, a, b) {
            return toDecimal(a).gt(toDecimal(b));
        },
    },
    gte: {
        f: function (ctx, a, b) {
            return toDecimal(a).gte(toDecimal(b));
        },
    },
    lt: {
        f: function (ctx, a, b) {
            return toDecimal(a).lt(toDecimal(b));
        },
    },
    lte: {
        f: function (ctx, a, b) {
            return toDecimal(a).lte(toDecimal(b));
        },
    },
    eq: {
        f: function (ctx, a, b) {
            return toString(a) === toString(b);
        },
    },
    neq: {
        f: function (ctx, a, b) {
            return toString(a) !== toString(b);
        },
    },
    rand: {
        f: function (ctx) {
            return ctx.rng();
        },
    },
    randInRange: {
        f: function (ctx, min, max) {
            return ctx.rng() * (Number(max) - Number(min)) + Number(min);
        },
    },
    randInt: {
        f: function (ctx) {
            return Math.floor(ctx.rng() * 10);
        },
    },
    randIntInRange: {
        f: function (ctx, min, max) {
            min = Math.ceil(Number(min));
            max = Math.floor(Number(max));
            return Math.floor(ctx.rng() * (max - min + 1)) + min;
        },
    },
    number: {
        f: function (ctx, a) {
            return Number(a);
        },
    },
    bitwiseOr: {
        f: function (ctx, a, b) {
            return Number(a) | Number(b);
        },
    },
    bitwiseXor: {
        f: function (ctx, a, b) {
            return Number(a) ^ Number(b);
        },
    },
    bitwiseAnd: {
        f: function (ctx, a, b) {
            return Number(a) & Number(b);
        },
    },
    bitwiseNot: {
        f: function (ctx, a) {
            return ~Number(a);
        },
    },
    bitwiseLeftShift: {
        f: function (ctx, a, b) {
            return Number(a) << Number(b);
        },
    },
    bitwiseRightShift: {
        f: function (ctx, a, b) {
            return Number(a) >> Number(b);
        },
    },
    bitwiseRightshiftUnsigned: {
        f: function (ctx, a, b) {
            return Number(a) >>> Number(b);
        },
    },
    negate: {
        f: function (ctx, a) {
            return toDecimal(a).neg().toFixed();
        },
    },
    add: {
        f: function (ctx, a, b) {
            return toDecimal(a).add(toDecimal(b)).toFixed();
        },
    },
    sub: {
        f: function (ctx, a, b) {
            return toDecimal(a).sub(toDecimal(b)).toFixed();
        },
    },
    div: {
        f: function (ctx, a, b) {
            return toDecimal(a).div(toDecimal(b)).toFixed();
        },
    },
    mul: {
        f: function (ctx, a, b) {
            return toDecimal(a).mul(toDecimal(b)).toFixed();
        },
    },
    mod: {
        f: function (ctx, a, b) {
            return toDecimal(a).mod(toDecimal(b)).toFixed();
        },
    },
    pow: {
        f: function (ctx, a, b) {
            return toDecimal(a).pow(toDecimal(b)).toFixed();
        },
    },
    abs: {
        f: function (ctx, a) {
            return Decimal.abs(toDecimal(a)).toFixed();
        },
    },
    acos: {
        f: function (ctx, a) {
            return Decimal.acos(toDecimal(a)).toFixed();
        },
    },
    acosh: {
        f: function (ctx, a) {
            return Decimal.acosh(toDecimal(a)).toFixed();
        },
    },
    asin: {
        f: function (ctx, a) {
            return Decimal.asin(toDecimal(a)).toFixed();
        },
    },
    asinh: {
        f: function (ctx, a) {
            return Decimal.asinh(toDecimal(a)).toFixed();
        },
    },
    atan: {
        f: function (ctx, a) {
            return Decimal.atan(toDecimal(a)).toFixed();
        },
    },
    atan2: {
        f: function (ctx, a, b) {
            return Decimal.atan2(toDecimal(a), toDecimal(b)).toFixed();
        },
    },
    atanh: {
        f: function (ctx, a) {
            return Decimal.atanh(toDecimal(a)).toFixed();
        },
    },
    cbrt: {
        f: function (ctx, a) {
            return Decimal.cbrt(toDecimal(a)).toFixed();
        },
    },
    ceil: {
        f: function (ctx, a) {
            return Decimal.ceil(toDecimal(a)).toFixed();
        },
    },
    cos: {
        f: function (ctx, a) {
            return Decimal.cos(toDecimal(a)).toFixed();
        },
    },
    cosh: {
        f: function (ctx, a) {
            return Decimal.cosh(toDecimal(a)).toFixed();
        },
    },
    exp: {
        f: function (ctx, a) {
            return Decimal.exp(toDecimal(a)).toFixed();
        },
    },
    floor: {
        f: function (ctx, a) {
            return Decimal.floor(toDecimal(a)).toFixed();
        },
    },
    hypot: {
        f: function (ctx, a) {
            return Decimal.hypot(toDecimal(a)).toFixed();
        },
    },
    log: {
        f: function (ctx, a) {
            return Decimal.log(toDecimal(a)).toFixed();
        },
    },
    log10: {
        f: function (ctx, a) {
            return Decimal.log10(toDecimal(a)).toFixed();
        },
    },
    log2: {
        f: function (ctx, a) {
            return Decimal.log2(toDecimal(a)).toFixed();
        },
    },
    max: {
        f: function (ctx, a) {
            return Decimal.max(toDecimal(a)).toFixed();
        },
    },
    min: {
        f: function (ctx, a) {
            return Decimal.min(toDecimal(a)).toFixed();
        },
    },
    round: {
        f: function (ctx, a) {
            return Decimal.round(toDecimal(a)).toFixed();
        },
    },
    sign: {
        f: function (ctx, a) {
            return Decimal.sign(toDecimal(a)).toFixed();
        },
    },
    sin: {
        f: function (ctx, a) {
            return Decimal.sin(toDecimal(a)).toFixed();
        },
    },
    sinh: {
        f: function (ctx, a) {
            return Decimal.sinh(toDecimal(a)).toFixed();
        },
    },
    sqrt: {
        f: function (ctx, a) {
            return Decimal.sqrt(toDecimal(a)).toFixed();
        },
    },
    tan: {
        f: function (ctx, a) {
            return Decimal.tan(toDecimal(a)).toFixed();
        },
    },
    tanh: {
        f: function (ctx, a) {
            return Decimal.tanh(toDecimal(a)).toFixed();
        },
    },
    trunc: {
        f: function (ctx, a) {
            return Decimal.trunc(toDecimal(a)).toFixed();
        },
    },
    fromCharCode: {
        f: function (ctx, a) {
            return String.fromCharCode(Number(a));
        },
    },
    fromCodePoint: {
        f: function (ctx, a) {
            return String.fromCodePoint(Number(a));
        },
    },
    parseInt: {
        f: function (ctx, a, b) {
            return parseInt(toString(a), Number(b));
        },
    },
    parseFloat: {
        f: function (ctx, a) {
            return parseFloat(toString(a));
        },
    },
    length: {
        f: function (ctx, a) {
            return toString(a).length;
        },
    },
    charAt: {
        f: function (ctx, a, b) {
            return toString(a).charAt(Number(b));
        },
    },
    charCodeAt: {
        f: function (ctx, a, b) {
            return toString(a).charCodeAt(Number(b));
        },
    },
    codePointAt: {
        f: function (ctx, a, b) {
            var _a;
            return (_a = toString(a).codePointAt(Number(b))) !== null && _a !== void 0 ? _a : 0;
        },
    },
    concat: {
        f: function (ctx) {
            var ss = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ss[_i - 1] = arguments[_i];
            }
            return "".concat.apply("", ss.map(function (s) { return toString(s); }));
        },
    },
    endsWith: {
        f: function (ctx, a, b) {
            return toString(a).endsWith(toString(b));
        },
    },
    includes: {
        f: function (ctx, a, b) {
            return toString(a).includes(toString(b));
        },
    },
    indexOf: {
        f: function (ctx, a, b) {
            return toString(a).indexOf(toString(b));
        },
    },
    lastIndexOf: {
        f: function (ctx, a, b) {
            return toString(a).lastIndexOf(toString(b));
        },
    },
    localeCompare: {
        f: function (ctx, a, b) {
            return toString(a).localeCompare(toString(b));
        },
    },
    match: {
        f: function (ctx, a, b) {
            return !!toString(a).match(toString(b));
        },
    },
    matchAll: {
        f: function (ctx, a, b) {
            return !!toString(a).match(toString(b));
        },
    },
    padEnd: {
        f: function (ctx, a, b, c) {
            return toString(a).padEnd(Number(b), toString(c !== null && c !== void 0 ? c : ""));
        },
    },
    padStart: {
        f: function (ctx, a, b, c) {
            return toString(a).padStart(Number(b), toString(c !== null && c !== void 0 ? c : ""));
        },
    },
    repeat: {
        f: function (ctx, a, b) {
            return toString(a).repeat(Number(b));
        },
    },
    replace: {
        f: function (ctx, a, b, c) {
            return toString(a).replace(toString(b), toString(c));
        },
    },
    replaceAll: {
        f: function (ctx, a, b, c) {
            return toString(a).replaceAll(toString(b), toString(c));
        },
    },
    slice: {
        f: function (ctx, a, b, c) {
            return toString(a).slice(Number(b), Number(c !== null && c !== void 0 ? c : toString(a).length));
        },
    },
    startsWith: {
        f: function (ctx, a, b) {
            return toString(a).startsWith(toString(b));
        },
    },
    substring: {
        f: function (ctx, a, b, c) {
            return toString(a).substring(Number(b), Number(c));
        },
    },
    toLowerCase: {
        f: function (ctx, a) {
            return toString(a).toLowerCase();
        },
    },
    toUpperCase: {
        f: function (ctx, a) {
            return toString(a).toUpperCase();
        },
    },
    trim: {
        f: function (ctx, a) {
            return toString(a).trim();
        },
    },
    trimEnd: {
        f: function (ctx, a) {
            return toString(a).trimEnd();
        },
    },
    trimStart: {
        f: function (ctx, a) {
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
var associativity = function (binop) { return (binop === "**" ? r2l : l2r); };
function locAt(text, newPos, _a) {
    var pos = _a.pos, line = _a.line, column = _a.column;
    while (pos < newPos) {
        var ch = text[pos++];
        if (ch === "\n") {
            column = 1;
            line++;
        }
        else {
            column++;
        }
    }
    return { pos: pos, line: line, column: column };
}
var markSeen = function ($) {
    if ($.pos > $.lastSeen.pos) {
        Object.assign($.lastSeen, locAt($.text, $.pos, $.lastSeen));
    }
};
function RegexToken(pattern) {
    return function ($) {
        markSeen($);
        var match = pattern.exec($.text.substring($.pos));
        if (!match) {
            return $;
        }
        var $next = __assign(__assign({}, $), { pos: $.pos + match[0].length });
        for (var i = 1; i < match.length; i++) {
            $.stack[$next.sp++] = match[i];
        }
        return $next;
    };
}
function StringToken(pattern) {
    return function ($) {
        markSeen($);
        if ($.text.startsWith(pattern, $.pos)) {
            return __assign(__assign({}, $), { pos: $.pos + pattern.length });
        }
        return $;
    };
}
function Use(rule) {
    if (typeof rule === "function") {
        return rule;
    }
    if (rule instanceof RegExp) {
        return RegexToken(rule);
    }
    if (typeof rule === "string") {
        return StringToken(rule);
    }
    throw new Error("Invalid rule");
}
function Ignore(toIgnore, rule) {
    rule = Use(rule);
    if (toIgnore) {
        toIgnore = Ignore(null, Plus(toIgnore));
    }
    return function ($) {
        var $cur = toIgnore ? toIgnore($) : $;
        $.ignore.push(toIgnore);
        var $next = rule($cur);
        $.ignore.pop();
        return $next === $cur ? $ : toIgnore ? toIgnore($next) : $next;
    };
}
var skipIgnored = function ($) {
    if (!$.ignore.length) {
        return $;
    }
    var toIgnore = $.ignore[$.ignore.length - 1];
    return toIgnore ? toIgnore($) : $;
};
function All() {
    var rules = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rules[_i] = arguments[_i];
    }
    rules = rules.map(Use);
    return function ($) {
        var $cur = $;
        for (var i = 0; i < rules.length; i++) {
            var $before = i > 0 ? skipIgnored($cur) : $cur;
            var $after = rules[i]($before);
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
function Any() {
    var rules = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rules[_i] = arguments[_i];
    }
    rules = rules.map(Use);
    return function ($) {
        for (var i = 0; i < rules.length; i++) {
            var $next = rules[i]($);
            if ($next !== $) {
                return $next;
            }
        }
        return $;
    };
}
function Plus(rule) {
    rule = Use(rule);
    return function ($) {
        while (true) {
            var $cur = skipIgnored($);
            var $next = rule($cur);
            if ($next === $cur) {
                return $;
            }
            $ = $next;
        }
    };
}
function Optional(rule) {
    rule = Use(rule);
    return function ($) {
        var $next = rule($);
        if ($next !== $) {
            return $next;
        }
        return __assign({}, $);
    };
}
function Node(rule, reducer) {
    rule = Use(rule);
    return function ($) {
        var $next = rule($);
        if ($next === $) {
            return $;
        }
        var node = reducer($.stack.slice($.sp, $next.sp), $, $next);
        $next.sp = $.sp;
        if (node !== null) {
            $.stack[$next.sp++] = node;
        }
        return $next;
    };
}
var Star = function (rule) { return Optional(Plus(rule)); };
var Y = function (proc) { return (function (x) { return proc(function (y) { return x(x)(y); }); })(function (x) { return proc(function (y) { return x(x)(y); }); }); };
var START = function (text, pos) {
    if (pos === void 0) { pos = 0; }
    return ({
        text: text,
        ignore: [],
        stack: [],
        sp: 0,
        lastSeen: locAt(text, pos, { pos: 0, line: 1, column: 1 }),
        pos: pos,
    });
};
function Parser(Grammar, pos, partial) {
    if (pos === void 0) { pos = 0; }
    if (partial === void 0) { partial = false; }
    return function (text) {
        if (typeof text !== "string") {
            throw new Error("Parsing function expects a string input");
        }
        var $ = START(text, pos);
        var $next = Grammar($);
        if ($ === $next || (!partial && $next.pos < text.length)) {
            throw new Error("Unexpected token at ".concat($.lastSeen.line, ":").concat($.lastSeen.column, ". Remainder: ").concat(text.slice($.lastSeen.pos)));
        }
        return $.stack[0];
    };
}
function l2r(parts, $) {
    var left = parts[0];
    for (var i = 1; i < parts.length; i += 2) {
        var _a = [parts[i].operator, parts[i + 1]], operator = _a[0], right = _a[1];
        left = srcMap({
            type: "BinaryExpression",
            left: left,
            operator: operator,
            right: right,
        }, $, { pos: right.pos + right.text.length });
    }
    return left;
}
function r2l(parts, _, $next) {
    var right = parts[parts.length - 1];
    for (var i = parts.length - 2; i >= 0; i -= 2) {
        var _a = [parts[i - 1], parts[i].operator], left = _a[0], operator = _a[1];
        right = srcMap({
            type: "BinaryExpression",
            left: left,
            operator: operator,
            right: right,
        }, { pos: left.pos }, $next);
    }
    return right;
}
var Operator = function (Rule) { return Node(Rule, function (_, $, $next) { return ({ $: $, operator: $.text.substring($.pos, $next.pos) }); }); };
var srcMap = function (obj, $, $next) {
    return Object.defineProperties(obj, {
        pos: { writable: true, configurable: true, value: $.pos },
        text: {
            writable: true,
            configurable: true,
            value: ($.text || $next.text).slice($.pos, $next.pos),
        },
    });
};
var DefaultGrammar = IgnoreWhitespace(Y(function (Expression) {
    var Identifier = Node(IdentifierToken, function (_a) {
        var name = _a[0];
        return ({ type: "Identifier", name: name });
    });
    var StringLiteral = Node(QuoteToken, function (_a) {
        var raw = _a[0];
        return ({
            type: "Literal",
            value: raw.slice(1, -1),
            raw: raw,
        });
    });
    var NumericLiteral = Node(NumericToken, function (_a) {
        var raw = _a[0];
        return ({ type: "Literal", value: +raw, raw: raw });
    });
    var NullLiteral = Node(NullToken, function (_a) {
        var raw = _a[0];
        return ({ type: "Literal", value: null, raw: raw });
    });
    var BooleanLiteral = Node(BooleanToken, function (_a) {
        var raw = _a[0];
        return ({
            type: "Literal",
            value: raw === "true",
            raw: raw,
        });
    });
    var Literal = Any(StringLiteral, NumericLiteral, NullLiteral, BooleanLiteral);
    var ArgumentsList = All(Expression, Star(All(",", Expression)));
    var Arguments = Node(All("(", Optional(All(ArgumentsList, Optional(","))), ")"), function (args) { return ({
        args: args,
    }); });
    var ArgumentsExpression = Node(Any(Arguments), function (_a, _, $next) {
        var part = _a[0];
        return ({ part: part, $next: $next });
    });
    var CompoundExpression = Node(All(Expression, Star(All(",", Expression))), function (leafs) {
        return leafs.length > 1 ? { type: "CompoundExpression", leafs: leafs } : leafs[0];
    });
    var PrimaryExpression = Node(Any(Literal, Identifier, All("(", CompoundExpression, ")")), function (_a, $, $next) {
        var expr = _a[0];
        return srcMap(expr, $, $next);
    });
    var CallExpression = Node(All(PrimaryExpression, Star(ArgumentsExpression)), function (parts, $, $last) {
        return parts.reduce(function (acc, _a) {
            var part = _a.part, $next = _a.$next;
            return srcMap({ type: "CallExpression", callee: acc, arguments: part.args }, $, $next);
        });
    });
    var UnaryOperator = Operator(Any("+", "-", "~", "!"));
    var UnaryExpression = Node(All(Star(UnaryOperator), CallExpression), function (parts, _, $next) {
        return parts.reduceRight(function (argument, _a) {
            var $ = _a.$, operator = _a.operator;
            return srcMap({ type: "UnaryExpression", argument: argument, operator: operator }, $, $next);
        });
    });
    var LogicalExpressionOrExpression = BinaryOperatorPrecedence.reduce(function (Expr, BinaryOp) { return Node(All(Expr, Star(All(Operator(BinaryOp), Expr))), associativity(BinaryOp)); }, UnaryExpression);
    var TernaryExpression = Node(All(LogicalExpressionOrExpression, Optional(All("?", Expression, ":", Expression))), function (_a) {
        var test = _a[0], consequent = _a[1], alternate = _a[2];
        return consequent ? { type: "TernaryExpression", test: test, consequent: consequent, alternate: alternate } : test;
    });
    return Node(Any(TernaryExpression), function (_a, $, $next) {
        var expr = _a[0];
        return srcMap(expr, $, $next);
    });
}));

export { CONSTS, STDLIB, createExprContext, evaluateExpr as default, evaluateExpr, executeAst, exprToIdentifier, parseExpr, toBoolean, toDecimal, toNumber, toString };
//# sourceMappingURL=index.mjs.map
