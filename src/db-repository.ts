import { AreaDbModel } from './area-db-model';
import { DbModel, DbOption } from './db-factory-base';
import { IDbQuery } from './i-db-query';
import { IDbRepository } from './i-db-repository';
import { IUnitOfWork } from './i-unit-of-work';
import { IUnitOfWorkRepository } from './i-unit-of-work-repository';

type regiterAction = (model: string, entry: any) => void;

export function modelDbOption(model: any): DbOption {
    return (_, dbRepo) => {
        (dbRepo as DbRepository<DbModel>).model = typeof model == 'string' ? model : (model.ctor ?? model.name);
    };
}

export function uowDbOption(uow: IUnitOfWork): DbOption {
    return (_, dbRepo) => {
        (dbRepo as DbRepository<DbModel>).isTx = true;
        (dbRepo as DbRepository<DbModel>).uow = uow as IUnitOfWorkRepository;
    };
}

export class DbRepository<T extends DbModel> implements IDbRepository<T> {
    public uow: IUnitOfWork;
    public isTx: boolean;
    public areaNo: number;
    public model: string;
    public dbOptions: DbOption[];

    private m_CreateQueryFunc: () => IDbQuery<T>;
    public createQueryFunc(v: () => IDbQuery<T>) {
        this.m_CreateQueryFunc = v;
    }

    public constructor(
        private m_Uow: IUnitOfWorkRepository,
    ) { }

    public async add(entry: T) {
        await this.exec(this.m_Uow.registerAdd, entry);
    }

    public query() {
        return this.m_CreateQueryFunc();
    }

    public async remove(entry: T) {
        await this.exec(this.m_Uow.registerRemove, entry);
    }

    public async save(entry: T) {
        await this.exec(this.m_Uow.registerSave, entry);
    }

    private async exec(action: regiterAction, entry: any) {
        if (this.areaNo) {
            entry = {
                entry: entry,
                areaNo: this.areaNo
            } as AreaDbModel;
        }

        action.bind(this.m_Uow)(this.model, entry);
        if (this.isTx)
            return;

        await this.m_Uow.commit();
    }
}