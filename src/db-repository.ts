import { DbModel, DbOption } from './db-factory-base';
import { IDbQuery } from './i-db-query';
import { IDbRepository } from './i-db-repository';
import { IUnitOfWork } from './i-unit-of-work';
import { IUnitOfWorkRepository } from './i-unit-of-work-repository';

export class AreaDbModel {
    public get id() {
        return this.entry.id;
    }

    public constructor(
        public areaNo: number,
        public entry: DbModel,
    ) { }
}

export function uowDbOption(uow: IUnitOfWork): DbOption {
    return (_, dbRepo) => {
        (dbRepo as DbRepository<DbModel>).isTx = true;
        (dbRepo as DbRepository<DbModel>).uow = uow as IUnitOfWorkRepository;
    };
}

export function areaDbOption(areaNo: number): DbOption {
    return (_, dbRepo) => {
        (dbRepo as DbRepository<DbModel>).areaNo = areaNo;
    };
}

export class DbRepository<T extends DbModel> implements IDbRepository<T> {
    public isTx: boolean;
    public areaNo: number;
    public model: string;
    public dbOptions: DbOption[];

    private m_CreateQueryFunc: () => IDbQuery<T>;
    public createQueryFunc(v: () => IDbQuery<T>) {
        this.m_CreateQueryFunc = v;
    }

    public constructor(
        public uow: IUnitOfWorkRepository,
    ) { }

    public async add(entry: T) {
        await this.exec(this.uow.registerAdd, entry);
    }

    public query() {
        return this.m_CreateQueryFunc();
    }

    public async remove(entry: T) {
        await this.exec(this.uow.registerRemove, entry);
    }

    public async save(entry: T) {
        await this.exec(this.uow.registerSave, entry);
    }

    private async exec(action: (model: string, entry: any) => void, entry: any) {
        if (this.areaNo)
            entry = new AreaDbModel(this.areaNo, entry);

        action.bind(this.uow)(this.model, entry);
        if (this.isTx)
            return;

        await this.uow.commit();
    }
}