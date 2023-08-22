export class BrowserHistoryRepository<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  get(): T | null {
    return window.history.state?.[this.key] ?? null;
  }

  set(payload: T | null): void {
    window.history.pushState({ [this.key]: payload }, "", "");
  }

  update(payload: T | null): void {
    window.history.replaceState({ [this.key]: payload }, "", "");
  }
}
