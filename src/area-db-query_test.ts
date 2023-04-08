import { strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { AreaDbQuery as Self } from './area-db-query';
import { AreaDbFactory } from './area-db-factory';
import { DbFactoryBase } from './db-factory-base';
import { DbRepository } from './db-repository';
import { IDbQuery } from './i-db-query';

describe('src/area-db-query.ts', () => {
    describe('.count(where?: any)', () => {
        it('ok', async () => {
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockAreaDbFactory.actual, 1, []);

            const mockDbFactory = new Mock<DbFactoryBase>();
            mockAreaDbFactory.expectReturn(
                r => r.getAreaDbFactory(1),
                mockDbFactory.actual
            );

            const mockDbRepo = new Mock<DbRepository<any>>();
            mockDbFactory.expectReturn(
                r => r.db(),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<any>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.count('where'),
                11
            );

            const res = await self.count('where');
            strictEqual(res, 11);
        });
    });

    describe('.toArray(v?: DbQueryOption<any>)', () => {
        it('ok', async () => {
            const mockAreaDbFactory = new Mock<AreaDbFactory>();
            const self = new Self(mockAreaDbFactory.actual, 1, []);

            const mockDbFactory = new Mock<DbFactoryBase>();
            mockAreaDbFactory.expectReturn(
                r => r.getAreaDbFactory(1),
                mockDbFactory.actual
            );

            const mockDbRepo = new Mock<DbRepository<any>>();
            mockDbFactory.expectReturn(
                r => r.db(),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<any>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.toArray({
                    where: 'where'
                }),
                11
            );

            const res = await self.toArray({
                where: 'where'
            });
            strictEqual(res, 11);
        });
    });
});