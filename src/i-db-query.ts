export type DbQueryOption<T> = Partial<{
    skip: number;
    take: number;
    where: T;
    order: string[];
    orderByDesc: string[];
}>;

export interface IDbQuery<T> {
    count(where?: any): Promise<number>;
    toArray(v?: DbQueryOption<any>): Promise<T[]>;
}