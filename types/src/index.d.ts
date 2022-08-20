import { z } from 'zod';
export declare type DictOf<T> = {
    [key: string]: T;
};
export declare const ZExprScalar: z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean, z.ZodNull]>;
export declare type TExprScalar = z.infer<typeof ZExprScalar>;
export declare const ZExprArray: any;
export declare type TExprArray = z.infer<typeof ZExprArray>;
export declare const ZExprObject: any;
export declare type TExprObject = z.infer<typeof ZExprObject>;
export declare const ZExprValue: any;
export declare type TExprValue = z.infer<typeof ZExprValue>;
export declare type TExprFuncAsync = (ctx: TExprContext, scope: TScope, ...args: TExprValue[]) => Promise<TExprValue>;
export declare type TExprFuncSync = (ctx: TExprContext, scope: TScope, ...args: TExprValue[]) => TExprValue;
export declare type TExprFuncDef = {
    assignment?: true;
    lazy?: true;
    macro?: true;
} & ({
    async: true;
    f: TExprFuncAsync;
} | {
    async?: false;
    f: TExprFuncSync;
});
export declare type TBinopDef = {
    alias: string;
};
export declare type TUnopDef = {
    alias: string;
};
export declare type TExprResult = {
    result: TExprValue;
    ctx: TExprContext;
};
export declare type TExprContext = {
    rng: () => number;
    funcs: DictOf<TExprFuncDef>;
    binops: DictOf<TBinopDef>;
    unops: DictOf<TUnopDef>;
    get: (scope: TScope, key: string) => Promise<TExprValue>;
    set: (scope: TScope, key: string, value: TExprValue) => Promise<void>;
    call?: ((ctx: TExprContext, scope: TScope, method: string, args: TExprValue[]) => Promise<TExprValue>) | undefined;
};
export declare type TScope = {
    [key: string]: TExprValue;
};
export declare type TExpression = TCallExpression | TIdentifierExpression | TBinaryExpression | TLiteralExpression | TConditionalExpression | TUnaryExpression | TTemplateLiteralExpression | TArrayLiteralExpression | TObjectLiteralExpression | TComputedPropertyExpression;
export declare type TTemplateLiteralExpression = {
    type: 'TemplateLiteral';
    parts: [['chunks', string] | ['expression', TExpression]];
};
export declare type TComputedPropertyExpression = {
    type: 'ComputedProperty';
    expression: TExpression;
};
export declare type TArrayLiteralExpression = {
    type: 'ArrayLiteral';
    elements: TExpression[];
};
export declare type TObjectLiteralExpression = {
    type: 'ObjectLiteral';
    properties: {
        name: TIdentifierExpression | TLiteralExpression | TComputedPropertyExpression;
        value: TExpression | undefined;
    }[];
};
export declare type TCallExpression = {
    type: 'CallExpression';
    callee: TIdentifierExpression;
    arguments: TExpression[];
};
export declare type TIdentifierExpression = {
    type: 'Identifier';
    name: string;
};
export declare type TBinaryExpression = {
    type: 'BinaryExpression';
    left: TExpression;
    operator: string;
    right: TExpression;
};
export declare type TLiteralExpression = {
    type: 'Literal';
    value: string;
    raw: string;
};
export declare type TConditionalExpression = {
    type: 'ConditionalExpression';
    test: TExpression;
    consequent: TExpression;
    alternate: TExpression | undefined;
};
export declare type TUnaryExpression = {
    type: 'UnaryExpression';
    argument: TExpression;
    operator: string;
};
export declare const CONSTS: DictOf<TExprValue>;
export declare function createExprContext({ funcs, binops, unops, seed, get, set, call, }: Partial<TExprContext> & {
    seed?: string;
}): TExprContext;
export declare function evaluateExpr(code: string, ctx?: TExprContext, scope?: TScope): Promise<TExprResult>;
export default evaluateExpr;
export declare function parseExpr(code: string): TExpression;
export declare function executeAst(ast: TExpression, ctx: TExprContext | undefined, scope: TScope): Promise<TExprValue>;
export declare function exprToIdentifier(v: TExpression): string | null;
export declare function toNumber(v: any, fallback?: number): number;
export declare function toBoolean(v: TExprValue): boolean;
export declare function toString(v: any, radix?: number): string;
export declare function toObject(v: any): TExprObject;
export declare function toArray(v: any): TExprArray;
export declare function toScalar(n: any, radix?: number): TExprScalar;
export declare function asyncMap<V, T>(array: V[], callback: (el: V, idx: number, arr: V[]) => Promise<T>): Promise<T[]>;
export declare const STDLIB: DictOf<TExprFuncDef>;
export declare function clamp(n: number, min?: number, max?: number): number;
export declare function avg(nn: number[]): number;
export declare function sum(nn: number[]): number;
//# sourceMappingURL=index.d.ts.map