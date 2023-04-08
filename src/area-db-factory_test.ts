import { strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { AreaDbFactory as Self } from './area-db-factory';
import { DbFactoryBase } from './db-factory-base';

describe('src/area-db-factory.ts', () => {
    describe('.getAreaDbFactory(areaNo: number)', () => {
        it('0', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual, async () => {
                return {};
            });

            const res = await self.getAreaDbFactory(0);
            strictEqual(res, mockDbFactory.actual);
        });

        it('1', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(null, async () => {
                return {
                    1: mockDbFactory.actual
                };
            });

            const res = await self.getAreaDbFactory(1);
            strictEqual(res, mockDbFactory.actual);
        });
    });
});