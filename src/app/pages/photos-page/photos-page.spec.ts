import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Subject} from 'rxjs';
import {PhotosPage} from './photos-page';
import {Image, ImagesService} from '../../services/images.service';

const page = (start = 0): Image[] => Array.from({length: 30}, (_, i) => ({id: String(start + i)}));

describe('PhotosPage', () => {
  let fixture: ComponentFixture<PhotosPage>;
  let callback: IntersectionObserverCallback;
  let requests: Subject<Image[]>[];
  let getImages: ReturnType<typeof vi.fn>;
  let observerOptions: IntersectionObserverInit | undefined;
  const observe = vi.fn();
  const disconnect = vi.fn();
  const intersect = (isIntersecting = true) => callback(
    [{isIntersecting} as IntersectionObserverEntry], {} as IntersectionObserver,
  );

  const respond = (index: number, images: Image[]) => {
    requests[index].next(images);
    requests[index].complete();
  };

  beforeEach(async () => {
    requests = [];
    getImages = vi.fn(() => {
      const request = new Subject<Image[]>();
      requests.push(request);
      return request.asObservable();
    });
    vi.stubGlobal('IntersectionObserver', class {
      constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        callback = cb;
        observerOptions = options;
      }
      observe = observe;
      disconnect = disconnect;
    });
    TestBed.configureTestingModule({
      imports: [PhotosPage],
      providers: [{provide: ImagesService, useValue: {
        getImages,
        imageUrl: (image: Image) => `https://picsum.photos/id/${image.id}/300`,
      }}],
    });
    fixture = TestBed.createComponent(PhotosPage);
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('loads the initial page and shows skeletons until the metadata arrives', () => {
    expect(getImages).toHaveBeenCalledExactlyOnceWith(1, 30);
    expect(fixture.componentInstance.loading()).toBe(true);
    expect(observe).toHaveBeenCalledWith(fixture.nativeElement.querySelector('.sentinel'));
    expect(observerOptions?.rootMargin?.trim().split(/\s+/)).toEqual(['300px', '300px']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.skeleton')).toHaveLength(6);

    respond(0, page());
    fixture.detectChanges();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.nativeElement.querySelectorAll('app-image-card')).toHaveLength(30);
    expect(fixture.nativeElement.querySelector('app-gallery-skeletons')).toBeNull();
  });

  it('ignores non-intersecting entries and prevents overlapping page requests', () => {
    intersect();
    intersect();
    expect(getImages).toHaveBeenCalledTimes(1);
    respond(0, page());
    intersect(false);
    expect(getImages).toHaveBeenCalledTimes(1);

    intersect();
    intersect();
    expect(getImages).toHaveBeenCalledTimes(2);
    expect(getImages).toHaveBeenLastCalledWith(2, 30);
    expect(fixture.componentInstance.images()).toEqual(page());
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-image-card')).toHaveLength(30);
    expect(fixture.nativeElement.querySelector('app-gallery-skeletons')).toBeNull();
    expect(fixture.nativeElement.querySelector('mat-spinner')).not.toBeNull();
    respond(1, page(30));
    expect(fixture.componentInstance.images()).toEqual([...page(), ...page(30)]);
  });

  it('retains existing images and retries the same failed page through the Retry button', () => {
    respond(0, page());
    intersect();
    requests[1].error(new Error('Offline'));
    expect(fixture.componentInstance.error()).toBe(true);
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.images()).toEqual(page());
    intersect();
    expect(getImages).toHaveBeenCalledTimes(2);

    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(getImages).toHaveBeenLastCalledWith(2, 30);
    expect(fixture.componentInstance.error()).toBe(false);
    respond(2, page(30));
    expect(getImages).toHaveBeenCalledTimes(3);
    expect(fixture.componentInstance.images()).toEqual([...page(), ...page(30)]);
  });

  it('allows retrying an initial loading error', () => {
    requests[0].error(new Error('Offline'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-gallery-skeletons')).toBeNull();
    fixture.nativeElement.querySelector('button').click();
    expect(getImages).toHaveBeenLastCalledWith(1, 30);
    respond(1, page());
    expect(fixture.componentInstance.images()).toEqual(page());
  });

  it('disconnects the observer, unsubscribes, and prevents requests after destruction', () => {
    expect(requests[0].observed).toBe(true);
    fixture.destroy();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(requests[0].observed).toBe(false);
    intersect();
    expect(getImages).toHaveBeenCalledTimes(1);
  });

  it('cleans up an in-progress subsequent page without changing existing images', () => {
    respond(0, page());
    intersect();
    expect(requests[1].observed).toBe(true);

    fixture.destroy();
    expect(requests[1].observed).toBe(false);
    requests[1].next(page(30));
    expect(fixture.componentInstance.images()).toEqual(page());
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
