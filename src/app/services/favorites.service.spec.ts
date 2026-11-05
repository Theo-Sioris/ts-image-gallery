import {TestBed} from '@angular/core/testing';
import {FavoritesService} from './favorites.service';

describe('FavoritesService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('adds favorites once and restores them after service recreation', () => {
    const service = TestBed.inject(FavoritesService);
    service.add({id: '42'});
    service.add({id: '42'});
    service.add({id: '7'});
    expect(service.images()).toEqual([{id: '42'}, {id: '7'}]);

    TestBed.resetTestingModule();
    expect(TestBed.inject(FavoritesService).images()).toEqual([{id: '42'}, {id: '7'}]);
  });

  it('removes only the requested favorite and persists the change', () => {
    const service = TestBed.inject(FavoritesService);
    service.add({id: '42'});
    service.add({id: '43'});
    expect(service.isFavorite({id: '42'})).toBe(true);
    service.remove({id: '42'});
    expect(service.isFavorite({id: '42'})).toBe(false);
    expect(service.images()).toEqual([{id: '43'}]);
    TestBed.resetTestingModule();
    expect(TestBed.inject(FavoritesService).images()).toEqual([{id: '43'}]);
  });

  it('keeps favorites usable when persistence fails', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Full');
    });
    try {
      const service = TestBed.inject(FavoritesService);
      expect(() => service.add({id: '42'})).not.toThrow();
      expect(service.images()).toEqual([{id: '42'}]);
      expect(() => service.remove({id: '42'})).not.toThrow();
      expect(service.images()).toEqual([]);
    } finally {
      write.mockRestore();
    }
  });
});
