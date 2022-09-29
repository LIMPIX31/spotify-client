import type { Pagination } from './entities/index.js'
import { Paginated } from './api.types.js'

export type Awaitable<T> = Promise<T> | T
export type FactoryValue<T> = Awaitable<T> | ((...args: any[]) => Awaitable<T>)
export interface Constructor<T>{
  new (...args: any[]): T
}

type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;
type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];
export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;
export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;
export type ConstructorMapUnion<T extends any> = T[keyof T] extends new (...args: any) => infer R ? R : T
export type XPagination<T, E> = Pagination<T, E> & Paginated<E>
export type XUnionPagination<T, E> = XPagination<ConstructorMapUnion<T>, E>
