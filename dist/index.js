/*!
 * expreval v0.0.0
 * (c) Matthew Trost
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var seedrandom = require('seedrandom');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var seedrandom__namespace = /*#__PURE__*/_interopNamespace(seedrandom);

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
var UNOP_MAP = {
    '+': { alias: 'number' },
    '-': { alias: 'negate' },
    '~': { alias: 'bitwiseNot' },
    '!': { alias: 'not' },
};
var IgnoreWhitespace = function (Rule) { return Ignore(/^\s+/, Rule); };
var QuoteToken = Any(/^('[^'\\]*(?:\\.[^'\\]*)*')/, /^("[^"\\]*(?:\\.[^"\\]*)*")/);
var NumericToken = Any(/^((?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:[eE][-+]?[0-9]+)?)\b/, /^(0[xX][0-9a-fA-F]+)\b/);
var NullToken = /^(null)\b/;
var BooleanToken = /^(true|false)\b/;
var IdentifierToken = /^([a-zA-Z_$][a-zA-Z0-9_$.]*)/;
var InterpolationChunkToken = /^((?:\$(?!{)|\\.|[^`$\\])+)/;
var BinaryOperatorPrecedence = [
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
var INVALID_IDENT_REGEX = /^__proto__|prototype|constructor$/;
function createExprContext(_a) {
    var _this = this;
    var funcs = _a.funcs, binops = _a.binops, unops = _a.unops, _b = _a.seed, seed = _b === void 0 ? 'expreval' : _b, get = _a.get, set = _a.set, call = _a.call;
    var vars = {};
    return {
        rng: seedrandom__namespace.default(seed),
        funcs: __assign(__assign({}, STDLIB), funcs),
        binops: __assign(__assign({}, BINOP_MAP), binops),
        unops: __assign(__assign({}, UNOP_MAP), unops),
        get: function (name) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (name.match(INVALID_IDENT_REGEX)) {
                            return [2 /*return*/, 0];
                        }
                        if (!get) return [3 /*break*/, 2];
                        return [4 /*yield*/, get(name)];
                    case 1: return [2 /*return*/, (_a = (_c.sent())) !== null && _a !== void 0 ? _a : null];
                    case 2: return [2 /*return*/, (_b = vars[name]) !== null && _b !== void 0 ? _b : null];
                }
            });
        }); },
        set: function (name, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (name.match(INVALID_IDENT_REGEX)) {
                            return [2 /*return*/];
                        }
                        if (!set) return [3 /*break*/, 2];
                        return [4 /*yield*/, set(name, value)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        vars[name] = value;
                        return [2 /*return*/];
                }
            });
        }); },
        call: call,
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
        var _b, value, fdef, args, left, right, _c, _d, _e, _f, _g, _h, _j, binop, result, unop, accum, i, _k, kind, value_1, _l;
        var _this = this;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _b = ast.type;
                    switch (_b) {
                        case 'Literal': return [3 /*break*/, 1];
                        case 'Identifier': return [3 /*break*/, 2];
                        case 'CallExpression': return [3 /*break*/, 4];
                        case 'BinaryExpression': return [3 /*break*/, 14];
                        case 'TernaryExpression': return [3 /*break*/, 15];
                        case 'UnaryExpression': return [3 /*break*/, 20];
                        case 'TemplateLiteral': return [3 /*break*/, 21];
                    }
                    return [3 /*break*/, 27];
                case 1: return [2 /*return*/, ast.value];
                case 2: return [4 /*yield*/, ctx.get(ast.name)];
                case 3:
                    value = _m.sent();
                    return [2 /*return*/, value !== undefined ? value : ast.name];
                case 4:
                    fdef = Object.keys(ctx.funcs).includes(ast.callee.name)
                        ? ctx.funcs[ast.callee.name]
                        : null;
                    args = [];
                    if (!(fdef && fdef.assignment && ast.arguments.length > 1)) return [3 /*break*/, 6];
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
                case 5:
                    _d.apply(_c, _e.concat([__spreadArray.apply(void 0, _f.concat([(_m.sent()), false]))]));
                    return [3 /*break*/, 8];
                case 6:
                    _h = (_g = args.push).apply;
                    _j = [args];
                    return [4 /*yield*/, asyncMap(ast.arguments, function (expr) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, executeAst(expr, ctx)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 7:
                    _h.apply(_g, _j.concat([(_m.sent())]));
                    _m.label = 8;
                case 8:
                    if (!fdef) return [3 /*break*/, 11];
                    if (!fdef.async) return [3 /*break*/, 10];
                    return [4 /*yield*/, fdef.f.apply(fdef, __spreadArray([ctx], args, false))];
                case 9: return [2 /*return*/, _m.sent()];
                case 10: return [2 /*return*/, fdef.f.apply(fdef, __spreadArray([ctx], args, false))];
                case 11:
                    if (!ctx.call) return [3 /*break*/, 13];
                    return [4 /*yield*/, ctx.call.apply(ctx, __spreadArray([ctx, ast.callee.name], args, false))];
                case 12: return [2 /*return*/, _m.sent()];
                case 13: throw new Error("Function not found: '".concat(ast.callee.name, "'"));
                case 14:
                    binop = Object.keys(ctx.binops).includes(ast.operator)
                        ? ctx.binops[ast.operator]
                        : null;
                    if (binop) {
                        return [2 /*return*/, executeAst({
                                type: 'CallExpression',
                                callee: {
                                    name: binop.alias,
                                    type: 'Identifier',
                                },
                                arguments: [ast.left, ast.right],
                            }, ctx)];
                    }
                    throw new Error("Operator not found: '".concat(ast.operator, "'"));
                case 15: return [4 /*yield*/, executeAst(ast.test, ctx)];
                case 16:
                    result = _m.sent();
                    if (!toBoolean(result)) return [3 /*break*/, 18];
                    return [4 /*yield*/, executeAst(ast.consequent, ctx)];
                case 17: return [2 /*return*/, _m.sent()];
                case 18: return [4 /*yield*/, executeAst(ast.alternate, ctx)];
                case 19: return [2 /*return*/, _m.sent()];
                case 20:
                    unop = Object.keys(ctx.unops).includes(ast.operator)
                        ? ctx.unops[ast.operator]
                        : null;
                    if (unop) {
                        return [2 /*return*/, executeAst({
                                type: 'CallExpression',
                                callee: {
                                    name: unop.alias,
                                    type: 'Identifier',
                                },
                                arguments: [ast.argument],
                            }, ctx)];
                    }
                    throw new Error("Operator not found: '".concat(ast.operator, "'"));
                case 21:
                    accum = '';
                    i = 0;
                    _m.label = 22;
                case 22:
                    if (!(i < ast.parts.length)) return [3 /*break*/, 26];
                    _k = ast.parts[i], kind = _k[0], value_1 = _k[1];
                    if (!(kind === 'chunks')) return [3 /*break*/, 23];
                    accum += value_1;
                    return [3 /*break*/, 25];
                case 23:
                    if (!(kind === 'expression')) return [3 /*break*/, 25];
                    _l = accum;
                    return [4 /*yield*/, executeAst(value_1, ctx)];
                case 24:
                    accum = _l + ((_m.sent()) + '');
                    _m.label = 25;
                case 25:
                    i++;
                    return [3 /*break*/, 22];
                case 26: return [2 /*return*/, accum];
                case 27: throw new Error("Syntax error");
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
function toBoolean(v) {
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
function toString(v, radix) {
    if (radix === void 0) { radix = 10; }
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
function toScalar(n, radix) {
    if (radix === void 0) { radix = 10; }
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
    return __awaiter(this, void 0, void 0, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = toString(name);
                    return [4 /*yield*/, ctx.set(key, value)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, value];
            }
        });
    });
}
function getVar(ctx, name) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ctx.get(name + '')];
                case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
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
        },
    },
    present: {
        f: function (ctx, v) {
            return !!v;
        },
    },
    empty: {
        f: function (ctx, v) {
            return !v;
        },
    },
    blank: {
        f: function (ctx, v) {
            if (typeof v === 'string' && (!v || v.match(/^\s+$/))) {
                return true;
            }
            return !v;
        },
    },
    join: {
        f: function (ctx, spacer) {
            var ss = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                ss[_i - 2] = arguments[_i];
            }
            return ss.join(toString(spacer));
        },
    },
    setVar: {
        assignment: true,
        async: true,
        f: function (ctx, left, right) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setVar(ctx, left, right)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
    },
    setAdd: {
        assignment: true,
        async: true,
        f: function (ctx, left, right) {
            return __awaiter(this, void 0, void 0, function () {
                var lval;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getVar(ctx, left)];
                        case 1:
                            lval = _a.sent();
                            if (!(typeof lval === 'string')) return [3 /*break*/, 3];
                            return [4 /*yield*/, setVar(ctx, left, lval + right + '')];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3: return [4 /*yield*/, setVar(ctx, left, toNumber(lval) + toNumber(right))];
                        case 4: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
    },
    setSub: {
        assignment: true,
        async: true,
        f: function (ctx, left, right) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = setVar;
                            _b = [ctx,
                                left];
                            _c = toNumber;
                            return [4 /*yield*/, getVar(ctx, left)];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.apply(void 0, [_d.sent()]) - toNumber(right)]))];
                        case 2: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        },
    },
    setMul: {
        assignment: true,
        async: true,
        f: function (ctx, left, right) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = setVar;
                            _b = [ctx,
                                left];
                            _c = toNumber;
                            return [4 /*yield*/, getVar(ctx, left)];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.apply(void 0, [_d.sent()]) * toNumber(right)]))];
                        case 2: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        },
    },
    setDiv: {
        assignment: true,
        async: true,
        f: function (ctx, left, right) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = setVar;
                            _b = [ctx,
                                left];
                            _c = toNumber;
                            return [4 /*yield*/, getVar(ctx, left)];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.apply(void 0, [_d.sent()]) / toNumber(right)]))];
                        case 2: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        },
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
            return !!(_a = STDLIB['any']).f.apply(_a, __spreadArray([ctx], xs, false));
        },
    },
    none: {
        f: function (ctx) {
            var _a;
            var xs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                xs[_i - 1] = arguments[_i];
            }
            return !(_a = STDLIB['any']).f.apply(_a, __spreadArray([ctx], xs, false));
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
            return toNumber(a) > toNumber(b);
        },
    },
    gte: {
        f: function (ctx, a, b) {
            return toNumber(a) > toNumber(b);
        },
    },
    lt: {
        f: function (ctx, a, b) {
            return toNumber(a) > toNumber(b);
        },
    },
    lte: {
        f: function (ctx, a, b) {
            return toNumber(a) > toNumber(b);
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
            return -toNumber(a);
        },
    },
    add: {
        f: function (ctx, a, b) {
            if (typeof a === 'string') {
                return a + b + '';
            }
            return toNumber(a) + toNumber(b);
        },
    },
    sub: {
        f: function (ctx, a, b) {
            return toNumber(a) - toNumber(b);
        },
    },
    div: {
        f: function (ctx, a, b) {
            return toNumber(a) / toNumber(b);
        },
    },
    mul: {
        f: function (ctx, a, b) {
            return toNumber(a) * toNumber(b);
        },
    },
    mod: {
        f: function (ctx, a, b) {
            return toNumber(a) % toNumber(b);
        },
    },
    pow: {
        f: function (ctx, a, b) {
            return Math.pow(toNumber(a), toNumber(b));
        },
    },
    abs: {
        f: function (ctx, a) {
            return Math.abs(toNumber(a));
        },
    },
    acos: {
        f: function (ctx, a) {
            return Math.acos(toNumber(a));
        },
    },
    acosh: {
        f: function (ctx, a) {
            return Math.acosh(toNumber(a));
        },
    },
    asin: {
        f: function (ctx, a) {
            return Math.asin(toNumber(a));
        },
    },
    asinh: {
        f: function (ctx, a) {
            return Math.asinh(toNumber(a));
        },
    },
    atan: {
        f: function (ctx, a) {
            return Math.atan(toNumber(a));
        },
    },
    atan2: {
        f: function (ctx, a, b) {
            return Math.atan2(toNumber(a), toNumber(b));
        },
    },
    atanh: {
        f: function (ctx, a) {
            return Math.atanh(toNumber(a));
        },
    },
    cbrt: {
        f: function (ctx, a) {
            return Math.cbrt(toNumber(a));
        },
    },
    ceil: {
        f: function (ctx, a) {
            return Math.ceil(toNumber(a));
        },
    },
    cos: {
        f: function (ctx, a) {
            return Math.cos(toNumber(a));
        },
    },
    cosh: {
        f: function (ctx, a) {
            return Math.cosh(toNumber(a));
        },
    },
    exp: {
        f: function (ctx, a) {
            return Math.exp(toNumber(a));
        },
    },
    floor: {
        f: function (ctx, a) {
            return Math.floor(toNumber(a));
        },
    },
    hypot: {
        f: function (ctx, a) {
            return Math.hypot(toNumber(a));
        },
    },
    log: {
        f: function (ctx, a) {
            return Math.log(toNumber(a));
        },
    },
    log10: {
        f: function (ctx, a) {
            return Math.log10(toNumber(a));
        },
    },
    log2: {
        f: function (ctx, a) {
            return Math.log2(toNumber(a));
        },
    },
    max: {
        f: function (ctx, a) {
            return Math.max(toNumber(a));
        },
    },
    min: {
        f: function (ctx, a) {
            return Math.min(toNumber(a));
        },
    },
    round: {
        f: function (ctx, a) {
            return Math.round(toNumber(a));
        },
    },
    sign: {
        f: function (ctx, a) {
            return Math.sign(toNumber(a));
        },
    },
    sin: {
        f: function (ctx, a) {
            return Math.sin(toNumber(a));
        },
    },
    sinh: {
        f: function (ctx, a) {
            return Math.sinh(toNumber(a));
        },
    },
    sqrt: {
        f: function (ctx, a) {
            return Math.sqrt(toNumber(a));
        },
    },
    tan: {
        f: function (ctx, a) {
            return Math.tan(toNumber(a));
        },
    },
    tanh: {
        f: function (ctx, a) {
            return Math.tanh(toNumber(a));
        },
    },
    trunc: {
        f: function (ctx, a) {
            return Math.trunc(toNumber(a));
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
            return ''.concat.apply('', ss.map(function (s) { return toString(s); }));
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
            return toString(a).padEnd(Number(b), toString(c !== null && c !== void 0 ? c : ''));
        },
    },
    padStart: {
        f: function (ctx, a, b, c) {
            return toString(a).padStart(Number(b), toString(c !== null && c !== void 0 ? c : ''));
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
var associativity = function (binop) { return (binop === '**' ? r2l : l2r); };
function locAt(text, newPos, _a) {
    var pos = _a.pos, line = _a.line, column = _a.column;
    while (pos < newPos) {
        var ch = text[pos++];
        if (ch === '\n') {
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
        if (typeof text !== 'string') {
            throw new Error('Parsing function expects a string input');
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
            type: 'BinaryExpression',
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
            type: 'BinaryExpression',
            left: left,
            operator: operator,
            right: right,
        }, { pos: left.pos }, $next);
    }
    return right;
}
var Operator = function (Rule) {
    return Node(Rule, function (_, $, $next) { return ({
        $: $,
        operator: $.text.substring($.pos, $next.pos),
    }); });
};
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
        return ({
            type: 'Identifier',
            name: name,
        });
    });
    var StringLiteral = Node(QuoteToken, function (_a) {
        var raw = _a[0];
        return ({
            type: 'Literal',
            value: raw.slice(1, -1),
            raw: raw,
        });
    });
    var NumericLiteral = Node(NumericToken, function (_a) {
        var raw = _a[0];
        return ({
            type: 'Literal',
            value: +raw,
            raw: raw,
        });
    });
    var NullLiteral = Node(NullToken, function (_a) {
        var raw = _a[0];
        return ({
            type: 'Literal',
            value: null,
            raw: raw,
        });
    });
    var BooleanLiteral = Node(BooleanToken, function (_a) {
        var raw = _a[0];
        return ({
            type: 'Literal',
            value: raw === 'true',
            raw: raw,
        });
    });
    var InterpolationChunk = Node(InterpolationChunkToken, function (_a) {
        var raw = _a[0];
        return [
            'chunks',
            raw,
        ];
    });
    var TemplateInlineExpression = Node(All('${', IgnoreWhitespace(Expression), '}'), function (_a) {
        var expression = _a[0];
        return ['expression', expression];
    });
    var TemplateLiteral = Node(Ignore(null, All('`', Star(Any(InterpolationChunk, TemplateInlineExpression)), '`')), function (parts) { return ({ type: 'TemplateLiteral', parts: parts }); });
    var Literal = Any(StringLiteral, NumericLiteral, NullLiteral, BooleanLiteral, TemplateLiteral);
    var ArgumentsList = All(Expression, Star(All(',', Expression)));
    var Arguments = Node(All('(', Optional(All(ArgumentsList, Optional(','))), ')'), function (args) { return ({
        args: args,
    }); });
    var ArgumentsExpression = Node(Any(Arguments), function (_a, _, $next) {
        var part = _a[0];
        return ({
            part: part,
            $next: $next,
        });
    });
    var CompoundExpression = Node(All(Expression, Star(All(',', Expression))), function (leafs) {
        return leafs.length > 1 ? { type: 'CompoundExpression', leafs: leafs } : leafs[0];
    });
    var PrimaryExpression = Node(Any(Literal, Identifier, All('(', CompoundExpression, ')')), function (_a, $, $next) {
        var expr = _a[0];
        return srcMap(expr, $, $next);
    });
    var CallExpression = Node(All(PrimaryExpression, Star(ArgumentsExpression)), function (parts, $, $last) {
        return parts.reduce(function (acc, _a) {
            var part = _a.part, $next = _a.$next;
            return srcMap({ type: 'CallExpression', callee: acc, arguments: part.args }, $, $next);
        });
    });
    var UnaryOperator = Operator(Any('+', '-', '~', '!'));
    var UnaryExpression = Node(All(Star(UnaryOperator), CallExpression), function (parts, _, $next) {
        return parts.reduceRight(function (argument, _a) {
            var $ = _a.$, operator = _a.operator;
            return srcMap({ type: 'UnaryExpression', argument: argument, operator: operator }, $, $next);
        });
    });
    var LogicalExpressionOrExpression = BinaryOperatorPrecedence.reduce(function (Expr, BinaryOp) {
        return Node(All(Expr, Star(All(Operator(BinaryOp), Expr))), associativity(BinaryOp));
    }, UnaryExpression);
    var TernaryExpression = Node(All(LogicalExpressionOrExpression, Optional(All('?', Expression, ':', Expression))), function (_a) {
        var test = _a[0], consequent = _a[1], alternate = _a[2];
        return consequent
            ? { type: 'TernaryExpression', test: test, consequent: consequent, alternate: alternate }
            : test;
    });
    return Node(Any(TernaryExpression), function (_a, $, $next) {
        var expr = _a[0];
        return srcMap(expr, $, $next);
    });
}));

exports.CONSTS = CONSTS;
exports.STDLIB = STDLIB;
exports.createExprContext = createExprContext;
exports["default"] = evaluateExpr;
exports.evaluateExpr = evaluateExpr;
exports.executeAst = executeAst;
exports.exprToIdentifier = exprToIdentifier;
exports.parseExpr = parseExpr;
exports.toBoolean = toBoolean;
exports.toNumber = toNumber;
exports.toScalar = toScalar;
exports.toString = toString;
//# sourceMappingURL=index.js.map
