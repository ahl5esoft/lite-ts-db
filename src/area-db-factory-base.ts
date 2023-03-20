import { DbFactoryBase } from './db-factory-base';

export abstract class AreaDbFactoryBase extends DbFactoryBase {
    /**
     * 获取区服数据库工厂
     * 
     * @param areaNo 区服编号
     */
    abstract getAreaDbFactory(areaNo: number): Promise<DbFactoryBase>;
}