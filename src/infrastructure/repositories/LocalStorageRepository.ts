export class LocalStorageRepository<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  get(): T | null {
    const value = localStorage.getItem(this.key);

    return value ? JSON.parse(value) : null;
  }

  set(payload: T): void {
    localStorage.setItem(this.key, JSON.stringify(payload));
  }

  remove(): void {
    localStorage.removeItem(this.key);
  }
}
