import { IUnitOfWork } from './i-unit-of-work';

export interface IRandSeedService {
    get(uow: IUnitOfWork, len: number, offset: number): Promise<number>;
    use(uow: IUnitOfWork, len: number): Promise<number>;
}