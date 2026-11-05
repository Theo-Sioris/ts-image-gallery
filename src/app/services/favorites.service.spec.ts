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

  it('ignores invalid stored shapes and removes duplicate IDs', () => {
    localStorage.setItem('favorites', JSON.stringify([null, {}, {id: 3}, {id: ''}, {id: '42'}, {id: '42'}]));
    expect(TestBed.inject(FavoritesService).images()).toEqual([{id: '42'}]);
  });

  it('starts empty when the stored value is not an array', () => {
    localStorage.setItem('favorites', '{}');
    expect(TestBed.inject(FavoritesService).images()).toEqual([]);
  });
});
