import { IDbRepository } from './i-db-repository';
import { IUnitOfWork } from './i-unit-of-work';

export class DbModel {
    readonly id: string;
}

export type DbOption = (dbFactory: DbFactoryBase, dbRepo: IDbRepository<DbModel>) => void;

export abstract class DbFactoryBase {
    public abstract db<T extends DbModel>(...opts: DbOption[]): IDbRepository<T>;
    public abstract uow(): IUnitOfWork;
}
