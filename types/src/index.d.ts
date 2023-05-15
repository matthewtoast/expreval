import { z } from 'zod';
export type DictOf<T> = {
    [key: string]: T;
};
export declare const ZExprScalar: z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean, z.ZodNull]>;
export type TExprScalar = number | string | boolean | null;
export type TExprArray = TExprValue[];
export type TExprObject = {
    [key: string]: TExprValue;
};
export type TExprValue = TExprScalar | TExprObject | TExprArray;
export type TExprFuncSync = (ctx: TExprContext, scope: TScope, ...args: TExprValue[]) => TExprValue;
export type TExprFuncAsync = (ctx: TExprContext, scope: TScope, ...args: TExprValue[]) => Promise<TExprValue>;
export type TExprFuncLazy = (ctx: TExprContext, scope: TScope, ...args: TExpression[]) => TExprValue;
export type TExprFuncDef = {
    assignment?: true;
    lazy?: undefined;
    f: TExprFuncAsync;
} | {
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
    get: (scope: TScope, key: string) => Promise<TExprValue>;
    set: (scope: TScope, key: string, value: TExprValue) => Promise<void>;
    call?: ((ctx: TExprContext, scope: TScope, method: string, args: TExprValue[]) => Promise<TExprValue>) | undefined;
    lazy?: ((ctx: TExprContext, scope: TScope, method: string, args: TExpression[]) => Promise<TExprValue>) | undefined;
};
export type TScope = {
    [key: string]: TExprValue;
};
export type TExpression = TCallExpression | TIdentifierExpression | TBinaryExpression | TLiteralExpression | TConditionalExpression | TUnaryExpression | TTemplateLiteralExpression | TArrayLiteralExpression | TObjectLiteralExpression | TComputedPropertyExpression | TArrowFunctionExpression;
export type TTemplateLiteralPart = ['chunks', string] | ['expression', TExpression];
export type TTemplateLiteralExpression = {
    type: 'TemplateLiteral';
    parts: TTemplateLiteralPart[];
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
        name: TExpression;
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
    alternate: TExpression;
};
export type TUnaryExpression = {
    type: 'UnaryExpression';
    argument: TExpression;
    operator: string;
};
export type TArrowFunctionExpression = {
    type: 'ArrowFunction';
    parameters: {
        type: 'BoundName';
        name: string;
    }[];
    result: TExpression;
};
export declare const CONSTS: DictOf<TExprValue>;
export declare function createExprContext({ funcs, binops, unops, seed, get, set, call, }: Partial<TExprContext> & {
    seed?: string;
}): TExprContext;
export type TExpressionCache = {
    [key: string]: TExpression;
};
export declare function evaluateExpr(code: string, ctx?: TExprContext, scope?: TScope, cache?: TExpressionCache): Promise<TExprResult>;
export default evaluateExpr;
export declare function parseExpr(code: string, cache: TExpressionCache, parser?: (text: string) => TExpression): TExpression;
export declare function remapAst(ast: TExpression, res: (ast: TExpression) => TExpression): TExpression;
export declare function genCode(ast: TExpression, res?: (ident: string) => string): string;
export declare function rewriteCode(code: string, res: (ident: string) => string, cache: TExpressionCache): string;
export declare function executeAst(ast: TExpression, ctx: TExprContext | undefined, scope: TScope): Promise<TExprValue>;
export declare function exprToIdentifier(v: TExpression): string | null;
export declare function toNumber(v: any, fallback?: number): number;
export declare function toBoolean(v: TExprValue): boolean;
export declare function toString(v: any): string;
export declare function toObject(v: any): TExprObject;
export declare function toArray(v: any): TExprArray;
export declare function toScalar(n: any, radix?: number): TExprScalar;
export declare const STDLIB: DictOf<TExprFuncDef>;
export declare const DEFAULT_PARSER: (text: string) => TExpression;
export declare function clamp(n: number, min?: number, max?: number): number;
export declare function avg(nn: number[]): number;
export declare function sum(nn: number[]): number;
export declare function isNumeric(a: any): boolean;
//# sourceMappingURL=index.d.ts.map