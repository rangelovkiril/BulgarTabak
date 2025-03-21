declare module "lowdb" {
  export default function <T>(adapter: any): LowdbSync<T>;
  export interface LowdbSync<T> {
    defaults(defaults: T): LowdbSync<T>;
    get<U extends keyof T>(name: U): Chain<T[U]>;
    set<U extends keyof T>(name: U, value: T[U]): LowdbSync<T>;
    update<U extends keyof T>(name: U, fn: (value: T[U]) => T[U]): LowdbSync<T>;
    write(): LowdbSync<T>;
    read(): LowdbSync<T>;
    state: T;
  }
  export interface Chain<T> {
    find(predicate: any): Chain<any>;
    filter(predicate: any): Chain<T[]>;
    assign(object: any): Chain<any>;
    value(): T;
    push(value: any): Chain<T>;
    write(): LowdbSync<any>;
  }
}

declare module "lowdb/adapters/FileSync" {
  export default class FileSync<T> {
    constructor(filename: string);
  }
}

declare module "uuid" {
  export function v4(): string;
}
