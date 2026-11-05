import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Image, ImagesService} from './images.service';

describe('ImagesService', () => {
  let service: ImagesService;
  let http: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]});
    service = TestBed.inject(ImagesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      http.verify();
    } finally {
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });

  it('fetches metadata for the requested page and delays delivery by 400ms', () => {
    const images: Image[] = [{id: '42'}];
    const received = vi.fn();
    service.getImages(2, 10).subscribe(received);
    const request = http.expectOne('https://picsum.photos/v2/list?page=2&limit=10');
    expect(request.request.method).toBe('GET');
    request.flush(images);

    vi.advanceTimersByTime(399);
    expect(received).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(received).toHaveBeenCalledExactlyOnceWith(images);
  });

  it('propagates HTTP errors and allows retrying the same page', () => {
    const error = vi.fn();
    service.getImages(1, 30).subscribe({error});
    http.expectOne('https://picsum.photos/v2/list?page=1&limit=30').flush('Unavailable', {
      status: 503, statusText: 'Unavailable',
    });
    expect(error).toHaveBeenCalledOnce();

    const received = vi.fn();
    service.getImages(1, 30).subscribe(received);
    http.expectOne('https://picsum.photos/v2/list?page=1&limit=30').flush([{id: '42'}]);
    vi.advanceTimersByTime(400);
    expect(received).toHaveBeenCalledWith([{id: '42'}]);
  });

  it('constructs a fixed-size image URL from the ID', () => {
    expect(service.imageUrl({id: '42'})).toBe('https://picsum.photos/id/42/300');
  });

  it('delivers an empty page after the same delay', () => {
    const received = vi.fn();
    service.getImages(3, 30).subscribe(received);
    http.expectOne('https://picsum.photos/v2/list?page=3&limit=30').flush([]);
    expect(received).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    expect(received).toHaveBeenCalledExactlyOnceWith([]);
  });

  it('cancels a pending HTTP request when unsubscribed', () => {
    const subscription = service.getImages(1, 30).subscribe();
    const request = http.expectOne('https://picsum.photos/v2/list?page=1&limit=30');
    subscription.unsubscribe();
    expect(request.cancelled).toBe(true);
  });

  it('does not deliver a delayed response after unsubscribing', () => {
    const received = vi.fn();
    const subscription = service.getImages(1, 30).subscribe(received);
    http.expectOne('https://picsum.photos/v2/list?page=1&limit=30').flush([{id: '42'}]);
    subscription.unsubscribe();
    vi.advanceTimersByTime(400);
    expect(received).not.toHaveBeenCalled();
  });
});
