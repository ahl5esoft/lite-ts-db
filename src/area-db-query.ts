import { AreaDbFactory } from './area-db-factory';
import { DbModel, DbOption } from './db-factory-base';
import { IDbQuery, DbQueryOption } from './i-db-query';

export class AreaDbQuery<T extends DbModel> implements IDbQuery<T> {
    public constructor(
        private m_DbFactory: AreaDbFactory,
        private m_AreaNo: number,
        private m_DbOptions: DbOption[],
    ) { }

    public async count(where?: any) {
        const dbFactory = await this.m_DbFactory.getAreaDbFactory(this.m_AreaNo);
        return await dbFactory.db<T>(...this.m_DbOptions).query().count(where);
    }

    public async toArray(v?: DbQueryOption<any>) {
        const dbFactory = await this.m_DbFactory.getAreaDbFactory(this.m_AreaNo);
        return await dbFactory.db<T>(...this.m_DbOptions).query().toArray(v);
    }
}
