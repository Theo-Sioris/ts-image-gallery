import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {PhotoPage} from './photo-page';
import {FavoritesService} from '../../services/favorites.service';

describe('PhotoPage', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'photos/:id', component: PhotoPage}])],
    });
  });

  afterEach(() => localStorage.clear());

  it('renders the routed photo and removes it from persisted favorites', async () => {
    const favorites = TestBed.inject(FavoritesService);
    favorites.add({id: '42'});
    favorites.add({id: '43'});
    const harness = await RouterTestingHarness.create('/photos/42');
    expect(harness.routeNativeElement!.querySelector('img')!.src).toContain('/id/42/1920/1080');
    harness.routeNativeElement!.querySelector('button')!.click();
    harness.detectChanges();
    expect(favorites.images()).toEqual([{id: '43'}]);
    expect(JSON.parse(localStorage.getItem('favourite_images')!)).toEqual([{id: '43'}]);
    expect(harness.routeNativeElement!.querySelector('button')).toBeNull();
  });

  it('hides the removal action for a photo that is not a favorite', async () => {
    const harness = await RouterTestingHarness.create('/photos/42');
    expect(harness.routeNativeElement!.querySelector('img')!.alt).toBe('Photograph 42');
    expect(harness.routeNativeElement!.querySelector('button')).toBeNull();
  });


  it('updates the photo when navigating between IDs and handles a failed image', async () => {
    const harness = await RouterTestingHarness.create('/photos/42');
    await harness.navigateByUrl('/photos/43');
    const img = harness.routeNativeElement!.querySelector('img')!;
    expect(img.src).toContain('/id/43/');
    img.dispatchEvent(new Event('error'));
    harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('Image unavailable');
  });
});
