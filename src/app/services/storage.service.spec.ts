import {StorageService} from './storage.service';

describe('StorageService', () => {
  const storage = new StorageService();

  beforeEach(() => localStorage.clear());
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it('round-trips JSON and returns null for missing or malformed data', () => {
    expect(storage.get('favorites')).toBeNull();
    storage.set('favorites', [{id: '42'}]);
    expect(storage.get('favorites')).toEqual([{id: '42'}]);
    localStorage.setItem('favorites', 'invalid json');
    expect(storage.get('favorites')).toBeNull();
  });

  it('handles unavailable browser storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Full'); });
    expect(storage.get('favorites')).toBeNull();
    expect(() => storage.set('favorites', [])).not.toThrow();
  });
});
