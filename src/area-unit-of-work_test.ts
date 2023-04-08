import { notStrictEqual, strictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';

import { AreaDbFactory } from './area-db-factory';
import { AreaUnitOfWork as Self } from './area-unit-of-work';
import { DbFactoryBase, DbModel } from './db-factory-base';
import { AreaDbModel } from './db-repository';
import { IUnitOfWorkRepository } from './i-unit-of-work-repository';

class TestModel extends DbModel { }

describe('src/area-unit-of-work.ts', () => {
    after(async () => { });

    before(async () => { });

    describe('.commit()', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockDbFactory.actual, mockAreaDbFactory.actual);

            self.registerAdd(TestModel.name, new AreaDbModel(1, {
                id: '1',
            }));

            const mockOtherDbFactory = new Mock<DbFactoryBase>();
            mockAreaDbFactory.expectReturn(
                r => r.getAreaDbFactory(1),
                mockOtherDbFactory.actual
            );

            let commitCount = 0;
            const uowMock = new Mock<IUnitOfWorkRepository>({
                async commit() {
                    commitCount++;
                }
            });
            mockOtherDbFactory.expectReturn(
                r => r.uow(),
                uowMock.actual
            );

            uowMock.expectReturn(
                r => r.registerAdd(TestModel.name, mockAny),
                null,
            );

            await self.commit();

            strictEqual(commitCount, 1);
        });
    });

    describe('.registerAdd(model: Function, entry: AreaDbModel)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockDbFactory.actual, mockAreaDbFactory.actual);

            self.registerAdd(TestModel.name, new AreaDbModel(1, {
                id: '1',
            }));

            const bulks = Reflect.get(self, 'm_Bulk');
            notStrictEqual(bulks, undefined);
            strictEqual(bulks[1].length, 1);
        });

        it('no areaNo', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockDbFactory.actual, mockAreaDbFactory.actual);

            self.registerAdd(TestModel.name, {
                id: '1',
            } as AreaDbModel);

            const bulks = Reflect.get(self, 'm_Bulk');
            notStrictEqual(bulks, undefined);
            strictEqual(bulks[0].length, 1);
        });
    });

    describe('.registerAfter(action: () => Promise<void>, key?: string)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockDbFactory.actual, mockAreaDbFactory.actual);

            const action = async () => {
                console.log(1);
            };
            self.registerAfter(action);

            const afterActions = Reflect.get(self, 'm_AfterAction');
            strictEqual(afterActions['key-0'], action);
        });
    });

    describe('.registerRemove(model: Function, entry: AreaDbModel)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockDbFactory.actual, mockAreaDbFactory.actual);

            self.registerRemove(TestModel.name, new AreaDbModel(1, {
                id: '1',
            }));

            const bulks = Reflect.get(self, 'm_Bulk');
            notStrictEqual(bulks, undefined);
            strictEqual(bulks[1].length, 1);
        });

        it('no areaNo', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockDbFactory.actual, mockAreaDbFactory.actual);

            self.registerRemove(TestModel.name, {
                id: '1',
            } as AreaDbModel);

            const bulks = Reflect.get(self, 'm_Bulk');
            notStrictEqual(bulks, undefined);
            strictEqual(bulks[0].length, 1);
        });
    });

    describe('.registerSave(model: Function, entry: AreaDbModel)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockDbFactory.actual, mockAreaDbFactory.actual);

            self.registerSave(TestModel.name, new AreaDbModel(1, {
                id: '1',
            }));

            const bulks = Reflect.get(self, 'm_Bulk');
            notStrictEqual(bulks, undefined);
            strictEqual(bulks[1].length, 1);
        });

        it('no areaNo', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockDbFactory.actual, mockAreaDbFactory.actual);

            self.registerSave(TestModel.name, {
                id: '1',
            } as AreaDbModel);

            const bulks = Reflect.get(self, 'm_Bulk');
            notStrictEqual(bulks, undefined);
            strictEqual(bulks[0].length, 1);
        });
    });
});