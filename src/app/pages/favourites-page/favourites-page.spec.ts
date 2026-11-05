import {TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {FavoritesService} from '../../services/favorites.service';
import {FavouritesPage} from './favourites-page';

describe('FavouritesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({providers: [provideRouter([]), provideHttpClient()]});
  });
  afterEach(() => localStorage.clear());

  it('shows an empty state explaining how to save photos', async () => {
    const fixture = TestBed.createComponent(FavouritesPage);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('No favorites yet');
    expect(fixture.nativeElement.textContent).toContain('Click a photograph on the Photos page');
  });

  it('updates the gallery when favorites are added and the last one is removed', async () => {
    const favorites = TestBed.inject(FavoritesService);
    const fixture = TestBed.createComponent(FavouritesPage);
    await fixture.whenStable();
    favorites.add({id: '42'});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-image-card')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).not.toContain('No favorites yet');
    favorites.remove({id: '42'});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-image-card')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No favorites yet');
  });

  it('opens the selected favorite without changing favorites', async () => {
    const favorites = TestBed.inject(FavoritesService);
    for (let id = 0; id < 40; id++) favorites.add({id: String(id)});
    const fixture = TestBed.createComponent(FavouritesPage);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('app-image-card')).toHaveLength(40);
    const add = vi.spyOn(favorites, 'add');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.nativeElement.querySelector('app-image-card .image-wrapper').click();
    expect(navigate).toHaveBeenCalledWith(['/photos', '0']);
    expect(add).not.toHaveBeenCalled();
    expect(favorites.images()).toHaveLength(40);
  });
});
