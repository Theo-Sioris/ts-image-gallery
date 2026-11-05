import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ImageCard} from './image-card';
import {ImagesService} from '../../services/images.service';

describe('ImageCard', () => {
  let fixture: ComponentFixture<ImageCard>;
  const imageUrl = vi.fn(() => 'https://picsum.photos/id/42/300');

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ImageCard],
      providers: [{provide: ImagesService, useValue: {imageUrl}}],
    });
    fixture = TestBed.createComponent(ImageCard);
    fixture.componentRef.setInput('image', {id: '42'});
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    vi.clearAllMocks();
  });

  it('transforms the image input into a URL and renders a fixed-size lazy image', () => {
    expect(imageUrl).toHaveBeenCalledWith({id: '42'});
    expect(fixture.componentInstance.imageUrl()).toBe('https://picsum.photos/id/42/300');
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toBe('https://picsum.photos/id/42/300');
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
    expect(img.getAttribute('width')).toBe('300');
    expect(img.getAttribute('height')).toBe('300');
    expect(img.getAttribute('alt')).toBe('Gallery photograph');
    expect(img.classList.contains('loaded')).toBe(false);
    expect(fixture.nativeElement.querySelector('.image-wrapper').classList.contains('loading')).toBe(true);
  });

  it('emits the image when clicked', () => {
    const clicked = vi.fn();
    fixture.componentInstance.imageClicked.subscribe(clicked);
    fixture.nativeElement.querySelector('.image-wrapper').click();
    expect(clicked).toHaveBeenCalledExactlyOnceWith({id: '42'});
  });

  it('shows the saved indicator only for favorite images', () => {
    expect(fixture.nativeElement.querySelector('mat-icon')).toBeNull();
    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-icon').getAttribute('aria-label')).toBe('Saved to favorites');
    fixture.componentRef.setInput('isFavorite', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-icon')).toBeNull();
  });

  it('removes the placeholder and reveals the image when it loads', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    img.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    expect(img.classList.contains('loaded')).toBe(true);
    expect(fixture.nativeElement.querySelector('.image-wrapper').classList.contains('loading')).toBe(false);
  });

  it('replaces a failed image with the fallback state', () => {
    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Image unavailable');
    expect(fixture.nativeElement.querySelector('.image-wrapper').classList.contains('loading')).toBe(false);
  });
});
