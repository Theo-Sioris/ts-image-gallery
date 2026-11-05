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

  it('shows an empty state with a link to Photos', async () => {
    const fixture = TestBed.createComponent(FavouritesPage);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('No favorites yet');
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('/');
  });

  it('opens the selected favorite without changing favorites', async () => {
    const favorites = TestBed.inject(FavoritesService);
    for (let id = 0; id < 40; id++) favorites.add({id: String(id)});
    const fixture = TestBed.createComponent(FavouritesPage);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('app-image-card')).toHaveLength(40);
    const add = vi.spyOn(favorites, 'add');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.nativeElement.querySelector('app-image-card button').click();
    expect(navigate).toHaveBeenCalledWith(['/photos', '0']);
    expect(add).not.toHaveBeenCalled();
    expect(favorites.images()).toHaveLength(40);
  });
});
