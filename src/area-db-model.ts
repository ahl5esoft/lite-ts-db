import { DbModel } from './db-factory-base';

export class AreaDbModel {
    public areaNo: number;
    public entry: DbModel;

    public get id() {
        return this.entry.id;
    }
}