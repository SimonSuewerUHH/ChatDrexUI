import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DrugstOneNetworkRegistryService {
  private nextId = 1;
  private readonly ids = signal<number[]>([]);
  private readonly _activeId = signal<number | null>(null);

  readonly activeId = computed(() => this._activeId());

  register(): number {
    const id = this.nextId++;
    this.ids.update(list => [...list, id]);
    this._activeId.set(id);
    return id;
  }

  unregister(id: number) {
    this.ids.update(list => list.filter(x => x !== id));
    if (this._activeId() === id) {
      // if active was removed, fall back to latest remaining (max id) or null
      const remaining = this.ids();
      this._activeId.set(remaining.length ? Math.max(...remaining) : null);
    }
  }

  setActive(id: number) {
    if (this.ids().includes(id)) this._activeId.set(id);
  }

  isActive(id: number) {
    return computed(() => this._activeId() === id);
  }

  latestId() {
    return computed(() => {
      const list = this.ids();
      return list.length ? Math.max(...list) : null;
    });
  }
}
