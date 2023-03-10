import { DbModel, DbOption } from './db-factory-base';
import { IDbQuery } from './i-db-query';
import { IDbRepository } from './i-db-repository';
import { IUnitOfWork } from './i-unit-of-work';
import { IUnitOfWorkRepository } from './i-unit-of-work-repository';

export function modelDbOption(model: any): DbOption {
    return dbRepo => {
        (dbRepo as DbRepository<DbModel>).model = typeof model == 'string' ? model : (model.ctor ?? model.name);
    };
}

export function uowDbOption(uow: IUnitOfWork): DbOption {
    return dbRepo => {
        (dbRepo as DbRepository<DbModel>).uow = uow as IUnitOfWorkRepository;
    };
}

export class DbRepository<T extends DbModel> implements IDbRepository<T> {
    private m_IsTx: boolean;

    public areaNo: number;
    public dbOptions: DbOption[];

    public set uow(v: IUnitOfWorkRepository) {
        this.m_IsTx = true;
        this.m_Uow = v;
    }

    private m_Model: string;
    public set model(v: string) {
        this.m_Model = v;
    }

    private m_CreateQueryFunc: () => IDbQuery<T>;
    public createQueryFunc(v: () => IDbQuery<T>) {
        this.m_CreateQueryFunc = v;
    }

    public constructor(
        private m_Uow: IUnitOfWorkRepository,
    ) { }

    public async add(entry: T) {
        this.m_Uow.registerAdd(this.m_Model, entry);
        if (this.m_IsTx)
            return;

        await this.m_Uow.commit();
    }

    public query() {
        return this.m_CreateQueryFunc();
    }

    public async remove(entry: T) {
        this.m_Uow.registerRemove(this.m_Model, entry);
        if (this.m_IsTx)
            return;

        await this.m_Uow.commit();
    }

    public async save(entry: T) {
        this.m_Uow.registerSave(this.m_Model, entry);
        if (this.m_IsTx)
            return;

        await this.m_Uow.commit();
    }
}