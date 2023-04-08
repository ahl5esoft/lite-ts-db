import { AreaUnitOfWork } from './area-unit-of-work';
import { DbFactoryBase, DbModel, DbOption } from './db-factory-base';
import { DbRepository } from './db-repository';

export class AreaDbFactory extends DbFactoryBase {
    private m_AllDbFactory: Promise<{ [areaNo: number]: DbFactoryBase; }>;

    public constructor(
        private m_GlobalDbFactory: DbFactoryBase,
        private m_GetAllAreaFunc: () => Promise<{ [areaNo: number]: DbFactoryBase }>,
    ) {
        super();
    }

    public db<T extends DbModel>(...dbOptions: DbOption[]) {
        const dbRepository = new DbRepository<T>(
            this.uow(),
        );
        for (const r of dbOptions)
            r(this, dbRepository);

        dbRepository.dbOptions = dbOptions;
        return dbRepository;
    }

    public async getAreaDbFactory(areaNo: number) {
        this.m_AllDbFactory ??= new Promise<{ [areaNo: number]: DbFactoryBase; }>(async (s, f) => {
            try {
                const all = await this.m_GetAllAreaFunc();
                all[0] = this.m_GlobalDbFactory;
                s(all);
            } catch (ex) {
                this.m_AllDbFactory = null;
                f(ex);
            }
        });

        areaNo ??= 0;

        const all = await this.m_AllDbFactory;
        if (!all[areaNo])
            throw new Error(`${AreaDbFactory.name}: 缺少区服[${areaNo}]配置`);

        return all[areaNo];
    }

    public uow() {
        return new AreaUnitOfWork(this.m_GlobalDbFactory, this);
    }
}