import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { uowDbOption } from './db-repository';
import { IUnitOfWork } from './i-unit-of-work';

describe('src/db-repository.ts', () => {
    describe('uowDbOption(uow: IUnitOfWork): DbOption', () => {
        it('uow is null', () => {
            const dbRepo = {} as any;
            uowDbOption(null)(null, dbRepo);
            deepStrictEqual(dbRepo, {});
        });

        it('ok', () => {
            const dbRepo = {} as any;
            const mockUow = new Mock<IUnitOfWork>();
            uowDbOption(mockUow.actual)(null, dbRepo);
            deepStrictEqual(dbRepo, {
                isTx: true,
                uow: mockUow.actual
            });
        });
    });
});