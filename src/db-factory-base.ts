import { IDbRepository } from './i-db-repository';
import { IUnitOfWork } from './i-unit-of-work';

export class DbModel {
    readonly id: string;
}

export type DbOption = (dbRepo: IDbRepository<DbModel>) => void;

export abstract class DbFactoryBase {
    /**
     * 创建表数据仓储
     * 
     * @param model 表模型函数
     * @param extra 其他参数,工作单元或数据库类型
     * 
     * @example
     * ```typescript
     *  const dbFactory: DbFactoryBase;
     *  
     *  // 查询所有数据
     *  const rows = await dbFactory.db(IDbRepository<DbModel>).query().toArray();
     * 
     *  // 单个C:add U:save D:remove
     *  dbFactory.db(IDbRepository<DbModel>).add({
     *     id: '主键',
     *     // 其他字段 
     *  });
     * ```
     */
    public abstract db<T extends DbModel>(...opts: DbOption[]): IDbRepository<T>;

    /**
     * 创建工作单元(事务)
     * 
     * @example
     * ```typescript
     *  const dbFactory: DbFactoryBase;
     *  const uow = dbFactory.uow();
     *  dbFactory.db(IDbRepository<DbModel>).add(...);
     *  dbFactory.db(IDbRepository<DbModel>).save(...);
     *  dbFactory.db(IDbRepository<DbModel>).remove(...);
     *  ...
     *  await uow.commit();
     * ```
     */
    public abstract uow(): IUnitOfWork;
}
