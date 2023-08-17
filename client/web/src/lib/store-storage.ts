export class StoreStorage {
  static save<T extends object, V>(instance: T, key: keyof T, value: V): V {
    localStorage.setItem(this.getKey(instance, key), JSON.stringify(value));
    return value;
  }

  static load<T extends object, R>(
    instance: T,
    key: keyof T,
    defaultValue: R
  ): R {
    const value = localStorage.getItem(this.getKey(instance, key));
    if (!value) {
      return defaultValue;
    }

    return JSON.parse(value);
  }

  static getKey<T extends object>(instance: T, key: keyof T) {
    return `StoreStorage_${instance.constructor.name}_${String(key)}`;
  }
}
