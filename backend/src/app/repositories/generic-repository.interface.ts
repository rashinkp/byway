export interface IGenericRepository<T> {
  create(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  find(filter?: any): Promise<T[]>;
  update(id: string, entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<T>;
  count(filter?: any): Promise<number>;
}
