export declare type DictOf<T> = {
    [key: string]: T;
};
export declare type TExprScalar = number | string | boolean | null;
export declare type TExprFuncAsync = (ctx: TExprContext, scope: TScope, ...args: TExprScalar[]) => Promise<TExprScalar>;
export declare type TExprFuncSync = (ctx: TExprContext, scope: TScope, ...args: TExprScalar[]) => TExprScalar;
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
    result: TExprScalar;
    ctx: TExprContext;
};
export declare type TExprContext = {
    rng: () => number;
    funcs: DictOf<TExprFuncDef>;
    binops: DictOf<TBinopDef>;
    unops: DictOf<TUnopDef>;
    get: (scope: TScope, key: string) => Promise<TExprScalar>;
    set: (scope: TScope, key: string, value: TExprScalar) => Promise<void>;
    call?: ((ctx: TExprContext, scope: TScope, method: string, args: TExprScalar[]) => Promise<TExprScalar>) | undefined;
};
export declare type TScope = {
    [key: string]: TExprScalar;
};
export declare type TExpression = TCallExpression | TIdentifierExpression | TBinaryExpression | TLiteralExpression | TTernaryExpression | TUnaryExpression | TTemplateLiteralExpression;
export declare type TTemplateLiteralExpression = {
    type: 'TemplateLiteral';
    parts: [['chunks', string] | ['expression', TExpression]];
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
export declare type TTernaryExpression = {
    type: 'TernaryExpression';
    test: TExpression;
    consequent: TExpression;
    alternate: TExpression;
};
export declare type TUnaryExpression = {
    type: 'UnaryExpression';
    argument: TExpression;
    operator: string;
};
export declare const CONSTS: DictOf<TExprScalar>;
export declare function createExprContext({ funcs, binops, unops, seed, get, set, call, }: Partial<TExprContext> & {
    seed?: string;
}): TExprContext;
export declare function evaluateExpr(code: string, ctx?: TExprContext, scope?: TScope): Promise<TExprResult>;
export default evaluateExpr;
export declare function parseExpr(code: string): TExpression;
export declare function executeAst(ast: TExpression, ctx: TExprContext | undefined, scope: TScope): Promise<TExprScalar>;
export declare function exprToIdentifier(v: TExpression): string | null;
export declare function toNumber(v: any, fallback?: number): number;
export declare function toBoolean(v: TExprScalar): boolean;
export declare function toString(v: TExprScalar, radix?: number): string;
export declare function toScalar(n: any, radix?: number): TExprScalar;
export declare const STDLIB: DictOf<TExprFuncDef>;
export declare function clamp(n: number, min?: number, max?: number): number;
export declare function avg(nn: number[]): number;
export declare function sum(nn: number[]): number;
//# sourceMappingURL=index.d.ts.map