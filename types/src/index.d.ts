import Decimal from 'decimal.js';
export declare type DictOf<T> = {
    [key: string]: T;
};
export declare type TExprScalar = number | string | boolean | null;
export declare type TExprFuncAsync = (ctx: TExprContext, ...args: TExprScalar[]) => Promise<TExprScalar>;
export declare type TExprFuncSync = (ctx: TExprContext, ...args: TExprScalar[]) => TExprScalar;
export declare type TExprFuncDef = {
    assignment?: true;
    lazy?: true;
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
    result: TExprScalar;
    ctx: TExprContext;
};
export declare type TExprContext = {
    rng: () => number;
    funcs: DictOf<TExprFuncDef>;
    vars: DictOf<TExprScalar>;
    binops: DictOf<TBinopDef>;
    unops: DictOf<TUnopDef>;
};
export declare type TExpression = TCallExpression | TIdentifierExpression | TBinaryExpression | TLiteralExpression | TTernaryExpression | TUnaryExpression;
export declare type TCallExpression = {
    type: "CallExpression";
    callee: TIdentifierExpression;
    arguments: TExpression[];
};
export declare type TIdentifierExpression = {
    type: "Identifier";
    name: string;
};
export declare type TBinaryExpression = {
    type: "BinaryExpression";
    left: TExpression;
    operator: string;
    right: TExpression;
};
export declare type TLiteralExpression = {
    type: "Literal";
    value: string;
    raw: string;
};
export declare type TTernaryExpression = {
    type: "TernaryExpression";
    test: TExpression;
    consequent: TExpression;
    alternate: TExpression;
};
export declare type TUnaryExpression = {
    type: "UnaryExpression";
    argument: TExpression;
    operator: string;
};
export declare const CONSTS: DictOf<TExprScalar>;
export declare function createExprContext({ funcs, vars, binops, unops, seed, }: {
    funcs?: DictOf<TExprFuncDef>;
    vars?: DictOf<TExprScalar>;
    binops?: DictOf<string>;
    unops?: DictOf<string>;
    seed?: string;
}): TExprContext;
export declare function evaluateExpr(code: string, ctx?: TExprContext): Promise<TExprResult>;
export default evaluateExpr;
export declare function parseExpr(code: string): TExpression;
export declare function executeAst(ast: TExpression, ctx?: TExprContext): Promise<TExprScalar>;
export declare function exprToIdentifier(v: TExpression): string | null;
export declare function toNumber(v: any, fallback?: number): number;
export declare function toBoolean(v: TExprScalar): boolean;
export declare function toString(v: TExprScalar, radix?: number): string;
export declare function toDecimal(n: TExprScalar): Decimal;
export declare const STDLIB: DictOf<TExprFuncDef>;
//# sourceMappingURL=index.d.ts.map